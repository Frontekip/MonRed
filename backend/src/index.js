import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import containerRoutes from './routes/containers.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clood')
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/users', userRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}); 