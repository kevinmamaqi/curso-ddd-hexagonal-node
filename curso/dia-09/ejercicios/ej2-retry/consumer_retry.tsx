import amqplib from "amqplib";

(async () => {
  const conn = await amqplib.connect("amqp://user:password@localhost:5672");
  const channel = await conn.createChannel();

  const MAX_RETRIES = 3;
  const WORK_QUEUE = "work_queue";

  await channel.consume(
    WORK_QUEUE,
    async (msg) => {
      if (!msg) return;
      const headers = msg.properties.headers || {};
      const attempt = (headers["x-attempt"] || 0) + 1;
      console.log(`Processing attempt ${attempt}:`, msg.content.toString());

      try {
        if (attempt <= MAX_RETRIES) {
          throw new Error(`Simulated error on attempt ${attempt}`);
        }
        console.log("Processed successfully on attempt", attempt);
        channel.ack(msg);
      } catch (err) {
        console.error((err as Error).message);
        if (attempt < MAX_RETRIES) {
          console.log(`Requeuing for retry ${attempt + 1}`);
          headers["x-attempt"] = attempt;
          channel.publish("main_exchange", WORK_QUEUE, msg.content, {
            headers,
            persistent: true,
          });
          channel.ack(msg);
        } else {
          console.log("Max retries reached, sending to DLX");
          channel.nack(msg, false, false);
        }
      }
    },
    { noAck: false }
  );

  console.log("RetryConsumer is listening on work_queue");
})();
