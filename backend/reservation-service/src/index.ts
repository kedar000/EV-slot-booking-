import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { Kafka } from "kafkajs";

const prisma = new PrismaClient();
const app = express();
const PORT = 7001;

app.use(cors());
app.use(express.json());

// Initialize Kafka
const kafka = new Kafka({
  clientId: "reservation-service",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "reservation-service-group" });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "reservation-service", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value?.toString() || "{}");
      console.log(`Received reservation event:`, event);

      
    },
  });
}


// Start the Kafka consumer and the Express server
const startServer = async () => {
    await runConsumer();
    app.listen(PORT, () => {
      console.log(`Station Server is running on port ${PORT}`);
    });
  };
  startServer().catch(console.error);
  
  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    await consumer.disconnect();
    process.exit(0);
  });
