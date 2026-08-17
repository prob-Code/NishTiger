const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

const mapTigerToFrontend = (tiger) => {
  if (!tiger) return null;
  return {
    _id: tiger.id,
    id: tiger.id,
    tigerId: tiger.tiger_id,
    name: tiger.name,
    age: tiger.age,
    gender: tiger.gender,
    location: {
      latitude: tiger.latitude,
      longitude: tiger.longitude,
      zone: tiger.zone
    },
    status: tiger.status,
    lastSeen: tiger.last_seen,
    createdAt: tiger.created_at,
    updatedAt: tiger.updated_at
  };
};

// Get all tigers
router.get('/tigers', async (req, res) => {
  try {
    const { data: tigers, error } = await supabase
      .from('tigers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Tigers retrieved successfully',
      count: tigers.length,
      data: tigers.map(mapTigerToFrontend) 
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
    const { data: tiger, error } = await supabase
      .from('tigers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!tiger) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tiger not found' 
      });
    }
    res.json({ 
      success: true, 
      data: mapTigerToFrontend(tiger) 
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
    if (!req.body.tigerId || !req.body.name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: tigerId, name' 
      });
    }

    const { data: newTiger, error } = await supabase
      .from('tigers')
      .insert([{
        tiger_id: req.body.tigerId,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender || 'unknown',
        latitude: req.body.location?.latitude,
        longitude: req.body.location?.longitude,
        zone: req.body.location?.zone,
        status: req.body.status || 'active',
        last_seen: req.body.lastSeen
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'Tiger created successfully',
      data: mapTigerToFrontend(newTiger) 
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
    const updateData = { updated_at: new Date() };
    if (req.body.tigerId !== undefined) updateData.tiger_id = req.body.tigerId;
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.age !== undefined) updateData.age = req.body.age;
    if (req.body.gender !== undefined) updateData.gender = req.body.gender;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.lastSeen !== undefined) updateData.last_seen = req.body.lastSeen;
    
    if (req.body.location) {
      if (req.body.location.latitude !== undefined) updateData.latitude = req.body.location.latitude;
      if (req.body.location.longitude !== undefined) updateData.longitude = req.body.location.longitude;
      if (req.body.location.zone !== undefined) updateData.zone = req.body.location.zone;
    }

    const { data: tiger, error } = await supabase
      .from('tigers')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!tiger) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tiger not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Tiger updated successfully',
      data: mapTigerToFrontend(tiger) 
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
    const { data: tiger, error } = await supabase
      .from('tigers')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!tiger) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tiger not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Tiger deleted successfully',
      data: mapTigerToFrontend(tiger) 
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

    const { error: imageError } = await supabase
      .from('tiger_images')
      .insert([{
        tiger_id: req.params.id,
        image_url: imageUrl,
        capture_time: captureTime,
        location: location
      }]);

    if (imageError) throw imageError;

    // Fetch the tiger again to return
    const { data: tiger, error } = await supabase
      .from('tigers')
      .update({ updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!tiger) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tiger not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Image added successfully',
      data: mapTigerToFrontend(tiger) 
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
    const { data: tigers, error } = await supabase
      .from('tigers')
      .select('*')
      .eq('status', req.params.status);

    if (error) throw error;

    res.json({ 
      success: true, 
      count: tigers.length,
      data: tigers.map(mapTigerToFrontend) 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
