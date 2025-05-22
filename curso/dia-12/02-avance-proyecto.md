# Avance del Proyecto

## Generar tráfico

### 1. Create Inventory  

```bash
curl -i \
  -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"sku":"ABC-1234-AB","qty":10}'
```

### 2. Get Inventory

```bash
curl -i http://localhost:3000/inventory/ABC-1234-AB
```

### 3. Reserve Quantity

```bash
curl -i -X POST http://localhost:3000/inventory/ABC-1234-AB/reserve \
  -H "Content-Type: application/json" \
  -d '{"qty":5,"orderId":"order-001"}'
``` 

### 4. Release Quantity

```bash
curl -i -X POST http://localhost:3000/inventory/ABC-1234-AB/release \
  -H "Content-Type: application/json" \
  -d '{"qty":3,"orderId":"order-001"}'
```


### 5. Replenish Inventory

```bash
curl -i -X POST http://localhost:3000/inventory/ABC-1234-AB/replenish \
  -H "Content-Type: application/json" \
  -d '{"qty":20}'
```


## Posibles Gráficas de Dashboards:

### 1. Service Health & Traffic Overview  
- **Panels & PromQL**  
  - **Total RPS**  
    ```promql
    sum(rate(http_server_requests_total[1m]))
    ```  
  - **Latency P95 / P99**  
    ```promql
    histogram_quantile(0.95, sum(rate(http_server_request_duration_seconds_bucket[5m])) by (le))
    histogram_quantile(0.99, sum(rate(http_server_request_duration_seconds_bucket[5m])) by (le))
    ```  
  - **Error Rate (%)**  
    ```promql
    100 * sum(rate(http_server_requests_errors_total[1m])) / sum(rate(http_server_requests_total[1m]))
    ```  

### 2. HTTP Endpoint Performance  
- **Variable:** `$route` (set via *Dashboard settings → Variables → New → Label “route”* with query `label_values(http_server_request_duration_seconds_bucket, route)`)  
- **Panels (templated by `$route`)**  
  - **RPS by route**  
    ```promql
    sum by(route)(rate(http_server_requests_total{route="$route"}[1m]))
    ```  
  - **P99 latency by route**  
    ```promql
    histogram_quantile(0.99, sum(rate(http_server_request_duration_seconds_bucket{route="$route"}[5m])) by (le,route))
    ```  

### 3. Database Query Metrics  
- **Panels**  
  - **DB QPS**  
    ```promql
    sum(rate(prisma_query_duration_seconds_count[1m]))
    ```  
  - **Slow Queries P95**  
    ```promql
    histogram_quantile(0.95, sum(rate(prisma_query_duration_seconds_bucket[5m])) by (le))
    ```  
  - **Connection Pool Usage** (if instrumented)  
    ```promql
    prisma_pool_active_connections
    ```  

### 4. RabbitMQ Messaging Health  
- **Panels**  
  - **Messages Published/sec**  
    ```promql
    sum(rate(rabbitmq_channel_messages_published_total[1m]))
    ```  
  - **Queue Depth** (per queue)  
    ```promql
    rabbitmq_queue_messages_ready{queue=~".*"}
    ```  
  - **Consumer Ack Rate**  
    ```promql
    sum(rate(rabbitmq_channel_messages_ack_total[1m]))
    ```  

### 5. End-to-End Trace Explorer  
- **Setup:** Install the **Tempo** (or Jaeger) data source plugin  
- **Panels:**  
  - **Service Map** (built-in)  
  - **Recent Traces Table**: link traces to slow requests  

### 6. Error & Exception Breakdown  
- **Panels**  
  - **Top Exceptions**  
    ```promql
    topk(10, sum by(exception)(rate(process_exceptions_total[1m])))
    ```  
  - **5xx Rate**  
    ```promql
    sum(rate(http_server_responses_total{code=~"5.."}[1m]))
    ```  

### 7. Resource Utilization  
- **Panels**  
  - **CPU (%)**  
    ```promql
    rate(process_cpu_seconds_total[1m]) * 100
    ```  
  - **Memory RSS**  
    ```promql
    process_resident_memory_bytes
    ```  
  - **Event-Loop Lag** (if instrumented)  
    ```promql
    nodejs_eventloop_lag_seconds
    ```  

### 8. Business-Event Metrics  
- **Panels**  
  - **Replenish Events/sec**  
    ```promql
    sum(rate(app_event_ProductInventoryReplenished_total[1m]))
    ```  
  - **Reserve Events/sec**  
    ```promql
    sum(rate(app_event_ProductInventoryReserved_total[1m]))
    ```  
  - **Replenish / Reserve Ratio**  
    ```promql
    sum(rate(app_event_ProductInventoryReplenished_total[1m]))
    /
    sum(rate(app_event_ProductInventoryReserved_total[1m]))
    ```  

