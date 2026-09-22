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

const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin ${origin} is not allowed by CORS.`)
      );
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CodeAlpha E-commerce API is running',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Run normally on your computer.
// Vercel handles the server when deployed.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || 'development'
      } on port ${PORT}`
    );
  });
}

// Export Express app for Vercel
export default app;