import { NextRequest, NextResponse } from 'next/server';
import { claimNextJob, completeJob, failJob } from '@/lib/worker';
import { prisma } from '@/lib/prisma';

// Internal worker trigger - protected by a shared secret or run server-side only
export async function POST(req: NextRequest) {
  // Allow internal calls with a worker secret header
  const workerSecret = req.headers.get('x-worker-secret');
  const expectedSecret = process.env.WORKER_SECRET || 'dev-worker-secret';
  if (workerSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const job = await claimNextJob();
  if (!job) {
    return NextResponse.json({ status: 'no_jobs' });
  }

  console.log(`[worker] Processing job ${job.jobId} for simulation ${job.simulationId}`);

  // Kick off processing - note: for Next.js we return immediately and let it run
  // The actual simulation engine will be built in Phase 2 (Gemini integration)
  // For now we update status to RUNNING so SSE clients can see it
  try {
    // Phase 1: Just validate the simulation exists and is in correct state
    const sim = await prisma.simulation.findUnique({ where: { id: job.simulationId } });
    if (!sim) {
      await failJob(job.jobId, 'Simulation not found');
      return NextResponse.json({ status: 'failed', reason: 'Simulation not found' });
    }

    // Update simulation to READY (actual network generation happens in Phase 2)
    await prisma.simulation.update({
      where: { id: job.simulationId },
      data: { status: 'READY' },
    });

    await completeJob(job.jobId);
    return NextResponse.json({ status: 'completed', jobId: job.jobId, simulationId: job.simulationId });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await failJob(job.jobId, errorMsg);
    return NextResponse.json({ status: 'failed', error: errorMsg }, { status: 500 });
  }
}

// GET worker status
export async function GET(req: NextRequest) {
  const workerSecret = req.headers.get('x-worker-secret');
  const expectedSecret = process.env.WORKER_SECRET || 'dev-worker-secret';
  if (workerSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const queued = await prisma.workerJob.count({ where: { status: 'QUEUED' } });
  const running = await prisma.workerJob.count({ where: { status: 'RUNNING' } });
  const failed = await prisma.workerJob.count({ where: { status: 'FAILED' } });
  return NextResponse.json({ queued, running, failed });
}
