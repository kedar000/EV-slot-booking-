import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Redis
const redisClient = createClient({ url: process.env.REDIS_URL });
console.log(process.env.REDIS_URL)

redisClient.connect().catch(console.error);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.send('API Gateway is up and running');
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});