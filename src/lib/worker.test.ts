import { strict as assert } from 'node:assert';
import { describe, it, before, after } from 'node:test';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Import after env is set
import { enqueueSimulation, claimNextJob, completeJob, failJob, recoverStalledJobs } from './worker';

let testUserId: string;
let testSimId: string;

before(async () => {
  // Create test user and simulation
  const user = await prisma.user.create({
    data: {
      email: `worker-test-${Date.now()}@test.com`,
      name: 'Worker Test',
      passwordHash: 'hash',
    },
  });
  testUserId = user.id;

  const sim = await prisma.simulation.create({
    data: {
      userId: testUserId,
      title: 'Worker Test Sim',
      scenarioPrompt: 'Test scenario for worker testing purposes',
      domain: 'Test',
      status: 'DRAFT',
    },
  });
  testSimId = sim.id;
});

after(async () => {
  await prisma.simulation.delete({ where: { id: testSimId } }).catch(() => {});
  await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
  await prisma.$disconnect();
});

describe('worker', () => {
  it('enqueueSimulation creates a QUEUED job', async () => {
    const jobId = await enqueueSimulation(testSimId);
    assert.ok(jobId, 'Job ID should be returned');

    const job = await prisma.workerJob.findUnique({ where: { simulationId: testSimId } });
    assert.equal(job?.status, 'QUEUED');

    const sim = await prisma.simulation.findUnique({ where: { id: testSimId } });
    assert.equal(sim?.status, 'GENERATING_NETWORK');
  });

  it('claimNextJob atomically claims a QUEUED job', async () => {
    const claimed = await claimNextJob();
    assert.ok(claimed, 'Should claim a job');
    assert.equal(claimed!.simulationId, testSimId);

    const job = await prisma.workerJob.findUnique({ where: { simulationId: testSimId } });
    assert.equal(job?.status, 'RUNNING');
    assert.equal(job?.attempts, 1);
  });

  it('completeJob marks job as COMPLETED', async () => {
    const job = await prisma.workerJob.findUnique({ where: { simulationId: testSimId } });
    await completeJob(job!.id);

    const updated = await prisma.workerJob.findUnique({ where: { simulationId: testSimId } });
    assert.equal(updated?.status, 'COMPLETED');
    assert.ok(updated?.completedAt);
  });

  it('recoverStalledJobs requeues stalled RUNNING jobs', async () => {
    // Create another test scenario for this
    const sim2 = await prisma.simulation.create({
      data: {
        userId: testUserId,
        title: 'Stall Test Sim',
        scenarioPrompt: 'Test scenario for stall recovery testing',
        domain: 'Test',
        status: 'RUNNING',
      },
    });
    const stalledJob = await prisma.workerJob.create({
      data: {
        simulationId: sim2.id,
        status: 'RUNNING',
        attempts: 1,
        startedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
      },
    });

    const count = await recoverStalledJobs();
    assert.ok(count >= 1, `Expected at least 1 recovered job, got ${count}`);

    const recovered = await prisma.workerJob.findUnique({ where: { id: stalledJob.id } });
    assert.equal(recovered?.status, 'QUEUED');

    // cleanup
    await prisma.simulation.delete({ where: { id: sim2.id } });
  });
});
