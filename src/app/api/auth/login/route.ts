import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-error';
import { LoginSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return apiError('Invalid credentials', 401);

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return apiError('Invalid credentials', 401);

    const token = generateToken({ userId: user.id, email: user.email });
    return apiSuccess({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('[login]', err);
    return apiError('Internal server error', 500);
  }
}
