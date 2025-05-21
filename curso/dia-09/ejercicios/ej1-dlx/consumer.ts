import amqplib from "amqplib";

(async () => {
  // 1. Establecer conexión
  const conn = await amqplib.connect("amqp://user:password@localhost:5672");
  const channel = await conn.createChannel();

  await channel.consume(
    "work_queue",
    (msg) => {
      if (!msg) return;
      console.log(
        "Received message, rejecting to DLX:",
        msg.content.toString()
      );

      // Rechazar mensaje, sin requeue, directo al DLX
      channel.nack(msg, false, false);
    },
    {
      noAck: false,
    }
  );
  console.log("Consumer DLX is waiting for messages...");
})();
