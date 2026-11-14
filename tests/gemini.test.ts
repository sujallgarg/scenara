import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  MODELS,
  RATE_LIMITS,
  COST_ESTIMATES,
  PRICING,
  RateLimiter,
  withRetry,
  validateGeminiConnection,
} from '../src/lib/gemini';
import { GET as geminiValidateHandler } from '../src/app/api/gemini/validate/route';

describe('Gemini Integration, Models and Cost Estimations', () => {
  it('Configures approved Gemini 2.5 Flash model and fallback', () => {
    assert.equal(MODELS.NETWORK_GENERATION, 'gemini-2.5-flash');
    assert.equal(MODELS.AGENT_INTERACTION, 'gemini-2.5-flash');
    assert.equal(MODELS.ANALYSIS, 'gemini-2.5-flash');
    assert.equal(MODELS.FALLBACK, 'gemini-1.5-flash');
  });

  it('Defines appropriate API rate limits for Gemini Flash models', () => {
    assert.equal(RATE_LIMITS.RPM, 15);
    assert.equal(RATE_LIMITS.RPD, 1500);
    assert.equal(RATE_LIMITS.TPM, 1_000_000);
  });

  it('Configures accurate pricing for Gemini 2.5 Flash and Gemini 1.5 Flash', () => {
    assert.equal(PRICING['gemini-2.5-flash'].inputPerMillion, 0.30);
    assert.equal(PRICING['gemini-2.5-flash'].outputPerMillion, 2.50);
    assert.equal(PRICING['gemini-1.5-flash'].inputPerMillion, 0.075);
    assert.equal(PRICING['gemini-1.5-flash'].outputPerMillion, 0.30);
  });

  it('Calculates realistic cost and time estimates for small simulation (10 agents, 3 rounds)', () => {
    const small = COST_ESTIMATES.estimateSimulationCost(10, 3, 'gemini-2.5-flash');
    assert.equal(small.estimatedApiCalls, 32);
    assert.ok(small.estimatedCostUSD > 0.02 && small.estimatedCostUSD < 0.10, `Cost should be ~$0.05, got ${small.estimatedCostUSD}`);
    assert.ok(small.timeEstimateMinutes > 0);
  });

  it('Calculates realistic cost and time estimates for medium simulation (30 agents, 5 rounds)', () => {
    const medium = COST_ESTIMATES.estimateSimulationCost(30, 5, 'gemini-2.5-flash');
    assert.equal(medium.estimatedApiCalls, 154);
    assert.ok(medium.estimatedCostUSD > 0.15 && medium.estimatedCostUSD < 0.30, `Cost should be ~$0.21, got ${medium.estimatedCostUSD}`);
    assert.ok(medium.timeEstimateMinutes >= 4);
  });

  it('Calculates realistic cost and time estimates for large simulation (100 agents, 10 rounds)', () => {
    const large = COST_ESTIMATES.estimateSimulationCost(100, 10, 'gemini-2.5-flash');
    assert.equal(large.estimatedApiCalls, 1011);
    assert.ok(large.estimatedCostUSD > 1.00 && large.estimatedCostUSD < 2.00, `Cost should be ~$1.31, got ${large.estimatedCostUSD}`);
  });

  it('RateLimiter allows calls within limit without delay', async () => {
    const limiter = new RateLimiter(5);
    const start = Date.now();
    await limiter.throttle();
    await limiter.throttle();
    await limiter.throttle();
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 50, `Should not delay when under limit: ${elapsed}ms`);
  });

  it('withRetry retries on transient 503 / UNAVAILABLE / timeout errors', async () => {
    let attempts = 0;
    const result = await withRetry(async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error('503: No capacity available for model gemini-2.5-flash on the server');
      }
      return 'recovered-successfully';
    }, 3, 10);

    assert.equal(result, 'recovered-successfully');
    assert.equal(attempts, 3);
  });

  it('withRetry fails immediately on non-retryable errors without retrying', async () => {
    let attempts = 0;
    await assert.rejects(
      async () => {
        await withRetry(async () => {
          attempts++;
          throw new Error('400: Invalid JSON input format');
        }, 3, 10);
      },
      (err: any) => {
        assert.ok(err.message.includes('400'));
        return true;
      }
    );
    assert.equal(attempts, 1);
  });

  it('validateGeminiConnection handles missing GEMINI_API_KEY gracefully', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    try {
      process.env.GEMINI_API_KEY = '';
      const result = await validateGeminiConnection();
      assert.equal(result.valid, false);
      assert.ok(result.error?.includes('GEMINI_API_KEY is not set'));
      assert.equal(result.model, 'gemini-2.5-flash');
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  it('GET /api/gemini/validate returns models, rateLimits and sample cost estimates', async () => {
    const res = await geminiValidateHandler();
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(data.models);
    assert.equal(data.models.NETWORK_GENERATION, 'gemini-2.5-flash');
    assert.ok(data.rateLimits);
    assert.ok(data.sampleCostEstimates);
    assert.ok(data.sampleCostEstimates.small);
    assert.ok(data.sampleCostEstimates.medium);
    assert.ok(data.sampleCostEstimates.large);
  });
});
