const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
  inputs: {
    location: {
      address: String,
      lat: Number,
      lon: Number,
    },
    system: {
      panelArea: Number,
      efficiency: Number,
      tilt: Number,
      azimuth: Number,
      inverterRating: Number,
      cost: Number,
    },
    tariff: Number,
  },
  predictions: {
    recommendedSystemSize_kW: Number,
    recommendedBatteryCapacity_Ah: Number,
    optimalTiltAngle: Number,
    estimatedAnnualYield_kWh: Number,
    estimatedAnnualSavings: Number,
    paybackPeriod_years: Number,
    ROI_percentage: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Simulation', SimulationSchema);
