import amqplib from "amqplib";

(async () => {
  // 1. Setear la conexión
  const conn = await amqplib.connect("amqp://user:password@localhost:5672");
  const channel = await conn.createChannel();

  // 2. Setear los exchanges
  // Los exchange son una manera de enrutar mensajes a una o más colas.
  // Durable significa que el exchange es persistente (resiste un restart de RabbitMQ)
  await channel.assertExchange("main_exchange", "direct", { durable: true });
  await channel.assertExchange("dlx_exchange", "fanout", { durable: true });

  // 3. Setear las colas
  await channel.assertQueue("work_queue", {
    durable: true,
    deadLetterExchange: "dlx_exchange",
  });
  await channel.assertQueue("dead_letter_queue", { durable: true });

  // 4. Hacer bind de queues a exchanges
  await channel.bindQueue("work_queue", "main_exchange", "work");
  await channel.bindQueue("dead_letter_queue", "dlx_exchange", "");

  console.log("DLX Setup Completed!");
  await channel.close();
  await conn.close();
})();
