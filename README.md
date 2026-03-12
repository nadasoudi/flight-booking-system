# Flight Booking System

A full-stack flight booking web application built with Node.js, Express, MongoDB, and React.

## Features
- User registration and login with JWT authentication
- Email verification with 6-digit code via Mailtrap
- Search flights by from, to, and date
- Book flights and manage bookings
- Cancel bookings

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Vite, Axios, React Router
- **Auth:** JWT, bcrypt
- **Email:** Nodemailer + Mailtrap

## How to Run

### 1. Start MongoDB
```
mongod --dbpath C:\data\db
```

### 2. Start Backend
```
cd backend
node server.js
```

### 3. Start Frontend
```
cd frontend
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

## Environment Variables
Create a `.env` file inside the `backend` folder:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/flightbooking
JWT_SECRET=supersecretkey123
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=587
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
```

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/verify`
- POST `/api/auth/login`

### Flights
- GET `/api/flights`
- GET `/api/flights/search?from=&to=&date=`
- POST `/api/flights`
- PUT `/api/flights/:id`
- DELETE `/api/flights/:id`

### Bookings
- POST `/api/bookings`
- GET `/api/bookings/my`
- PUT `/api/bookings/:id/cancel`