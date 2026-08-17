const express = require('express');
const router = express.Router();
const CameraTrap = require('../models/CameraTrap');

// Get all camera traps
router.get('/cameras', async (req, res) => {
  try {
    const cameras = await CameraTrap.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      message: 'Camera traps retrieved successfully',
      count: cameras.length,
      data: cameras 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching camera traps',
      error: error.message 
    });
  }
});

// Get single camera trap
router.get('/cameras/:id', async (req, res) => {
  try {
    const camera = await CameraTrap.findById(req.params.id);
    if (!camera) {
      return res.status(404).json({ 
        success: false, 
        message: 'Camera trap not found' 
      });
    }
    res.json({ 
      success: true, 
      data: camera 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create new camera trap
router.post('/cameras', async (req, res) => {
  try {
    if (!req.body.cameraId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required field: cameraId' 
      });
    }

    const newCamera = new CameraTrap({
      cameraId: req.body.cameraId,
      location: req.body.location,
      status: req.body.status || 'active',
      batteryLevel: req.body.batteryLevel
    });

    await newCamera.save();
    res.status(201).json({ 
      success: true, 
      message: 'Camera trap created successfully',
      data: newCamera 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating camera trap',
      error: error.message 
    });
  }
});

// Update camera trap
router.put('/cameras/:id', async (req, res) => {
  try {
    const camera = await CameraTrap.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!camera) {
      return res.status(404).json({ 
        success: false, 
        message: 'Camera trap not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Camera trap updated successfully',
      data: camera 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating camera trap',
      error: error.message 
    });
  }
});

// Add capture/image to camera trap
router.post('/cameras/:id/captures', async (req, res) => {
  try {
    const { imageUrl, detectedSpecies, confidence } = req.body;

    const camera = await CameraTrap.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          captures: {
            imageUrl,
            detectedSpecies,
            confidence,
            timestamp: new Date()
          }
        },
        lastSync: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!camera) {
      return res.status(404).json({ 
        success: false, 
        message: 'Camera trap not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Capture recorded successfully',
      data: camera 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error recording capture',
      error: error.message 
    });
  }
});

// Update battery level
router.patch('/cameras/:id/battery', async (req, res) => {
  try {
    const { batteryLevel } = req.body;

    if (batteryLevel === undefined || batteryLevel < 0 || batteryLevel > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid battery level (0-100)' 
      });
    }

    const camera = await CameraTrap.findByIdAndUpdate(
      req.params.id,
      { batteryLevel, updatedAt: new Date() },
      { new: true }
    );

    if (!camera) {
      return res.status(404).json({ 
        success: false, 
        message: 'Camera trap not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Battery level updated',
      data: camera 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get cameras by zone
router.get('/cameras/zone/:zone', async (req, res) => {
  try {
    const cameras = await CameraTrap.find({ 'location.zone': req.params.zone });
    res.json({ 
      success: true, 
      count: cameras.length,
      data: cameras 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get active cameras only
router.get('/cameras/status/active', async (req, res) => {
  try {
    const cameras = await CameraTrap.find({ status: 'active' });
    res.json({ 
      success: true, 
      count: cameras.length,
      data: cameras 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
