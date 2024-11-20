# EV Slot Booking System

## Overview

The **EV Slot Booking System** is a microservices-based solution designed to provide users with an intuitive platform for booking slots at electric vehicle (EV) charging stations. The system handles user requests for booking, payments, notifications, and station management, utilizing a combination of backend services and a message broker (Kafka) to ensure scalability and responsiveness.

### Architecture

The system is designed using **microservices** architecture, where each service handles a specific responsibility. These services interact with each other via **Kafka**, allowing asynchronous communication.

#### Core Components:
1. **API Gateway**: The entry point for user requests. It handles routing and publishes events to Kafka for further processing by the relevant services.
2. **User Service**: Stores and manages user details (profiles, authentication, etc.).
3. **Station Service**: Manages the details of EV charging stations, including available slots and their pricing.
4. **Reservation Service**: Handles slot reservations, managing the booking process for users.
5. **Payment Service**: Handles the payment process for reservations made by users.
6. **Notification Service**: Sends notifications to users regarding their reservations, payments, and updates.
7. **Kafka**: Manages the communication between services through Kafka topics.

### Flow of Requests

1. **User Request**: A user sends a request (e.g., for slot booking) via the **API Gateway**.
2. **Event Publishing**: The API Gateway publishes an event to a Kafka topic corresponding to the required service (e.g., `reservation-service` topic).
3. **Service Consumption**: The relevant service (e.g., Reservation Service) consumes the event, processes it, and returns the response to the user.
4. **Data Persistence**: Each service stores its data (user details, reservation information, payment status, etc.) in its own PostgreSQL database.

### Technologies Used

- **Kafka** for asynchronous communication.
- **Docker** for containerizing services and databases.
- **PostgreSQL** for storing service-related data.
- **Node.js**, **Express**, and **TypeScript** for backend services.

## Setup

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Kafka running on `localhost:9092` to handle messaging between services.
- PostgreSQL running in Docker containers for each service.

### Docker Commands

Below are the commands to run the required Docker containers for each service, which are configured with their own PostgreSQL databases.

#### 1. API Gateway

```bash
docker run -d \
  --name Ev-api-gateway-db \
  -p 8000:5432 \
  -e POSTGRES_USER=ev_api_user \
  -e POSTGRES_PASSWORD=ev_api_password \
  -e POSTGRES_DB=ev_api_gateway_db \
  postgres
```
#### 1. API Gateway

```bash
docker run -d \
  --name Ev-api-gateway-db \
  -p 8000:5432 \
  -e POSTGRES_USER=ev_api_user \
  -e POSTGRES_PASSWORD=ev_api_password \
  -e POSTGRES_DB=ev_api_gateway_db \
  postgres
```
#### 1. Notification Service 

```bash
docker run -d \
  --name Ev-notification-service \
  -p 3000:5432 \
  -e POSTGRES_USER=ev_notification_user \
  -e POSTGRES_PASSWORD=ev_notification_password \
  -e POSTGRES_DB=ev_notification_db \
  postgres
```
#### 1. User Service 

```bash
docker run -d \
  --name Ev-user-db \
  -p 6000:5432 \
  -e POSTGRES_USER=ev_user \
  -e POSTGRES_PASSWORD=ev_user_password \
  -e POSTGRES_DB=ev_user_db \
  postgres
```
#### 1. Station Service

```bash
docker run -d \
  --name Ev-station-service \
  -p 4002:5432 \
  -e POSTGRES_USER=ev_station_user \
  -e POSTGRES_PASSWORD=ev_station_password \
  -e POSTGRES_DB=ev_station_db \
  postgres
```
#### 1. Reservation Service

```bash
docker run -d \
  --name Ev-reservation-service \
  -p 4003:5432 \
  -e POSTGRES_USER=ev_reservation_user \
  -e POSTGRES_PASSWORD=ev_reservation_password \
  -e POSTGRES_DB=ev_reservation_db \
  postgres
```

### Kafka Topics 
```bash
# Station Service
./kafka-topics.sh --create --topic station-service --bootstrap-server localhost:9092

# Reservation Service
./kafka-topics.sh --create --topic reservation-service --bootstrap-server localhost:9092

# Notification Service
./kafka-topics.sh --create --topic notification-service --bootstrap-server localhost:9092

# Payment Service
./kafka-topics.sh --create --topic payment-service --bootstrap-server localhost:9092
```