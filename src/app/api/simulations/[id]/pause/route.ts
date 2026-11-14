import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-error';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return apiError('Unauthorized', 401);

  const { id } = await params;
  const sim = await prisma.simulation.findUnique({ where: { id } });
  if (!sim || sim.userId !== auth.userId) return apiError('Simulation not found', 404);

  if (sim.status !== 'RUNNING') {
    return apiError(`Cannot pause simulation in status: ${sim.status}`, 409);
  }

  await prisma.simulation.update({ where: { id }, data: { status: 'PAUSED' } });
  return apiSuccess({ paused: true, simulationId: id });
}
