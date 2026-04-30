const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Simulation = require('./models/Simulation');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to read JSON sent from React

// MongoDB Connection (Use your MongoDB Atlas URI in a .env file)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("Connection Error: ", err));

// Test Route
app.get('/', (req, res) => {
  res.send('SolarOpti Backend is running!');
});

// Simulation Route
app.post('/api/simulate', async (req, res) => {
  try {
    const payload = req.body;
    
    // Forward to Python ML Microservice
    // Defaulting to localhost:8000 if not specified in env
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/predict';
    
    const mlResponse = await axios.post(ML_SERVICE_URL, payload);
    const predictions = mlResponse.data;
    
    // Save to MongoDB (Non-blocking)
    const newSimulation = new Simulation({
      inputs: payload,
      predictions: predictions
    });
    
    try {
      await newSimulation.save();
    } catch (dbError) {
      console.warn("Could not save to MongoDB (is it running?):", dbError.message);
    }
    
    // Return complete results to Frontend
    res.status(200).json({
      success: true,
      data: newSimulation
    });
    
  } catch (error) {
    console.error("Simulation API Error: ", error.message);
    res.status(500).json({ success: false, message: 'Simulation failed', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));