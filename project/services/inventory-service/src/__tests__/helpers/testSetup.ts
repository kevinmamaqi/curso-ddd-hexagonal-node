import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import {
  RabbitMQContainer,
  StartedRabbitMQContainer,
} from "@testcontainers/rabbitmq";
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

export class TestSetup {
  private postgresContainer!: StartedPostgreSqlContainer;
  private rabbitmqContainer!: StartedRabbitMQContainer;
  private prisma!: PrismaClient;
  private app!: FastifyInstance;

  async setup() {
    // Start PostgreSQL container
    this.postgresContainer = await new PostgreSqlContainer()
      .withDatabase("inventory_test")
      .withUsername("test")
      .withPassword("test")
      .start();

    // Start RabbitMQ container
    this.rabbitmqContainer = await new RabbitMQContainer()
      .withExposedPorts(5672, 15672)
      .start();

    // Wait for RabbitMQ to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Set environment variables
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = this.postgresContainer.getConnectionUri();
    process.env.AMQP_URL = `amqp://${this.rabbitmqContainer.getHost()}:${this.rabbitmqContainer.getMappedPort(
      5672
    )}`;
    process.env.RABBITMQ_URL = process.env.AMQP_URL;
    process.env.RABBITMQ_USER = "guest";
    process.env.RABBITMQ_PASSWORD = "guest";
    process.env.PORT = "0"; // Random port for testing

    // Run migrations
    execSync("npx prisma migrate deploy", {
      env: {
        ...process.env,
        DATABASE_URL: this.postgresContainer.getConnectionUri(),
      },
      stdio: "inherit",
    });

    // Initialize Prisma client
    this.prisma = new PrismaClient();

    // Initialize Fastify app
    const { buildServer } = await import("../../main.js");
    this.app = await buildServer();
    await this.app.listen({ port: 0 }); // Random port for testing
  }

  async teardown() {
    if (this.app) {
      await this.app.close();
    }
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
    if (this.postgresContainer) {
      await this.postgresContainer.stop();
    }
    if (this.rabbitmqContainer) {
      await this.rabbitmqContainer.stop();
    }
  }

  getApp(): FastifyInstance {
    return this.app;
  }

  getPrisma(): PrismaClient {
    return this.prisma;
  }

  async cleanDatabase() {
    await this.prisma.movement.deleteMany();
    await this.prisma.inventory.deleteMany();
  }
}
