import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, generateApiKey } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-error';
import { RegisterSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }
    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return apiError('Email already registered', 409);

    const passwordHash = await hashPassword(password);
    const apiKey = generateApiKey();
    const user = await prisma.user.create({
      data: { email, name, passwordHash, apiKey },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return apiSuccess({
      token,
      user: { id: user.id, email: user.email, name: user.name, apiKey: user.apiKey },
    }, 201);
  } catch (err) {
    console.error('[register]', err);
    return apiError('Internal server error', 500);
  }
}
