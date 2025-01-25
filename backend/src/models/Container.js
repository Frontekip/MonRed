import mongoose from 'mongoose';

const containerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  containerName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mongodb', 'redis'],
    required: true
  },
  version: {
    type: String
  },
  status: {
    type: String,
    enum: ['creating', 'running', 'stopped', 'error'],
    default: 'creating'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  containerId: {
    type: String
  },
  port: {
    type: String
  },
  username: String,
  password: String,
  database: String,
  connectionString: {
    type: String
  },
  storage: String,  // MongoDB için disk alanı
  memory: String,   // Her iki tip için RAM
  volumeName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Container = mongoose.model('Container', containerSchema); 