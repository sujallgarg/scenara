import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';
import { generateToken } from '../src/lib/auth';

describe('Middleware Authentication & Authorization Guard', () => {
  const validToken = generateToken({ userId: 'user-123', email: 'test@example.com' });

  it('Blocks unauthenticated requests to /api/simulations with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/simulations');
    const res = await middleware(req);
    assert.equal(res.status, 401);
  });

  it('Allows authenticated requests to /api/simulations with valid Bearer token', async () => {
    const req = new NextRequest('http://localhost:3000/api/simulations', {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await middleware(req);
    assert.notEqual(res.status, 401);
  });

  it('Allows authenticated requests to /api/simulations with cookie token', async () => {
    const req = new NextRequest('http://localhost:3000/api/simulations', {
      headers: { cookie: `token=${validToken}` },
    });
    const res = await middleware(req);
    assert.notEqual(res.status, 401);
  });

  it('Allows public auth routes without any token', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login');
    const res = await middleware(req);
    assert.notEqual(res.status, 401);
  });

  it('Allows /api/worker requests presenting valid x-worker-secret', async () => {
    const req = new NextRequest('http://localhost:3000/api/worker', {
      headers: { 'x-worker-secret': process.env.WORKER_SECRET || 'dev-worker-secret' },
    });
    const res = await middleware(req);
    assert.notEqual(res.status, 401);
  });

  it('Blocks /api/worker requests with invalid secret and no token with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/worker', {
      headers: { 'x-worker-secret': 'wrong-secret' },
    });
    const res = await middleware(req);
    assert.equal(res.status, 401);
  });
});
