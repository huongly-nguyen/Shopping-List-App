import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import connectDB from '../config/database';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes';
import shoppingListRoutes from './routes/shoppingListRoutes';
import shoppingListItemRoutes from './routes/shoppingListItemRoutes';
import statisticRoutes from './routes/statisticsRoutes';
import nearBySupermarketRoutes from './routes/nearBySupermarketRoutes';

dotenv.config(); 

const app = express();
app.use(express.json()); 
app.use((req, res, next) => {
  console.info(`New request to ${req.path}`);
  next();
});

//connect to MongoDB
connectDB();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// API routes
app.use('/api/items', itemRoutes);
app.use('/api/shoppingLists', shoppingListRoutes);
app.use('/api/shoppingListItems', shoppingListItemRoutes);
app.use('/api/statistics', statisticRoutes);
app.use('/api/nearby-supermarkets', nearBySupermarketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  // Default error response
  res.status(500).json({
    errors: ['Internal Server Error'],
  });
});

export default app;