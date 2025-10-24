import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Zanly Backend API Docs',
      version: '1.0.0',
      description: 'Documentation for Zanly APIs including auth, users, jobs, etc.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // 👈 Path where your routes are defined
};

export const swaggerSpec = swaggerJsdoc(options);
