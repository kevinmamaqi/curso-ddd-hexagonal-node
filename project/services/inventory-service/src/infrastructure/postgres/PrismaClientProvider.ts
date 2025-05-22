import { PrismaClient } from "@prisma/client";
import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("inventory-service-prisma");

const queryDuration = meter.createHistogram(
  "prisma_client_query_duration_seconds",
  {
    description: "Latency of Prisma queries",
  }
);

export const prisma = new PrismaClient({
  log: [{ level: "query", emit: "event" }],
});

prisma.$on(
  "query",
  (e: { query: string; params: string; duration: number; target: string }) => {
    queryDuration.record(e.duration / 1000, {
      db_query: e.query,
    });
  }
);
