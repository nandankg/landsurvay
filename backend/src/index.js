/**
 * Server Entry Point
 */

const app = require('./app');
const config = require('./config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test database connection
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await connectDatabase();

  const server = app.listen(config.port, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   Bihar Land Survey & Revenue API                          ║
║                                                            ║
║   Server running on: http://localhost:${config.port}               ║
║   Environment: ${config.nodeEnv.padEnd(40)}║
║   Health check: http://localhost:${config.port}/api/health         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Process terminated');
      process.exit(0);
    });
  });
}

startServer();

module.exports = { prisma };
