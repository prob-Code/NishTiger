const express = require('express');
const router = express.Router();
const Tiger = require('../models/Tiger');

// Get all tigers
router.get('/tigers', async (req, res) => {
  try {
    const tigers = await Tiger.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      message: 'Tigers retrieved successfully',
      count: tigers.length,
      data: tigers 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tigers',
      error: error.message 
    });
  }
});

// Get single tiger by ID
router.get('/tigers/:id', async (req, res) => {
  try {
    const tiger = await Tiger.findById(req.params.id);
    if (!tiger) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tiger not found' 
      });
    }
    res.json({ 
      success: true, 
      data: tiger 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create new tiger
router.post('/tigers', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.tigerId || !req.body.name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: tigerId, name' 
      });
    }

    const newTiger = new Tiger({
      tigerId: req.body.tigerId,
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      location: req.body.location,
      status: req.body.status,
      lastSeen: req.body.lastSeen
    });

    await newTiger.save();
    res.status(201).json({ 
      success: true, 
      message: 'Tiger created successfully',
      data: newTiger 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating tiger',
      error: error.message 
    });
  }
});

// Update tiger
router.put('/tigers/:id', async (req, res) => {
  try {
    const tiger = await Tiger.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!tiger) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tiger not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Tiger updated successfully',
      data: tiger 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating tiger',
      error: error.message 
    });
  }
});

// Delete tiger
router.delete('/tigers/:id', async (req, res) => {
  try {
    const tiger = await Tiger.findByIdAndDelete(req.params.id);

    if (!tiger) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tiger not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Tiger deleted successfully',
      data: tiger 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting tiger',
      error: error.message 
    });
  }
});

// Add camera trap image to tiger
router.post('/tigers/:id/images', async (req, res) => {
  try {
    const { imageUrl, captureTime, location } = req.body;

    const tiger = await Tiger.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          cameraTrapImages: {
            imageUrl,
            captureTime,
            location
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!tiger) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tiger not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Image added successfully',
      data: tiger 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error adding image',
      error: error.message 
    });
  }
});

// Get tigers by status
router.get('/tigers/status/:status', async (req, res) => {
  try {
    const tigers = await Tiger.find({ status: req.params.status });
    res.json({ 
      success: true, 
      count: tigers.length,
      data: tigers 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
