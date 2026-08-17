const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
  officerId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  station: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'officer', 'ranger'],
    default: 'officer'
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

module.exports = mongoose.model('Officer', officerSchema);
