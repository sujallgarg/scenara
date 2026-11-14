import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

// Approved model configuration:
// Primary: gemini-2.5-flash
// Fallback: gemini-1.5-flash
export const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
export const FALLBACK_MODEL = 'gemini-1.5-flash';

export const MODELS = {
  NETWORK_GENERATION: process.env.GEMINI_MODEL_NETWORK || DEFAULT_MODEL,
  AGENT_INTERACTION: process.env.GEMINI_MODEL_INTERACTION || DEFAULT_MODEL,
  ANALYSIS: process.env.GEMINI_MODEL_ANALYSIS || DEFAULT_MODEL,
  FALLBACK: FALLBACK_MODEL,
} as const;

// Rate limit constants (Gemini Flash free tier standard limits)
export const RATE_LIMITS = {
  RPM: 15,          // Requests per minute (free tier)
  RPD: 1500,        // Requests per day (free tier)
  TPM: 1_000_000,  // Tokens per minute
};

// Pricing rates per 1M tokens:
// Gemini 2.5 Flash: $0.30 / 1M input, $2.50 / 1M output
// Gemini 1.5 Flash: $0.075 / 1M input, $0.30 / 1M output
export const PRICING = {
  'gemini-2.5-flash': { inputPerMillion: 0.30, outputPerMillion: 2.50 },
  'gemini-1.5-flash': { inputPerMillion: 0.075, outputPerMillion: 0.30 },
} as const;

export const COST_ESTIMATES = {
  TOKENS_PER_AGENT_GENERATION: 2000,       // ~2k tokens per batch of agents
  TOKENS_PER_INTERACTION: 1500,            // ~1.5k tokens per interaction (prompt + response)
  INTERACTIONS_PER_ROUND_PER_AGENT: 1,    // Each agent gets 1 interaction per round

  estimateSimulationCost(agentCount: number, rounds: number, model: 'gemini-2.5-flash' | 'gemini-1.5-flash' = 'gemini-2.5-flash'): {
    model: string;
    estimatedApiCalls: number;
    estimatedInputTokens: number;
    estimatedOutputTokens: number;
    estimatedCostUSD: number;
    timeEstimateMinutes: number;
  } {
    // Network generation: ~ceil(agentCount / 10) + 1 calls
    const networkGenCalls = Math.ceil(agentCount / 10) + 1;
    // Per round: each agent participates in ~1 interaction
    const totalInteractionCalls = agentCount * rounds;
    const totalApiCalls = networkGenCalls + totalInteractionCalls;

    // Tokens: structured generation + interaction prompts
    const networkInputTokens = networkGenCalls * 3000;
    const networkOutputTokens = networkGenCalls * 2000;
    const interactionInputTokens = totalInteractionCalls * 800;
    const interactionOutputTokens = totalInteractionCalls * 400;

    const totalInputTokens = networkInputTokens + interactionInputTokens;
    const totalOutputTokens = networkOutputTokens + interactionOutputTokens;

    const rates = PRICING[model] || PRICING['gemini-2.5-flash'];
    const inputCost = (totalInputTokens / 1_000_000) * rates.inputPerMillion;
    const outputCost = (totalOutputTokens / 1_000_000) * rates.outputPerMillion;
    const totalCostUSD = inputCost + outputCost;

    // Estimated duration: ~2 seconds per call
    const timeEstimateMinutes = (totalApiCalls * 2) / 60;

    return {
      model,
      estimatedApiCalls: totalApiCalls,
      estimatedInputTokens: totalInputTokens,
      estimatedOutputTokens: totalOutputTokens,
      estimatedCostUSD: Math.round(totalCostUSD * 10000) / 10000,
      timeEstimateMinutes: Math.round(timeEstimateMinutes * 10) / 10,
    };
  }
};

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is required');
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function getModel(modelName: string = MODELS.NETWORK_GENERATION, config?: GenerationConfig): GenerativeModel {
  return getGenAI().getGenerativeModel({
    model: modelName,
    generationConfig: config,
  });
}

/**
 * Validates that the Gemini API is accessible and checks model availability.
 * Tests primary model (gemini-2.5-flash) and reports status or fallback.
 */
export async function validateGeminiConnection(): Promise<{
  valid: boolean;
  error?: string;
  model?: string;
  fallbackAvailable?: boolean;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === '') {
    return {
      valid: false,
      error: 'GEMINI_API_KEY is not set. Add it to .env or .env.local',
      model: MODELS.NETWORK_GENERATION,
    };
  }

  // Attempt primary model first
  try {
    const model = getModel(MODELS.NETWORK_GENERATION, { maxOutputTokens: 20 });
    const result = await model.generateContent('ping');
    const text = result.response.text().trim();
    if (text.length > 0) {
      return { valid: true, model: MODELS.NETWORK_GENERATION };
    }
  } catch (err) {
    const primaryError = err instanceof Error ? err.message : String(err);

    // If model not found or deprecated, test fallback model
    if (primaryError.includes('404') || primaryError.includes('not found') || primaryError.includes('deprecated')) {
      try {
        const fallback = getModel(FALLBACK_MODEL, { maxOutputTokens: 20 });
        const fallbackRes = await fallback.generateContent('ping');
        if (fallbackRes.response.text().trim().length > 0) {
          return {
            valid: true,
            model: FALLBACK_MODEL,
            fallbackAvailable: true,
            error: `Primary model ${MODELS.NETWORK_GENERATION} unavailable (${primaryError}). Falling back to ${FALLBACK_MODEL}.`,
          };
        }
      } catch (fallbackErr) {
        return {
          valid: false,
          error: `Primary (${MODELS.NETWORK_GENERATION}) and fallback (${FALLBACK_MODEL}) failed: ${primaryError}`,
        };
      }
    }

    return { valid: false, error: `Gemini API error: ${primaryError}`, model: MODELS.NETWORK_GENERATION };
  }

  return { valid: false, error: 'Unexpected empty response from Gemini API' };
}

/**
 * Rate limiter: sliding-window throttle for controlling API call rate.
 */
export class RateLimiter {
  private calls: number[] = [];
  private readonly maxCallsPerMinute: number;

  constructor(maxCallsPerMinute: number = RATE_LIMITS.RPM) {
    this.maxCallsPerMinute = maxCallsPerMinute;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    this.calls = this.calls.filter(t => now - t < 60_000);

    if (this.calls.length >= this.maxCallsPerMinute) {
      const oldest = this.calls[0];
      const waitMs = 60_000 - (now - oldest) + 100;
      await new Promise(resolve => setTimeout(resolve, waitMs));
      this.calls = this.calls.filter(t => Date.now() - t < 60_000);
    }

    this.calls.push(Date.now());
  }
}

/**
 * Retry wrapper for Gemini API calls with exponential backoff and model fallback on 404.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const isRetryable =
        lastError.message.includes('503') ||
        lastError.message.includes('429') ||
        lastError.message.includes('UNAVAILABLE') ||
        lastError.message.includes('timeout') ||
        lastError.message.includes('rate limit');
      if (!isRetryable) throw lastError;
      const delay = baseDelayMs * Math.pow(2, attempt);
      console.log(`[gemini] Retry ${attempt + 1}/${maxRetries} after ${delay}ms: ${lastError.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError!;
}
