-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "apiKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scenarioPrompt" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "agentCount" INTEGER NOT NULL DEFAULT 30,
    "totalRounds" INTEGER NOT NULL DEFAULT 5,
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "parameters" TEXT NOT NULL DEFAULT '{"volatility":0.35,"clusteringCoefficient":0.6,"polarizationThreshold":0.5}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarSeed" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "archetype" TEXT NOT NULL,
    "demographics" TEXT NOT NULL,
    "psychometrics" TEXT NOT NULL,
    "baselineSentiment" DOUBLE PRECISION NOT NULL,
    "currentSentiment" DOUBLE PRECISION NOT NULL,
    "currentStance" TEXT NOT NULL,
    "stubbornness" DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    "influenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRelationship" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "sourceAgentId" TEXT NOT NULL,
    "targetAgentId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL DEFAULT 'PEER',
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationRound" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "injectedEvent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SimulationRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT,
    "interactionType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "decisionRationale" TEXT NOT NULL,
    "senderSentimentDelta" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "recipientSentimentDelta" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentSnapshot" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "sentimentScore" DOUBLE PRECISION NOT NULL,
    "opinionSummary" TEXT NOT NULL,
    "decisionRationale" TEXT NOT NULL,
    "stateMetrics" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "executiveSummary" TEXT NOT NULL,
    "sentimentBreakdown" TEXT NOT NULL,
    "keyFrictionPoints" TEXT NOT NULL,
    "unexpectedFindings" TEXT NOT NULL,
    "strategicRecommendations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerJob" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "lastError" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");

-- CreateIndex
CREATE INDEX "Simulation_userId_idx" ON "Simulation"("userId");

-- CreateIndex
CREATE INDEX "Agent_simulationId_idx" ON "Agent"("simulationId");

-- CreateIndex
CREATE INDEX "AgentRelationship_simulationId_idx" ON "AgentRelationship"("simulationId");

-- CreateIndex
CREATE INDEX "AgentRelationship_sourceAgentId_targetAgentId_idx" ON "AgentRelationship"("sourceAgentId", "targetAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentRelationship_simulationId_sourceAgentId_targetAgentId_key" ON "AgentRelationship"("simulationId", "sourceAgentId", "targetAgentId");

-- CreateIndex
CREATE INDEX "SimulationRound_simulationId_idx" ON "SimulationRound"("simulationId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationRound_simulationId_roundNumber_key" ON "SimulationRound"("simulationId", "roundNumber");

-- CreateIndex
CREATE INDEX "Interaction_simulationId_idx" ON "Interaction"("simulationId");

-- CreateIndex
CREATE INDEX "Interaction_roundId_idx" ON "Interaction"("roundId");

-- CreateIndex
CREATE INDEX "Interaction_senderId_idx" ON "Interaction"("senderId");

-- CreateIndex
CREATE INDEX "AgentSnapshot_simulationId_idx" ON "AgentSnapshot"("simulationId");

-- CreateIndex
CREATE INDEX "AgentSnapshot_agentId_idx" ON "AgentSnapshot"("agentId");

-- CreateIndex
CREATE INDEX "AgentSnapshot_roundId_idx" ON "AgentSnapshot"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentSnapshot_roundId_agentId_key" ON "AgentSnapshot"("roundId", "agentId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationResult_simulationId_key" ON "SimulationResult"("simulationId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerJob_simulationId_key" ON "WorkerJob"("simulationId");

-- CreateIndex
CREATE INDEX "WorkerJob_status_idx" ON "WorkerJob"("status");

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRelationship" ADD CONSTRAINT "AgentRelationship_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRelationship" ADD CONSTRAINT "AgentRelationship_sourceAgentId_fkey" FOREIGN KEY ("sourceAgentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRelationship" ADD CONSTRAINT "AgentRelationship_targetAgentId_fkey" FOREIGN KEY ("targetAgentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationRound" ADD CONSTRAINT "SimulationRound_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "SimulationRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSnapshot" ADD CONSTRAINT "AgentSnapshot_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSnapshot" ADD CONSTRAINT "AgentSnapshot_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "SimulationRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSnapshot" ADD CONSTRAINT "AgentSnapshot_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerJob" ADD CONSTRAINT "WorkerJob_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
