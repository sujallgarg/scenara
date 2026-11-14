import { NextResponse } from 'next/server';
import { validateGeminiConnection, COST_ESTIMATES, RATE_LIMITS, MODELS } from '@/lib/gemini';

export async function GET() {
  const result = await validateGeminiConnection();
  return NextResponse.json({
    ...result,
    models: MODELS,
    rateLimits: RATE_LIMITS,
    sampleCostEstimates: {
      small: COST_ESTIMATES.estimateSimulationCost(10, 3),
      medium: COST_ESTIMATES.estimateSimulationCost(30, 5),
      large: COST_ESTIMATES.estimateSimulationCost(100, 10),
    },
  });
}
