import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma} from '../routes/route.handler.js';
import redisClient from './redis.config.js';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function zanlyAi(prompt, options = {}) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  const cacheKey = `zanlyAi:${prompt}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return cached;

  const keywords = prompt
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, '')
    .split(' ');

  const dbResults = await prisma.material.findMany({
    where: {
      OR: keywords.flatMap((kw) => [
        { title: { contains: kw, mode: 'insensitive' } },
        { description: { contains: kw, mode: 'insensitive' } },
      ]),
      status: 'PENDING',
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const dbText = dbResults.map(
    (m) =>
      `Title: ${m.title}\nDescription: ${m.description || ''}\nClass: ${m.class}\nSubject: ${m.subject}\nType: ${m.type || 'N/A'}\nDownload: ${m.fileUrl}`,
  );

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `
      You are Zanly AI, a helpful assistant that helps students from Kashmir find study materials on Zanly.
      You have access to the following database information:
      ${dbText || 'No relevant materials found in the database.'}
      Always give clear, student-friendly responses.
      Always include the PDF/image download link from the database if available.
      Also, always mention the class, subject, and type of the material in your response.
      Also analyze fileUrl and answer what you see there if no fileUrl simiply summazrize title and description then.
      If someone asks about your creator, answer: 
      Faizan Hameed is my creator and founder of Zanly, website: https://faizcasm.in
    `,
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 512,
    },
  });

  const reply = result.response.text().trim();

  if (reply) {
    await redisClient.set(cacheKey, reply, {
      EX: options.cacheTTL ?? 60 * 10,
    });
  }

  return reply;
}
