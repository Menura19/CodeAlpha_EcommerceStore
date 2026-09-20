import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import {
  notFound,
  errorHandler,
} from './middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

// Only allow the origins you actually deploy.
// Never use '*' with credentials.
const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman/curl requests with no origin
      // and allow frontend URLs listed in CLIENT_URL.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(
        new Error(`Origin ${origin} is not allowed by CORS.`)
      );
    },

    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: '1mb' }));

// Parse URL-encoded form data
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Product routes
app.use('/api/products', productRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || 'development'
    } on port ${PORT}`
  );
});