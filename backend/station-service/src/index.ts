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

  //generate the slots for a week 
  await generateTimeslotsForThreedays();

  return station;
}

// generate time slots for a weeke 
async function generateTimeslotsForThreedays() {
    const startDate = new Date(); // Current date
    const endDate = new Date();  // One week later
    endDate.setDate(startDate.getDate() + 3);
  
    // Fetch all slots
    const slots = await prisma.slot.findMany();
  
    if (slots.length === 0) {
      console.log("No slots found to generate timeslots.");
      return;
    }
  
    for (const slot of slots) {
      const timeslots = [];
      let currentTime = new Date(startDate);
      currentTime.setHours(0, 0, 0, 0); // Start at midnight of the current day
  
      while (currentTime < endDate) {
        const currentHour = currentTime.getHours();
  
        timeslots.push({
          slotId: slot.id,
          date: new Date(currentTime),
          hour: currentHour,
          isAvailable: true,
        });
  
        currentTime.setHours(currentHour + 1); // Increment by 1 hour
      }
  
      // Bulk insert the timeslots
      await prisma.slotTiming.createMany({
        data: timeslots,
        skipDuplicates: true,
      });
  
      console.log(`Generated ${timeslots.length} timeslots for Slot ID: ${slot.id}`);
    }
  }

app.get('/all-stations' , async(req , res) =>{
  try {
    const allStations = await prisma.station.findMany({
      include: {
        Slots: true,
        Location: true, 
      },
    });

    if(!allStations){
      res.status(404).json({mssg : "stations fectching error 0r data base is empty"})
      return;
    }

    res.status(200).json({allStations});
  } catch (error) {
    res.status(404).json({error : error});
  }
})

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


app.get('/get-price/:stationId', async (req, res) => {
  const { stationId } = req.params;

  try {
      if (!stationId) {
          res.status(400).json({ mssg: "Please enter Station Id" });
          return;
      }

      const station = await prisma.station.findUnique({
          where: { id: stationId },
      });

      if (!station || !station.defaultPricePerHour) {
          res.status(404).json({ mssg: "Station not found, please enter a valid Station Id" });
          return;
      }

      const stationCost = station.defaultPricePerHour;

      // Log the response for debugging
      console.log(`Station Cost for ${stationId}:`, stationCost);

      res.status(200).json({ stationCost });
  } catch (error) {
      console.error("Error fetching station:", error);
      res.status(500).json({ error: error });
  }
});

app.put("/update-status" , async(req , res)=>{
    const {stationId } = req.body;
    try {
        const station_info = await prisma.station.findUnique({
            where :{
                id : stationId
            }
        })
        
        if(!station_info){
            res.send("station does not exist");
        }

        const updated_station = await prisma.station.update({
            where : {
                id : stationId
            },
            data : {
                isActive : !station_info?.isActive
            }
        })

        res.status(200).json({updated_data : updated_station});
    } catch (error) {
        console.log(error);
        res.status(400).json({error : error})
        
    }
})


// route to get the free slots on that date
app.get("/free-slots/:stationId", async (req : any, res : any) => {
    const { stationId } = req.params;
    const { date } = req.query; // Date should be in 'YYYY-MM-DD' format
  
    if (!date) {
      return res.status(400).json({ error: "Please provide a valid date in 'YYYY-MM-DD' format" });
    }
  
    try {
      // Parse the date
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0); // Normalize to the start of the day
  
      // Fetch all free slots of the station for the specified day
      const freeSlots = await prisma.slotTiming.findMany({
        where: {
          slot: {
            stationId: stationId,
            isAvailable: true, 
          },
          date: targetDate,
          isAvailable: true, 
        },
        orderBy: {
          hour: "asc", 
        },
        include: {
          slot: true, 
        },
      });
  
      if (freeSlots.length === 0) {
        return res.status(404).json({ message: "No free slots available for the given date." });
      }
  
      res.status(200).json(freeSlots);
    } catch (error) {
      console.error("Error fetching free slots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });



  app.get("/slot-timings/:slotId/", async (req : any, res : any) => {
    const { slotId } = req.params;
    // const { date } = req.query;
  
    if (!slotId ) {
      return res.status(400).json({ error: "Missing slotId or date in query" });
    }
  
    try {
  
      // Query SlotTiming table
      const slotTimings = await prisma.slotTiming.findMany({
        where: {
          slotId, 
        },
        include: {
          slot: true, // Include the slot details if needed
        },
      });
  
      if (slotTimings.length === 0) {
        return res.status(404).json({ message: "No slot timings found for the given date and slot" });
      }
  
      res.status(200).json(slotTimings);
    } catch (error) {
      console.error("Error fetching slot timings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put('/available/:slotId/:date/:hour', async (req: any, res: any) => {
    const { slotId, date, hour } = req.params;
  
    // Validate inputs
    if (!slotId || !date || !hour) {
      return res.status(400).json({ error: "Missing slotId, date, or hour in parameters" });
    }
  
    try {
      // Debugging input values
      console.log({
        slotId,
        date: new Date(date),
        hour: parseInt(hour),
        isAvailable: true,
      });
  
      // Find and update the specific slot timing
      const updatedSlotTiming = await prisma.slotTiming.update({
        where: {
          slotId_date_hour: {
            slotId: slotId,
            date: new Date(date), // Ensure the date is converted to a Date object
            hour: parseInt(hour), // Ensure hour is an integer
          },
        },
        data: {
          isAvailable: false,
        },
      });
  
      res.status(200).json({ message: "Slot availability updated successfully", updatedSlotTiming });
    } catch (error) {
      
      console.error("Error updating slot timing:", error);
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