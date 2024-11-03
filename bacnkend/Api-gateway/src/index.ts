import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import WebSocket from 'ws';
import { createClient } from 'redis';
import { createServer } from 'http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

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

app.post('/signup' , async (req, res)=>{
    
})

// Start the server
server.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    wss.clients.forEach(client => {
        client.close();
    });
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});