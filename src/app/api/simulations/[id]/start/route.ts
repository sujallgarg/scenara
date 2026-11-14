import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-error';
import { enqueueSimulation } from '@/lib/worker';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return apiError('Unauthorized', 401);

  const { id } = await params;
  const sim = await prisma.simulation.findUnique({ where: { id } });
  if (!sim || sim.userId !== auth.userId) return apiError('Simulation not found', 404);

  if (!['DRAFT', 'READY', 'PAUSED', 'FAILED'].includes(sim.status)) {
    return apiError(`Cannot start simulation in status: ${sim.status}`, 409);
  }

  await enqueueSimulation(id);

  // Trigger the worker (fire-and-forget internal call)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  fetch(`${baseUrl}/api/worker`, {
    method: 'POST',
    headers: {
      'x-worker-secret': process.env.WORKER_SECRET || 'dev-worker-secret',
      'Content-Type': 'application/json',
    },
  }).catch(err => console.error('[worker trigger]', err));

  return apiSuccess({ started: true, simulationId: id });
}
