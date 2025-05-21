import "./tracing"; // ensure OTEL SDK is initialized
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import { trace, SpanStatusCode } from "@opentelemetry/api";

// NEW: metrics API
import { metrics, MetricAttributes } from "@opentelemetry/api";

// create a Meter (namespaces your metrics)
const meter = metrics.getMeter("my-node-app-business");

// define a Counter for “successful operations”
const successCounter = meter.createCounter("complex_operation_success_total", {
  description: "Total number of successfully completed complex operations",
});

// define a Histogram for operation durations (in milliseconds)
const latencyHistogram = meter.createHistogram(
  "complex_operation_duration_ms",
  {
    description: "Duration of complex-operation in milliseconds",
  }
);

const app = Fastify({ logger: true });
const port = Number(process.env.PORT) || 3002;

// Helper for manual traced operations
async function manualTraceOperation(reply: FastifyReply) {
  const tracer = trace.getTracer("app-tracer");
  const span = tracer.startSpan("complex-operation", {
    attributes: { "custom.attribute": "exampleValue" },
  });

  const start = Date.now();

  try {
    // simulate work
    await new Promise((r) => setTimeout(r, 100));
    span.addEvent("sub-operation-A-complete");
    await new Promise((r) => setTimeout(r, 150));

    // random error simulation
    if (Math.random() < 0.2) {
      throw new Error("Simulated internal error");
    }

    // ✅ business metric: count one success
    successCounter.add(1, { outcome: "success" } as MetricAttributes);

    span.setStatus({ code: SpanStatusCode.OK });
    reply.send({ message: "Response after manual traced operation" });
  } catch (err: any) {
    successCounter.add(0, { outcome: "failure" } as MetricAttributes);

    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    reply.status(500).send({ error: err.message });
  } finally {
    const duration = Date.now() - start;
    latencyHistogram.record(duration, { route: "/slow" } as MetricAttributes);

    span.end();
  }
}

// Routes
app.get("/", async (_req, reply) => {
  reply.send({ message: "Hello World with OTEL!" });
});

app.get("/fast", async (_req, reply) => {
  reply.send({ message: "Fast response!" });
});

app.get("/slow", async (_req, reply) => {
  await manualTraceOperation(reply);
});

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`Server listening on port ${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
