import express from 'express';
import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Initialize Kafka
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['localhost:9092'],
});
const consumer = kafka.consumer({ groupId: 'notification-group' });
async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'notification-service', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value?.toString() || '{}');
      console.log(`Received notification event:`, event);
      // Here you can add logic to handle the notification, e.g., send email or SMS
    },
  });
}
app.get('/health', (req, res) => {
  res.send('Notification Server is up and running');
});
// Start the Kafka consumer and the Express server
const startServer = async () => {
  await runConsumer();
  app.listen(PORT, () => {
    console.log(`Notification Server is running on port ${PORT}`);
  });
};
startServer().catch(console.error);
// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await consumer.disconnect(); // Ensure the consumer is disconnected
  process.exit(0);
});