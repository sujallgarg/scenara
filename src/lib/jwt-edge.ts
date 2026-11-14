import { jwtVerify } from 'jose/jwt/verify';

export async function verifyTokenEdge(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-dev-secret');
    const { payload } = await jwtVerify(token, secret);
    if (payload.userId && payload.email) {
      return { userId: payload.userId as string, email: payload.email as string };
    }
    return null;
  } catch {
    return null;
  }
}
