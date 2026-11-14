import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-error';
import { SimulationCreateSchema } from '@/lib/validation';

// GET /api/simulations - list user's simulations
export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return apiError('Unauthorized', 401);

  const simulations = await prisma.simulation.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, domain: true, status: true,
      agentCount: true, totalRounds: true, currentRound: true,
      createdAt: true, updatedAt: true,
    },
  });
  return apiSuccess({ simulations });
}

// POST /api/simulations - create a new simulation
export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return apiError('Unauthorized', 401);

  try {
    const body = await req.json();
    const parsed = SimulationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }
    const { title, scenarioPrompt, domain, agentCount, totalRounds, parameters } = parsed.data;

    const simulation = await prisma.simulation.create({
      data: {
        userId: auth.userId,
        title,
        scenarioPrompt,
        domain,
        agentCount,
        totalRounds,
        parameters: JSON.stringify(parameters),
        status: 'DRAFT',
      },
    });
    return apiSuccess({ simulation }, 201);
  } catch (err) {
    console.error('[simulations POST]', err);
    return apiError('Internal server error', 500);
  }
}
