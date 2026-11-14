import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-error';

// Strict ownership check helper
async function getOwnedSimulation(simulationId: string, userId: string) {
  const sim = await prisma.simulation.findUnique({ where: { id: simulationId } });
  if (!sim) return null;
  if (sim.userId !== userId) return null; // ownership isolation
  return sim;
}

// GET /api/simulations/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return apiError('Unauthorized', 401);

  const { id } = await params;
  const sim = await getOwnedSimulation(id, auth.userId);
  if (!sim) return apiError('Simulation not found', 404);

  const full = await prisma.simulation.findUnique({
    where: { id },
    include: {
      agents: true,
      relationships: true,
      rounds: { orderBy: { roundNumber: 'asc' } },
      result: true,
      workerJob: true,
    },
  });
  return apiSuccess({ simulation: full });
}

// DELETE /api/simulations/:id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return apiError('Unauthorized', 401);

  const { id } = await params;
  const sim = await getOwnedSimulation(id, auth.userId);
  if (!sim) return apiError('Simulation not found', 404);

  await prisma.simulation.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
