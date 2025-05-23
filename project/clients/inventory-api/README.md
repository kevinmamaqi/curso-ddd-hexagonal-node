# Inventory Client API

## Get Request
Nuestros clientes, piden información del producto más vendido a **inventory-service**.

Ese producto, cada vez que pidan información y este por debajo
de 5 unidades, emitiremos una petición al **order-service** para hacer un pedido.

