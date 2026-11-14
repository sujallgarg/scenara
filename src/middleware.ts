import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/jwt-edge';

const PROTECTED_PREFIXES = ['/api/simulations', '/api/agents'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow worker route to authenticate via x-worker-secret header
  if (pathname.startsWith('/api/worker')) {
    const workerSecret = request.headers.get('x-worker-secret');
    const expectedSecret = process.env.WORKER_SECRET || 'dev-worker-secret';
    if (workerSecret && workerSecret === expectedSecret) {
      return NextResponse.next();
    }
  }

  // Check if the route needs protection
  const needsAuth = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix)) || pathname.startsWith('/api/worker');
  if (!needsAuth) return NextResponse.next();

  // Try Authorization header
  const authHeader = request.headers.get('Authorization');
  let token: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }
  // Try cookie
  if (!token) {
    token = request.cookies.get('token')?.value ?? null;
  }

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyTokenEdge(token);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/simulations/:path*', '/api/agents/:path*', '/api/worker/:path*'],
};
