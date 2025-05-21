import amqplib from "amqplib";
import { upcastTaskAssigned, TaskAssignedV2 } from "./upcasters";

(async () => {
  const conn = await amqplib.connect("amqp://user:password@localhost:5672");
  const channel = await conn.createChannel();

  const QUEUE = "task_assigned_queue";
  await channel.assertQueue(QUEUE, { durable: true });

  await channel.consume(
    QUEUE,
    (msg) => {
      if (!msg) return;
      const raw = JSON.parse(msg.content.toString());
      const eventV2: TaskAssignedV2 = upcastTaskAssigned(raw);
      console.log("Processed TaskAssigned (v2):", eventV2);
      channel.ack(msg);
    },
    { noAck: false }
  );

  console.log("UpcasterConsumer listening on", QUEUE);
})();
