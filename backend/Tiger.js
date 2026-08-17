const mongoose = require('mongoose');

const tigerSchema = new mongoose.Schema({
  tigerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  location: {
    latitude: Number,
    longitude: Number,
    zone: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased'],
    default: 'active'
  },
  lastSeen: {
    type: Date
  },
  cameraTrapImages: [{
    imageUrl: String,
    captureTime: Date,
    location: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tiger', tigerSchema);
