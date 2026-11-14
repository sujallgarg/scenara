import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return apiError('Unauthorized', 401);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, email: true, name: true, apiKey: true, createdAt: true },
  });
  if (!user) return apiError('User not found', 404);
  return apiSuccess({ user });
}
