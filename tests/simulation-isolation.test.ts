import { strict as assert } from 'node:assert';
import { describe, it, before, after } from 'node:test';
import { NextRequest } from 'next/server';
import { GET as listSimulations, POST as createSimulation } from '../src/app/api/simulations/route';
import { GET as getSimulation, DELETE as deleteSimulation } from '../src/app/api/simulations/[id]/route';
import { prisma } from '../src/lib/prisma';
import { generateToken } from '../src/lib/auth';

describe('Simulation Ownership and Isolation', () => {
  let userA: { id: string; email: string };
  let tokenA: string;

  let userB: { id: string; email: string };
  let tokenB: string;

  let simIdA: string;

  before(async () => {
    // Create User A
    const dbUserA = await prisma.user.create({
      data: {
        email: `usera-${Date.now()}@test.com`,
        name: 'User Alpha',
        passwordHash: 'dummy',
      },
    });
    userA = { id: dbUserA.id, email: dbUserA.email };
    tokenA = generateToken({ userId: userA.id, email: userA.email });

    // Create User B
    const dbUserB = await prisma.user.create({
      data: {
        email: `userb-${Date.now()}@test.com`,
        name: 'User Beta',
        passwordHash: 'dummy',
      },
    });
    userB = { id: dbUserB.id, email: dbUserB.email };
    tokenB = generateToken({ userId: userB.id, email: userB.email });
  });

  after(async () => {
    if (simIdA) {
      await prisma.simulation.delete({ where: { id: simIdA } }).catch(() => {});
    }
    await prisma.user.deleteMany({
      where: { id: { in: [userA.id, userB.id] } },
    }).catch(() => {});
  });

  it('User A creates a simulation', async () => {
    const req = new NextRequest('http://localhost:3000/api/simulations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Alpha Market Strategy',
        scenarioPrompt: 'A simulation of competitive dynamics in the autonomous vehicle market',
        domain: 'Autonomous Vehicles',
        agentCount: 20,
        totalRounds: 4,
        parameters: {
          volatility: 0.4,
          clusteringCoefficient: 0.5,
          polarizationThreshold: 0.6,
        },
      }),
    });

    const res = await createSimulation(req);
    assert.equal(res.status, 201);

    const data = await res.json();
    assert.ok(data.simulation);
    assert.equal(data.simulation.userId, userA.id);
    assert.equal(data.simulation.title, 'Alpha Market Strategy');
    assert.equal(data.simulation.status, 'DRAFT');

    simIdA = data.simulation.id;
  });

  it('User A can list their own simulations', async () => {
    const req = new NextRequest('http://localhost:3000/api/simulations', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    const res = await listSimulations(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data.simulations));
    const found = data.simulations.find((s: any) => s.id === simIdA);
    assert.ok(found, 'User A should see their simulation');
  });

  it('User B cannot see User A simulation in list', async () => {
    const req = new NextRequest('http://localhost:3000/api/simulations', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenB}` },
    });

    const res = await listSimulations(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    const found = data.simulations.find((s: any) => s.id === simIdA);
    assert.equal(found, undefined, 'User B must NOT see User A simulation in list');
  });

  it('User A can retrieve their simulation details', async () => {
    const req = new NextRequest(`http://localhost:3000/api/simulations/${simIdA}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    const res = await getSimulation(req, { params: Promise.resolve({ id: simIdA }) });
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.simulation.id, simIdA);
    assert.equal(data.simulation.userId, userA.id);
  });

  it('User B cannot retrieve User A simulation (returns 404)', async () => {
    const req = new NextRequest(`http://localhost:3000/api/simulations/${simIdA}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenB}` },
    });

    const res = await getSimulation(req, { params: Promise.resolve({ id: simIdA }) });
    assert.equal(res.status, 404, 'Must return 404 to avoid leaking existence across users');

    const data = await res.json();
    assert.equal(data.error, 'Simulation not found');
  });

  it('User B cannot delete User A simulation (returns 404)', async () => {
    const req = new NextRequest(`http://localhost:3000/api/simulations/${simIdA}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` },
    });

    const res = await deleteSimulation(req, { params: Promise.resolve({ id: simIdA }) });
    assert.equal(res.status, 404);

    // Verify simulation still exists in DB
    const exists = await prisma.simulation.findUnique({ where: { id: simIdA } });
    assert.ok(exists, 'Simulation should not be deleted by unauthorized user');
  });

  it('User A can delete their own simulation', async () => {
    const req = new NextRequest(`http://localhost:3000/api/simulations/${simIdA}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    const res = await deleteSimulation(req, { params: Promise.resolve({ id: simIdA }) });
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.deleted, true);

    // Verify deleted in DB
    const exists = await prisma.simulation.findUnique({ where: { id: simIdA } });
    assert.equal(exists, null);
    simIdA = '';
  });
});

