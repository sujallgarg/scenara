import { strict as assert } from 'node:assert';
import { describe, it, before, after } from 'node:test';
import { NextRequest } from 'next/server';
import {
  enqueueSimulation,
  claimNextJob,
  completeJob,
  failJob,
  recoverStalledJobs,
  getJobStatus,
} from '../src/lib/worker';
import { POST as workerPostHandler, GET as workerGetHandler } from '../src/app/api/worker/route';
import { prisma } from '../src/lib/prisma';

describe('Background Worker Execution and Recovery', () => {
  let userId: string;
  let simId: string;

  before(async () => {
    const user = await prisma.user.create({
      data: {
        email: `worker-exec-${Date.now()}@test.com`,
        name: 'Worker Exec User',
        passwordHash: 'dummy',
      },
    });
    userId = user.id;

    const sim = await prisma.simulation.create({
      data: {
        userId,
        title: 'Background Worker Test Sim',
        scenarioPrompt: 'Simulating product launch under high market volatility',
        domain: 'Market Strategy',
        status: 'DRAFT',
      },
    });
    simId = sim.id;
  });

  after(async () => {
    if (simId) {
      await prisma.simulation.delete({ where: { id: simId } }).catch(() => {});
    }
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
  });

  it('Enqueues simulation and creates WorkerJob', async () => {
    const jobId = await enqueueSimulation(simId);
    assert.ok(jobId);

    const job = await getJobStatus(simId);
    assert.ok(job);
    assert.equal(job.status, 'QUEUED');
    assert.equal(job.attempts, 0);
    assert.equal(job.maxAttempts, 3);

    const sim = await prisma.simulation.findUnique({ where: { id: simId } });
    assert.equal(sim?.status, 'GENERATING_NETWORK');
  });

  it('Claims job atomically preventing concurrent double processing', async () => {
    const claimed1 = await claimNextJob();
    assert.ok(claimed1, 'First worker claims the job');
    assert.equal(claimed1!.simulationId, simId);

    // Second worker attempting claim immediately gets null because job is now RUNNING
    const claimed2 = await claimNextJob();
    assert.equal(claimed2, null, 'Second worker should find no available QUEUED jobs');

    const job = await prisma.workerJob.findUnique({ where: { id: claimed1!.jobId } });
    assert.equal(job?.status, 'RUNNING');
    assert.equal(job?.attempts, 1);
  });

  it('Retries failed job when attempts < maxAttempts', async () => {
    const job = await getJobStatus(simId);
    assert.ok(job);

    await failJob(job.id, 'Transient network timeout on Gemini API');

    const retriedJob = await prisma.workerJob.findUnique({ where: { id: job.id } });
    assert.equal(retriedJob?.status, 'QUEUED', 'Should be requeued for retry');
    assert.equal(retriedJob?.lastError, 'Transient network timeout on Gemini API');
    assert.equal(retriedJob?.attempts, 1);
  });

  it('Permanently fails job and marks simulation FAILED after max attempts', async () => {
    // Attempt 2
    const claim2 = await claimNextJob();
    assert.ok(claim2);
    await failJob(claim2!.jobId, 'Attempt 2 failed');

    // Attempt 3
    const claim3 = await claimNextJob();
    assert.ok(claim3);
    await failJob(claim3!.jobId, 'Final attempt 3 failed');

    const finalJob = await prisma.workerJob.findUnique({ where: { id: claim3!.jobId } });
    assert.equal(finalJob?.status, 'FAILED');
    assert.equal(finalJob?.attempts, 3);
    assert.ok(finalJob?.completedAt);

    const finalSim = await prisma.simulation.findUnique({ where: { id: simId } });
    assert.equal(finalSim?.status, 'FAILED');
  });

  it('Recovers stalled RUNNING jobs after unexpected crash', async () => {
    // Reset job to RUNNING with old timestamp (>10 mins ago)
    const job = await getJobStatus(simId);
    await prisma.workerJob.update({
      where: { id: job!.id },
      data: {
        status: 'RUNNING',
        startedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      },
    });

    const recoveredCount = await recoverStalledJobs();
    assert.ok(recoveredCount >= 1, 'Should recover at least 1 stalled job');

    const recoveredJob = await prisma.workerJob.findUnique({ where: { id: job!.id } });
    assert.equal(recoveredJob?.status, 'QUEUED');
    assert.ok(recoveredJob?.lastError?.includes('stalled'));
  });

  it('POST /api/worker endpoint processes queued job with valid secret', async () => {
    // Reset job to QUEUED
    const job = await getJobStatus(simId);
    await prisma.workerJob.update({
      where: { id: job!.id },
      data: { status: 'QUEUED' },
    });

    const req = new NextRequest('http://localhost:3000/api/worker', {
      method: 'POST',
      headers: {
        'x-worker-secret': process.env.WORKER_SECRET || 'dev-worker-secret',
      },
    });

    const res = await workerPostHandler(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.status, 'completed');
    assert.equal(data.simulationId, simId);

    const updatedSim = await prisma.simulation.findUnique({ where: { id: simId } });
    assert.equal(updatedSim?.status, 'READY');
  });

  it('POST /api/worker rejects request without valid secret with 403', async () => {
    const req = new NextRequest('http://localhost:3000/api/worker', {
      method: 'POST',
      headers: {
        'x-worker-secret': 'invalid-secret-key',
      },
    });

    const res = await workerPostHandler(req);
    assert.equal(res.status, 403);
  });

  it('GET /api/worker returns job queue statistics', async () => {
    const req = new NextRequest('http://localhost:3000/api/worker', {
      method: 'GET',
      headers: {
        'x-worker-secret': process.env.WORKER_SECRET || 'dev-worker-secret',
      },
    });

    const res = await workerGetHandler(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(typeof data.queued, 'number');
    assert.equal(typeof data.running, 'number');
    assert.equal(typeof data.failed, 'number');
  });
});

