import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { Kafka } from "kafkajs";

const prisma = new PrismaClient();
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Initialize Kafka
const kafka = new Kafka({
  clientId: "station-service",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "station-service-group" });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "station-service", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value?.toString() || "{}");
      console.log(`Received station event:`, event);

      // Call the /register-station logic
      try {
        const result = await registerStationLogic(event.payload.payload); // Using the extracted logic
        console.log("Station registered successfully:", result);
      } catch (error) {
        console.error("Error processing station event:", error);
      }
    },
  });
}

// Extract the /register-station logic
async function registerStationLogic(payload: {
  name: string;
  isActive?: boolean;
  defaultPricePerHour: number;
  location: { latitude: number; longitude: number }[];
  slots: { isAvailable?: boolean; pricePerHour?: number }[];
}) {
  const {
    name,
    isActive = true,
    defaultPricePerHour,
    location,
    slots,
  } = payload;

  if (!name || !defaultPricePerHour || !location || location.length === 0 || !slots || slots.length === 0) {
    throw new Error("Invalid input data");
  }

  const station = await prisma.station.create({
    data: {
      name,
      isActive,
      defaultPricePerHour,
      Location: {
        create: location.map((loc) => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
        })),
      },
      Slots: {
        create: slots.map((slot) => ({
          isAvailable: slot.isAvailable ?? true,
          pricePerHour: slot.pricePerHour ?? null,
        })),
      },
    },
  });

  return station;
}

// Define the /register-station route
app.post("/register-station", async (req, res) => {
  try {
    const station = await registerStationLogic(req.body);
    res.status(201).json({ message: "Station registered successfully", station });
  } catch (error) {
    console.error("Error registering station:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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