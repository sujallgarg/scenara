export type SimulationStatus =
  | 'DRAFT'
  | 'GENERATING_NETWORK'
  | 'READY'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED';

export type InteractionType =
  | 'DYADIC_CONVERSATION'
  | 'PUBLIC_BROADCAST'
  | 'INTERNAL_DELIBERATION';

export type RelationshipType =
  | 'PEER'
  | 'ADVERSARY'
  | 'INFLUENCER_FOLLOWER'
  | 'COLLEAGUE'
  | 'ACQUAINTANCE';

export interface AgentDemographics {
  age: number;
  location: string;
  education: string;
  occupation: string;
  incomeBracket: string;
}

export interface AgentPsychometrics {
  openness: number;         // 0.0 to 1.0
  conscientiousness: number;// 0.0 to 1.0
  extraversion: number;     // 0.0 to 1.0
  agreeableness: number;    // 0.0 to 1.0
  neuroticism: number;      // 0.0 to 1.0
  riskTolerance: number;    // 0.0 to 1.0
}

export interface SimulationParameters {
  volatility: number;              // 0.1 to 1.0 (default 0.35)
  clusteringCoefficient: number;   // 0.1 to 1.0 (default 0.6)
  polarizationThreshold: number;   // 0.1 to 1.0 (default 0.5)
}

export interface SynthesizedAgent {
  id?: string;
  name: string;
  avatarSeed: string;
  role: string;
  archetype: string;
  demographics: AgentDemographics;
  psychometrics: AgentPsychometrics;
  baselineSentiment: number;
  currentSentiment: number;
  currentStance: string;
  stubbornness: number;
  influenceScore: number;
}

export interface SynthesizedEdge {
  sourceIndex: number;
  targetIndex: number;
  sourceAgentId?: string;
  targetAgentId?: string;
  relationshipType: RelationshipType;
  weight: number;
  trustScore: number;
}

export interface GeneratedWorld {
  agents: SynthesizedAgent[];
  edges: SynthesizedEdge[];
  archetypeDistribution: Record<string, number>;
}

