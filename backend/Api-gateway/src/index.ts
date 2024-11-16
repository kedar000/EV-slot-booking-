import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import WebSocket from 'ws';
import { createClient } from 'redis';
import { createServer } from 'http';
import { Kafka } from 'kafkajs';


dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

const kafka = new Kafka({
    clientId: 'api-gateway',
    brokers: ['localhost:9092'],
});
  
const producer = kafka.producer();

async function produceEvent(topic: string, eventType: string, payload: object) {
    try {
      await producer.connect();
      await producer.send({
        topic: topic,
        messages: [{
          value: JSON.stringify({
            eventType,   // Add eventType to the message
            payload,     
          }),
        }],
      });
      console.log(`Message sent to topic ${topic}:`, { eventType, payload });
    } catch (error) {
      console.error(`Error sending message: ${error}`);
    } finally {
      await producer.disconnect(); 
    }
}


// Initialize Redis
const redisClient = createClient({ url: process.env.REDIS_URL });
console.log(process.env.REDIS_URL)

redisClient.connect().catch(console.error);


//web socket 
const server = createServer(app)

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

const activeClients: Map<string, WebSocket> = new Map();

wss.on('connection', (ws) => {
    console.log(`Client connected: ${ws}`);

    // Listen for messages from the client to register user ID
    ws.on('message', (message) => {
        const { userId } = JSON.parse(message.toString());
        console.log(`Client registered for userId: ${userId}`);
        activeClients.set(userId, ws);
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log(`Client disconnected: ${ws}`);
        // Remove disconnected client
        activeClients.forEach((client, userId) => {
            if (client === ws) {
                activeClients.delete(userId);
            }
        });
    });
});

//notification event 
app.post('/events', async (req : any, res : any) => {
    const { topic, eventType, payload } = req.body;
  

    if (!topic || !eventType || !payload) {
      return res.status(400).json({ error: 'Missing topic, eventType, or payload' });
    }
  
    await produceEvent(topic, eventType, payload);
    return res.status(200).json({ message: 'Event produced successfully' });
});


// station registration
app.post('/register-station', async (req, res) => {
  const payload = req.body;

  try {
    await produceEvent('station-service', 'register_station', payload);
    res.status(200).json({ message: 'Station registration event sent successfully' });
  } catch (error) {
    console.error('Error sending station registration event:', error);
    res.status(500).json({ error: 'Failed to send station registration event' });
  }
});



server.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async() => {
    console.log('Shutting down gracefully...');
    await producer.disconnect(); 
     process.exit(0);
    
});