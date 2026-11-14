import { strict as assert } from 'node:assert';
import { describe, it, before, after } from 'node:test';
import { NextRequest } from 'next/server';
import { POST as registerHandler } from '../src/app/api/auth/register/route';
import { POST as loginHandler } from '../src/app/api/auth/login/route';
import { GET as meHandler } from '../src/app/api/auth/me/route';
import { prisma } from '../src/lib/prisma';

describe('Auth API Integration', () => {
  const testEmail = `test-user-${Date.now()}@scenara.test`;
  const testPassword = 'StrongPassword123!';
  const testName = 'Integration Test User';
  let createdUserId: string;
  let authToken: string;

  after(async () => {
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
  });

  it('POST /api/auth/register creates user and returns token + apiKey', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await registerHandler(req);
    assert.equal(res.status, 201);

    const data = await res.json();
    assert.ok(data.token, 'Should return a JWT token');
    assert.ok(data.user, 'Should return user object');
    assert.equal(data.user.email, testEmail);
    assert.equal(data.user.name, testName);
    assert.ok(data.user.apiKey?.startsWith('sk_'), 'Should return an API key starting with sk_');

    createdUserId = data.user.id;
    authToken = data.token;

    // Verify password is not exposed
    assert.equal(data.user.passwordHash, undefined);
  });

  it('POST /api/auth/register prevents duplicate email', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: 'Another Name',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await registerHandler(req);
    assert.equal(res.status, 409);
    const data = await res.json();
    assert.equal(data.error, 'Email already registered');
  });

  it('POST /api/auth/register validates minimum password length', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: `short-${Date.now()}@scenara.test`,
        password: 'short',
        name: 'Short Pass',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await registerHandler(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes('8 characters'));
  });

  it('POST /api/auth/login authenticates with valid credentials', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await loginHandler(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(data.token, 'Should return JWT on successful login');
    assert.equal(data.user.email, testEmail);
  });

  it('POST /api/auth/login rejects wrong password with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999!',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await loginHandler(req);
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.error, 'Invalid credentials');
  });

  it('POST /api/auth/login rejects nonexistent user with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nobody@nowhere.test',
        password: 'AnyPassword123!',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await loginHandler(req);
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.error, 'Invalid credentials');
  });

  it('GET /api/auth/me returns current user profile with valid Bearer token', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const res = await meHandler(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.user.id, createdUserId);
    assert.equal(data.user.email, testEmail);
    assert.equal(data.user.name, testName);
    assert.ok(data.user.apiKey);
  });

  it('GET /api/auth/me rejects requests without token with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'GET',
    });

    const res = await meHandler(req);
    assert.equal(res.status, 401);
  });
});

