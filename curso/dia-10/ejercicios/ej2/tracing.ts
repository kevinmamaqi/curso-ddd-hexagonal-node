// tracing.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
// import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";

// Environment-based configuration
const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "my-node-app-typescript";
const OTLP_ENDPOINT =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318";

// Trace exporter and processor
const traceExporter = new OTLPTraceExporter({
  url: `${OTLP_ENDPOINT}/v1/traces`,
});
const spanProcessor = new BatchSpanProcessor(traceExporter);

// Metric exporter and reader
// const metricExporter = new OTLPMetricExporter({
//   url: `${OTLP_ENDPOINT}/v1/metrics`,
// });

// Metric reader
// const metricReader = new PeriodicExportingMetricReader({
//   exporter: metricExporter,
//   exportIntervalMillis: 60_000, // export metrics every minute
// });

// Prometheus Exporter
const prometheusExporter = new PrometheusExporter(
  { port: 9464, endpoint: "/metrics" },
  () => console.log(`Metrics available at http://localhost:9464/metrics`)
);

// Initialize the SDK with both tracing and metrics
export const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
  }),
  traceExporter,
  spanProcessor,
  metricReader: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
  sdk.start();
  console.log("OpenTelemetry SDK started...");
} catch (error) {
  console.error("Error starting OpenTelemetry SDK:", error);
}

// Graceful shutdown
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing and metrics terminated"))
    .catch((err) => console.error("Error terminating OTEL SDK", err))
    .finally(() => process.exit(0));
});
