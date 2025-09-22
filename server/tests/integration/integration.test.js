import { prisma } from '../../src/routes/route.handler.js';

describe('Prisma Integration', () => {

  let testUserId;

  afterAll(async () => {
    if (testUserId) await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  test('Should create a user in DB', async () => {
    const user = await prisma.user.create({
      data: { name: 'Test User', email: 'testuser@example.com', password: 'hashed123' }
    });
    testUserId = user.id;
    expect(user.id).toBeDefined();
    expect(user.email).toBe('testuser@example.com');
  });

  test('Should find a user in DB', async () => {
    const user = await prisma.user.findUnique({ where: { id: testUserId } });
    expect(user).toBeDefined();
    expect(user.name).toBe('Test User');
  });

});
