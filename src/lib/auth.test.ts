import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth';

// Set env for test
process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';

describe('auth', () => {
  it('hashPassword produces bcrypt hash', async () => {
    const hash = await hashPassword('mypassword');
    assert.ok(hash.startsWith('$2'), `Expected bcrypt hash, got: ${hash}`);
    assert.ok(hash.length > 50);
  });

  it('verifyPassword returns true for correct password', async () => {
    const hash = await hashPassword('correct');
    assert.equal(await verifyPassword('correct', hash), true);
  });

  it('verifyPassword returns false for wrong password', async () => {
    const hash = await hashPassword('correct');
    assert.equal(await verifyPassword('wrong', hash), false);
  });

  it('generateToken produces a string', () => {
    const token = generateToken({ userId: 'u1', email: 'a@b.com' });
    assert.equal(typeof token, 'string');
    assert.ok(token.length > 20);
  });

  it('verifyToken returns payload for valid token', () => {
    const token = generateToken({ userId: 'u1', email: 'a@b.com' });
    const payload = verifyToken(token);
    assert.ok(payload !== null);
    assert.equal(payload!.userId, 'u1');
    assert.equal(payload!.email, 'a@b.com');
  });

  it('verifyToken returns null for garbage', () => {
    const result = verifyToken('garbage.token.value');
    assert.equal(result, null);
  });
});
