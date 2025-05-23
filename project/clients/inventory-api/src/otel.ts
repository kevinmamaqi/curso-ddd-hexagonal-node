import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import {
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";

// 1. Build your Resource describing this service
const resource = resourceFromAttributes({
  [SemanticResourceAttributes.SERVICE_NAME]:
    process.env.OTEL_SERVICE_NAME || "inventory-api-client",
});

// 2. Set up your exporters
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
});
const prometheusExporter = new PrometheusExporter({
  port: Number(process.env.OTEL_PROM_PORT) || 9464,
  endpoint: "/metrics",
});

// 3. Instantiate the SDK
export const sdk = new NodeSDK({
  resource,
  // -- context
  contextManager: new AsyncHooksContextManager().enable(),
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
  }),
  // -- tracing
  spanProcessors: [new BatchSpanProcessor(traceExporter)],
  traceExporter,
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(1.0),
  }),
  // -- metrics
  metricReader: prometheusExporter,
  // -- instrumentation
  instrumentations: [getNodeAutoInstrumentations()],
  // -- optional: custom limits, views, idGenerator, etc.
});

// Start telemetry (traces + metrics)
export function startTelemetry() {
  return sdk.start();
}

// Graceful shutdown
export function stopTelemetry() {
  return sdk.shutdown();
}
