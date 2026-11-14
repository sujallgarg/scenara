import { strict as assert } from 'node:assert';
import { describe, it, before, after } from 'node:test';
import { NextRequest } from 'next/server';
import { GET as streamHandler } from '../src/app/api/simulations/[id]/stream/route';
import { prisma } from '../src/lib/prisma';
import { generateToken } from '../src/lib/auth';

describe('SSE Streaming and Reconnection', () => {
  let userId: string;
  let otherUserId: string;
  let token: string;
  let otherToken: string;
  let simId: string;

  before(async () => {
    const user = await prisma.user.create({
      data: {
        email: `sse-user-${Date.now()}@test.com`,
        name: 'SSE Test User',
        passwordHash: 'dummy',
      },
    });
    userId = user.id;
    token = generateToken({ userId: user.id, email: user.email });

    const otherUser = await prisma.user.create({
      data: {
        email: `sse-other-${Date.now()}@test.com`,
        name: 'SSE Other User',
        passwordHash: 'dummy',
      },
    });
    otherUserId = otherUser.id;
    otherToken = generateToken({ userId: otherUser.id, email: otherUser.email });

    const sim = await prisma.simulation.create({
      data: {
        userId,
        title: 'SSE Test Simulation',
        scenarioPrompt: 'Testing real-time event streaming and client reconnection',
        domain: 'Real-time Streaming',
        status: 'READY',
      },
    });
    simId = sim.id;
  });

  after(async () => {
    if (simId) {
      await prisma.simulation.delete({ where: { id: simId } }).catch(() => {});
    }
    await prisma.user.deleteMany({
      where: { id: { in: [userId, otherUserId] } },
    }).catch(() => {});
  });

  it('Returns 401 for unauthorized SSE request', async () => {
    const req = new NextRequest(`http://localhost:3000/api/simulations/${simId}/stream`, {
      method: 'GET',
    });

    const res = await streamHandler(req, { params: Promise.resolve({ id: simId }) });
    assert.equal(res.status, 401);
  });

  it('Returns 404 when user attempts to stream another user simulation', async () => {
    const req = new NextRequest(`http://localhost:3000/api/simulations/${simId}/stream`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${otherToken}` },
    });

    const res = await streamHandler(req, { params: Promise.resolve({ id: simId }) });
    assert.equal(res.status, 404);
  });

  it('Establishes SSE stream with correct SSE headers and retry directive', async () => {
    const abortController = new AbortController();
    const req = new NextRequest(`http://localhost:3000/api/simulations/${simId}/stream`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      signal: abortController.signal,
    });

    const res = await streamHandler(req, { params: Promise.resolve({ id: simId }) });
    assert.equal(res.status, 200);

    // Verify headers
    const contentType = res.headers.get('Content-Type');
    assert.ok(contentType?.includes('text/event-stream'), `Expected text/event-stream, got ${contentType}`);

    const cacheControl = res.headers.get('Cache-Control');
    assert.ok(cacheControl?.includes('no-cache'));

    // Critical for SSE reconnection resilience:
    const retryHeader = res.headers.get('retry');
    assert.equal(retryHeader, '3000', 'Should instruct client to retry in 3000ms upon drop');

    // Read initial event from stream
    const reader = res.body?.getReader();
    assert.ok(reader, 'Response should have a readable body stream');

    const { value, done } = await reader!.read();
    assert.equal(done, false);

    const chunk = new TextDecoder().decode(value);
    assert.ok(chunk.includes('event: connected'), `Chunk should contain connected event: ${chunk}`);
    assert.ok(chunk.includes(simId), 'Chunk should contain simulationId');

    // Cleanup by cancelling reader and aborting
    await reader!.cancel();
    abortController.abort();
  });
});

