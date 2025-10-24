import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import verifyPassword from '../src/services/compare.bcrypt.js';
import hashPassword from '../src/services/generate.bcrypt.js';
import { generateToken } from '../src/services/generate.token.js';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Mocked bcrypt tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true for correct password', async () => {
    bcrypt.compare.mockResolvedValue(true);
    const result = await verifyPassword('123', 'hashed');
    expect(result).toBe(true);
  });

  it('should hash a password', async () => {
    bcrypt.hash.mockResolvedValue('mocked-hash');
    const result = await hashPassword('123');
    expect(result).toBe('mocked-hash');
  });
});

describe('Mocked JWT tests', () => {
  it('should generate and verify token', () => {
    jwt.sign.mockReturnValue('mocked-token');
    jwt.verify.mockReturnValue({ id: 1, role: 'USER' });

    const token = generateToken({ id: 1, role: 'USER' });
    const decoded = jwt.verify(token, 'secret');

    expect(token).toBe('mocked-token');
    expect(decoded).toEqual({ id: 1, role: 'USER' });
  });

  it('should throw error for invalid token', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => jwt.verify('bad-token', 'secret')).toThrow('Invalid token');
  });
});
