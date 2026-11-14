import { strict as assert } from 'node:assert';
import { describe, it, before, after } from 'node:test';
import { prisma } from '../src/lib/prisma';

describe('Decision Rationale and Explainability', () => {
  let userId: string;
  let simId: string;
  let agentId: string;
  let roundId: string;

  before(async () => {
    const user = await prisma.user.create({
      data: {
        email: `rationale-test-${Date.now()}@test.com`,
        name: 'Rationale User',
        passwordHash: 'dummy',
      },
    });
    userId = user.id;

    const sim = await prisma.simulation.create({
      data: {
        userId,
        title: 'Decision Rationale Verification Sim',
        scenarioPrompt: 'Testing explainable decision storage',
        domain: 'Explainable AI',
      },
    });
    simId = sim.id;

    const agent = await prisma.agent.create({
      data: {
        simulationId: simId,
        name: 'Dr. Sarah Lin',
        avatarSeed: 'sarah-lin',
        role: 'Chief Policy Officer',
        archetype: 'Pragmatist',
        demographics: JSON.stringify({ age: 42, location: 'Washington, DC' }),
        psychometrics: JSON.stringify({ openness: 0.8, riskTolerance: 0.3 }),
        baselineSentiment: 0.1,
        currentSentiment: 0.25,
        currentStance: 'Cautiously supportive with strict oversight requirements',
        stubbornness: 0.6,
        influenceScore: 0.75,
      },
    });
    agentId = agent.id;

    const round = await prisma.simulationRound.create({
      data: {
        simulationId: simId,
        roundNumber: 1,
        status: 'COMPLETED',
      },
    });
    roundId = round.id;
  });

  after(async () => {
    if (simId) {
      await prisma.simulation.delete({ where: { id: simId } }).catch(() => {});
    }
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
  });

  it('Stores concise decision rationale on Interaction model', async () => {
    const conciseRationale = 'Shifted from neutral to cautious endorsement after peer shared safety compliance audit results.';

    const interaction = await prisma.interaction.create({
      data: {
        simulationId: simId,
        roundId,
        senderId: agentId,
        interactionType: 'PUBLIC_BROADCAST',
        content: 'While risks remain, the third-party safety validation satisfies our immediate regulatory threshold.',
        decisionRationale: conciseRationale,
        senderSentimentDelta: 0.15,
      },
    });

    assert.ok(interaction.id);
    assert.equal(interaction.decisionRationale, conciseRationale);

    // Verify it is queryable directly
    const fetched = await prisma.interaction.findUnique({
      where: { id: interaction.id },
      select: { decisionRationale: true, content: true },
    });
    assert.equal(fetched?.decisionRationale, conciseRationale);
  });

  it('Stores concise decision rationale on AgentSnapshot model', async () => {
    const beliefRationale = 'Maintains guarded optimism predicated on enforcement mechanisms promised in Round 1 consensus.';

    const snapshot = await prisma.agentSnapshot.create({
      data: {
        simulationId: simId,
        roundId,
        agentId,
        sentimentScore: 0.25,
        opinionSummary: 'Supportive with regulatory contingency',
        decisionRationale: beliefRationale,
        stateMetrics: JSON.stringify({ interactionsCount: 1, timesPersuaded: 1 }),
      },
    });

    assert.ok(snapshot.id);
    assert.equal(snapshot.decisionRationale, beliefRationale);

    const fetched = await prisma.agentSnapshot.findUnique({
      where: { id: snapshot.id },
      select: { decisionRationale: true, opinionSummary: true },
    });
    assert.equal(fetched?.decisionRationale, beliefRationale);
  });
});

