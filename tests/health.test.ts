import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { GET as healthHandler } from '../src/app/api/health/route';

describe('Health Check API', () => {
  it('GET /api/health verifies database connectivity and returns 200', async () => {
    const res = await healthHandler();
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.db, 'connected');
    assert.ok(data.timestamp);
  });
});

