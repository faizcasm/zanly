import { generateToken, rateLimiting, redisClient, sendMail, AppError } from '../../src/routes/route.handler.js';
import nodemailer from 'nodemailer';

// ----------------- Mock nodemailer -----------------
jest.mock('nodemailer');
nodemailer.createTransport.mockReturnValue({
  sendMail: jest.fn().mockResolvedValue({ messageId: 'abc123' }),
});

describe('Helper Functions', () => {
  // ---------------- AppError ----------------
  test('AppError should set message and statusCode', () => {
    const error = new AppError('Not Found', 404);
    expect(error.message).toBe('Not Found');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  // ---------------- generateToken ----------------
  test('generateToken should return a JWT token', () => {
    const user = { id: 1, role: 'user' };
    const token = generateToken(user);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  test('generateToken should throw error for invalid user', () => {
    expect(() => generateToken({})).toThrow('Invalid user object for token generation');
  });

  // ---------------- rateLimiting ----------------
  test('rateLimiting should return a function (middleware)', () => {
    const middleware = rateLimiting(60000, 5, 'Too many requests');
    expect(typeof middleware).toBe('function');
  });

  // ---------------- sendMail ----------------
  test('sendMail should return messageId', async () => {
    const messageId = await sendMail({ Otp: '123456', email: 'test@zanly.com', name: 'Test' });
    expect(messageId).toBe('abc123'); // mocked email
  });

  afterAll(async () => {
    // optionally close Redis connection after tests
    await redisClient.quit();
  });
});
