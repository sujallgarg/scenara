# Gemini Model Configuration, Availability & Cost Estimates

## 1. Approved Model Architecture

Scenara uses Google's Flash models to balance inference latency, cost, and high throughput during multi-agent simulations.

- **Primary Approved Model**: `gemini-2.5-flash`
  - High intelligence and fast multimodal reasoning.
  - Used for Agent Generation, Dynamic Round Interactions, and Synthesis.
- **Resilience Fallback Model**: `gemini-1.5-flash`
  - Ultra-low cost high-volume fallback if quota or regional capacity constraints occur.
- **Future Sunset Route**: Effective December 1, 2026, Google routes deprecated `gemini-2.5-flash` API calls to `gemini-3.5-flash-lite`.

### Environment Overrides
You can customize the model in `.env` or `.env.local`:
```bash
GEMINI_MODEL="gemini-2.5-flash"
# Or individually per stage:
GEMINI_MODEL_NETWORK="gemini-2.5-flash"
GEMINI_MODEL_INTERACTION="gemini-2.5-flash"
GEMINI_MODEL_ANALYSIS="gemini-2.5-flash"
```

---

## 2. Token Pricing & Rate Limits

| Model | Input / 1M Tokens | Output / 1M Tokens | Free Tier RPM | Free Tier RPD |
|---|---|---|---|---|
| **Gemini 2.5 Flash** (Approved) | \$0.30 | \$2.50 | 15 RPM | 1,500 RPD |
| **Gemini 1.5 Flash** (Fallback) | \$0.075 | \$0.30 | 15 RPM | 1,500 RPD |

---

## 3. Simulation Cost Breakdown

A Scenara simulation consists of:
1. **Network Generation**: Synthesizing agent personas, psychometrics, demographics, and initial relationship graph.
2. **Round Interactions**: Each active agent participating in conversations or public broadcasts each round.
3. **Executive Synthesis**: Aggregating opinion trajectories, friction points, and strategic takeaways.

### Gemini 2.5 Flash (Approved Primary Configuration)

| Simulation Scale | Agents | Rounds | Total API Calls | Est. Input Tokens | Est. Output Tokens | Est. Cost (USD) | Est. Wall Clock Time |
|---|---|---|---|---|---|---|---|
| **Small** | 10 | 3 | 32 | 30,000 | 16,000 | **\$0.049** | ~1.1 min |
| **Medium** | 30 | 5 | 154 | 132,000 | 68,000 | **\$0.210** | ~5.1 min |
| **Large** | 100 | 10 | 1,011 | 833,000 | 422,000 | **\$1.305** | ~33.7 min |

### Gemini 1.5 Flash (Economy / High-Volume Fallback)

| Simulation Scale | Agents | Rounds | Total API Calls | Est. Input Tokens | Est. Output Tokens | Est. Cost (USD) | Est. Wall Clock Time |
|---|---|---|---|---|---|---|---|
| **Small** | 10 | 3 | 32 | 30,000 | 16,000 | **\$0.007** | ~1.1 min |
| **Medium** | 30 | 5 | 154 | 132,000 | 68,000 | **\$0.030** | ~5.1 min |
| **Large** | 100 | 10 | 1,011 | 833,000 | 422,000 | **\$0.189** | ~33.7 min |

---

## 4. Production Recommendations

1. **Free Tier vs. Paid Tier**:
   - The free tier limit of 15 Requests Per Minute (RPM) requires throttling. `RateLimiter` enforces safe spacing.
   - For interactive production runs, a paid Google AI Studio API tier (Pay-As-You-Go) is recommended, unlocking up to 1,000+ RPM.
2. **Transient Error Handling**:
   - `withRetry()` handles transient `503 Service Unavailable`, `429 Rate Limit`, and socket timeouts with exponential backoff.
3. **Graceful Model Fallback**:
   - `validateGeminiConnection()` detects model status and falls back automatically if model access changes.
