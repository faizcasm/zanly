import {hashPassword,verifyPassword,generateOtp} from '../../src/routes/route.handler.js';
describe('Utility Functions', () => {

  test('hashPassword should hash a password', async () => {
    const password = 'test1234';
    const hashed = await hashPassword(password);
    expect(hashed).not.toBe(password);
    expect(typeof hashed).toBe('string');
  });

  test('verifyPassword should validate password correctly', async () => {
    const password = 'secret';
    const hashed = await hashPassword(password);
    const valid = await verifyPassword(password, hashed);
    expect(valid).toBe(true);
  });

  test('generateOtp should return string of correct length', () => {
    const otp = generateOtp(6);
    expect(typeof otp).toBe('string');
    expect(otp.length).toBe(6);
  });

});
