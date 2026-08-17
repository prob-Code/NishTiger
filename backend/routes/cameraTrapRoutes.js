const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Helper to map DB record to Frontend model
const mapCameraToFrontend = (camera) => {
  if (!camera) return null;
  return {
    _id: camera.id,
    id: camera.id,
    cameraId: camera.camera_id,
    location: {
      latitude: camera.latitude,
      longitude: camera.longitude,
      zone: camera.zone,
      description: camera.description
    },
    status: camera.status,
    batteryLevel: camera.battery_level,
    lastSync: camera.last_sync,
    createdAt: camera.created_at,
    updatedAt: camera.updated_at
  };
};

// Get all camera traps
router.get('/cameras', async (req, res) => {
  try {
    const { data: cameras, error } = await supabase
      .from('camera_traps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Camera traps retrieved successfully',
      count: cameras.length,
      data: cameras.map(mapCameraToFrontend)
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
    const { data: camera, error } = await supabase
      .from('camera_traps')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found

    if (!camera) {
      return res.status(404).json({ 
        success: false, 
        message: 'Camera trap not found' 
      });
    }
    res.json({ 
      success: true, 
      data: mapCameraToFrontend(camera)
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

    const { data: newCamera, error } = await supabase
      .from('camera_traps')
      .insert([{
        camera_id: req.body.cameraId,
        latitude: req.body.location?.latitude,
        longitude: req.body.location?.longitude,
        zone: req.body.location?.zone,
        description: req.body.location?.description,
        status: req.body.status || 'active',
        battery_level: req.body.batteryLevel
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'Camera trap created successfully',
      data: mapCameraToFrontend(newCamera)
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
    const updateData = { updated_at: new Date() };
    if (req.body.cameraId !== undefined) updateData.camera_id = req.body.cameraId;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.batteryLevel !== undefined) updateData.battery_level = req.body.batteryLevel;
    if (req.body.location) {
      if (req.body.location.latitude !== undefined) updateData.latitude = req.body.location.latitude;
      if (req.body.location.longitude !== undefined) updateData.longitude = req.body.location.longitude;
      if (req.body.location.zone !== undefined) updateData.zone = req.body.location.zone;
      if (req.body.location.description !== undefined) updateData.description = req.body.location.description;
    }

    const { data: camera, error } = await supabase
      .from('camera_traps')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!camera) {
      return res.status(404).json({ 
        success: false, 
        message: 'Camera trap not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Camera trap updated successfully',
      data: mapCameraToFrontend(camera)
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

    // Insert capture
    const { error: captureError } = await supabase
      .from('camera_trap_captures')
      .insert([{
        camera_trap_id: req.params.id,
        image_url: imageUrl,
        detected_species: detectedSpecies,
        confidence: confidence,
        timestamp: new Date()
      }]);

    if (captureError) throw captureError;

    // Update last_sync
    const { data: camera, error: updateError } = await supabase
      .from('camera_traps')
      .update({ last_sync: new Date(), updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ 
      success: true, 
      message: 'Capture recorded successfully',
      data: mapCameraToFrontend(camera) 
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

    const { data: camera, error } = await supabase
      .from('camera_traps')
      .update({ battery_level: batteryLevel, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!camera) {
      return res.status(404).json({ 
        success: false, 
        message: 'Camera trap not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Battery level updated',
      data: mapCameraToFrontend(camera) 
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
    const { data: cameras, error } = await supabase
      .from('camera_traps')
      .select('*')
      .eq('zone', req.params.zone);

    if (error) throw error;

    res.json({ 
      success: true, 
      count: cameras.length,
      data: cameras.map(mapCameraToFrontend) 
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
    const { data: cameras, error } = await supabase
      .from('camera_traps')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    res.json({ 
      success: true, 
      count: cameras.length,
      data: cameras.map(mapCameraToFrontend) 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
