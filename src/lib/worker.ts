import { prisma } from './prisma';

export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';

/**
 * Enqueue a simulation for background execution.
 * Uses upsert so it's safe to call multiple times (idempotent).
 */
export async function enqueueSimulation(simulationId: string): Promise<string> {
  const job = await prisma.workerJob.upsert({
    where: { simulationId },
    update: { status: 'QUEUED', attempts: 0, lastError: null, startedAt: null, completedAt: null },
    create: {
      simulationId,
      status: 'QUEUED',
      maxAttempts: 3,
    },
  });
  await prisma.simulation.update({
    where: { id: simulationId },
    data: { status: 'GENERATING_NETWORK' },
  });
  return job.id;
}

/**
 * Claim a QUEUED job for processing. Returns null if no jobs are available.
 * Uses an atomic update to prevent double-processing.
 */
export async function claimNextJob(): Promise<{ jobId: string; simulationId: string } | null> {
  // Find the oldest queued job
  const job = await prisma.workerJob.findFirst({
    where: { status: 'QUEUED' },
    orderBy: { createdAt: 'asc' },
  });
  if (!job) return null;

  // Atomically claim it - only succeeds if still QUEUED
  const updated = await prisma.workerJob.updateMany({
    where: { id: job.id, status: 'QUEUED' },
    data: { status: 'RUNNING', startedAt: new Date(), attempts: { increment: 1 } },
  });
  if (updated.count === 0) return null; // Another worker claimed it

  return { jobId: job.id, simulationId: job.simulationId };
}

/**
 * Mark a job as completed.
 */
export async function completeJob(jobId: string): Promise<void> {
  await prisma.workerJob.update({
    where: { id: jobId },
    data: { status: 'COMPLETED', completedAt: new Date() },
  });
}

/**
 * Mark a job as failed with an error message.
 * Automatically requeues if attempts < maxAttempts.
 */
export async function failJob(jobId: string, error: string): Promise<void> {
  const job = await prisma.workerJob.findUnique({ where: { id: jobId } });
  if (!job) return;

  if (job.attempts < job.maxAttempts) {
    // Requeue for retry
    await prisma.workerJob.update({
      where: { id: jobId },
      data: { status: 'QUEUED', lastError: error },
    });
    console.log(`[worker] Job ${jobId} failed (attempt ${job.attempts}/${job.maxAttempts}), requeuing`);
  } else {
    // Permanently failed
    await prisma.workerJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', lastError: error, completedAt: new Date() },
    });
    await prisma.simulation.update({
      where: { id: job.simulationId },
      data: { status: 'FAILED' },
    });
    console.log(`[worker] Job ${jobId} permanently failed after ${job.attempts} attempts: ${error}`);
  }
}

/**
 * Get job status for a simulation.
 */
export async function getJobStatus(simulationId: string) {
  return prisma.workerJob.findUnique({ where: { simulationId } });
}

/**
 * Recover stalled RUNNING jobs (e.g. after server restart).
 * Any job that has been RUNNING for more than 10 minutes is considered stalled.
 */
export async function recoverStalledJobs(): Promise<number> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const result = await prisma.workerJob.updateMany({
    where: {
      status: 'RUNNING',
      startedAt: { lt: tenMinutesAgo },
    },
    data: {
      status: 'QUEUED',
      lastError: 'Recovered from stalled state after server restart',
    },
  });
  if (result.count > 0) {
    console.log(`[worker] Recovered ${result.count} stalled job(s)`);
  }
  return result.count;
}
