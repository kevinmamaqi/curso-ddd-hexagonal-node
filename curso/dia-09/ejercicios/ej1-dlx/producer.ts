import amqplib from "amqplib";

(async () => {
  // 1. Establecer conexión
  const conn = await amqplib.connect("amqp://user:password@localhost:5672");
  const channel = await conn.createChannel();

  // 2. Publicar mensaje
  const msg = { hello: "world" };
  await channel.publish(
    "main_exchange",
    "work",
    Buffer.from(JSON.stringify(msg)),
    { persistent: true }
  );
  console.log("Message published!");

  // 3. Cerrar conexión
  await channel.close();
  await conn.close();
})();
