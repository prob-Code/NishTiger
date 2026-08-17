const express = require('express');
const router = express.Router();
const Officer = require('../models/Officer');

// Get all officers
router.get('/officers', async (req, res) => {
  try {
    const officers = await Officer.find().select('-password').sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      message: 'Officers retrieved successfully',
      count: officers.length,
      data: officers 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching officers',
      error: error.message 
    });
  }
});

// Get single officer
router.get('/officers/:id', async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id).select('-password');
    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Officer not found' 
      });
    }
    res.json({ 
      success: true, 
      data: officer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create new officer (signup)
router.post('/officers', async (req, res) => {
  try {
    const { officerId, name, email, password, station, role } = req.body;

    // Validation
    if (!officerId || !name || !email || !password || !station) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if officer already exists
    const existingOfficer = await Officer.findOne({ 
      $or: [{ officerId }, { email }] 
    });

    if (existingOfficer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Officer ID or email already registered' 
      });
    }

    // Note: In production, hash the password using bcrypt
    const newOfficer = new Officer({
      officerId,
      name,
      email,
      password, // TODO: Hash this with bcrypt before saving
      station,
      role: role || 'officer'
    });

    await newOfficer.save();

    res.status(201).json({ 
      success: true, 
      message: 'Officer registered successfully',
      data: {
        _id: newOfficer._id,
        officerId: newOfficer.officerId,
        name: newOfficer.name,
        email: newOfficer.email,
        role: newOfficer.role
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating officer',
      error: error.message 
    });
  }
});

// Login officer
router.post('/officers/login', async (req, res) => {
  try {
    const { officerId, password } = req.body;

    if (!officerId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Officer ID and password required' 
      });
    }

    const officer = await Officer.findOne({ officerId });

    if (!officer) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // TODO: Use bcrypt.compare() in production
    if (officer.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Login successful',
      data: {
        _id: officer._id,
        officerId: officer.officerId,
        name: officer.name,
        email: officer.email,
        station: officer.station,
        role: officer.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error during login',
      error: error.message 
    });
  }
});

// Update officer
router.put('/officers/:id', async (req, res) => {
  try {
    // Prevent password update via this route
    const { password, ...updateData } = req.body;

    const officer = await Officer.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Officer not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Officer updated successfully',
      data: officer 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating officer',
      error: error.message 
    });
  }
});

// Delete officer
router.delete('/officers/:id', async (req, res) => {
  try {
    const officer = await Officer.findByIdAndDelete(req.params.id);

    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Officer not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Officer deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting officer',
      error: error.message 
    });
  }
});

// Get officers by role
router.get('/officers/role/:role', async (req, res) => {
  try {
    const officers = await Officer.find({ role: req.params.role }).select('-password');
    res.json({ 
      success: true, 
      count: officers.length,
      data: officers 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get officers by station
router.get('/officers/station/:station', async (req, res) => {
  try {
    const officers = await Officer.find({ station: req.params.station }).select('-password');
    res.json({ 
      success: true, 
      count: officers.length,
      data: officers 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
