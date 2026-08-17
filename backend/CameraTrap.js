const mongoose = require('mongoose');

const cameraTrapSchema = new mongoose.Schema({
  cameraId: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    zone: String,
    description: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  captures: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    imageUrl: String,
    detectedSpecies: [String],
    confidence: Number,
    metadata: mongoose.Schema.Types.Mixed
  }],
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  lastSync: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CameraTrap', cameraTrapSchema);
