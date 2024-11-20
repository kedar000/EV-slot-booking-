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


// POST /reservations
app.post('/reservation/:stationId/:slotId', async (req : any, res : any) => {
  try {
      const { userId, hour } = req.body;
      const { date } = req.headers;
      const { slotId, stationId } = req.params;

      if (!slotId || !stationId || !date) {
          console.log(slotId, stationId, date);
          return res.status(400).json({ error: 'slotId, stationId, date are required in headers' });
      }

      // Fetch totalPrice from the station service
      const stationResponse = await fetch(`http://localhost:5001/get-price/${stationId}`, {
          method: 'GET',
      });

      // Log the raw response for debugging
      // console.log('Station Response:', stationResponse);

      if (!stationResponse.ok) {
          return res.status(500).json({ error: 'Failed to fetch total price from station service' });
      }

      const stationResponseData = await stationResponse.json();

      // Log the parsed response
      console.log('Station Response Data:', stationResponseData);

      const totalPrice = stationResponseData?.stationCost;

      if (!totalPrice) {
          return res.status(400).json({ error: 'Total price not found in station service response' });
      }

      const reservation = await prisma.reservation.create({
        data: {
            userId,
            slotId: String(slotId),
            stationId: String(stationId),
            date: new Date(date as string),
            hour: parseInt(hour as string),
            totalPrice: parseFloat(totalPrice),
            status: 'PENDING',
        },
      });

      

      // Simulating reservation creation
      res.status(201).json({
          price: totalPrice,
          message: 'Reservation would be created successfully',
          reservation
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the reservation' });
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
