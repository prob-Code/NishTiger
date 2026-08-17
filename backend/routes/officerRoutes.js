const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

const mapOfficerToFrontend = (officer) => {
  if (!officer) return null;
  return {
    _id: officer.id,
    id: officer.id,
    officerId: officer.officer_id,
    name: officer.name,
    email: officer.email,
    station: officer.station,
    role: officer.role,
    createdAt: officer.created_at,
    updatedAt: officer.updated_at
  };
};

// Get all officers
router.get('/officers', async (req, res) => {
  try {
    const { data: officers, error } = await supabase
      .from('officers')
      .select('id, officer_id, name, email, station, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Officers retrieved successfully',
      count: officers.length,
      data: officers.map(mapOfficerToFrontend) 
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
    const { data: officer, error } = await supabase
      .from('officers')
      .select('id, officer_id, name, email, station, role, created_at, updated_at')
      .eq('id', req.params.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Officer not found' 
      });
    }
    res.json({ 
      success: true, 
      data: mapOfficerToFrontend(officer) 
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

    if (!officerId || !name || !email || !password || !station) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if officer already exists
    const { data: existing } = await supabase
      .from('officers')
      .select('id')
      .or(`officer_id.eq.${officerId},email.eq.${email}`);

    if (existing && existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Officer ID or email already registered' 
      });
    }

    const { data: newOfficer, error } = await supabase
      .from('officers')
      .insert([{
        officer_id: officerId,
        name,
        email,
        password, // TODO: Hash this with bcrypt before saving
        station,
        role: role || 'officer'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'Officer registered successfully',
      data: mapOfficerToFrontend(newOfficer)
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

    const { data: officer, error } = await supabase
      .from('officers')
      .select('*')
      .eq('officer_id', officerId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

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
      data: mapOfficerToFrontend(officer)
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
    const { password, ...updateData } = req.body;
    
    const dbUpdate = { updated_at: new Date() };
    if (updateData.officerId) dbUpdate.officer_id = updateData.officerId;
    if (updateData.name) dbUpdate.name = updateData.name;
    if (updateData.email) dbUpdate.email = updateData.email;
    if (updateData.station) dbUpdate.station = updateData.station;
    if (updateData.role) dbUpdate.role = updateData.role;

    const { data: officer, error } = await supabase
      .from('officers')
      .update(dbUpdate)
      .eq('id', req.params.id)
      .select('id, officer_id, name, email, station, role, created_at, updated_at')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Officer not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Officer updated successfully',
      data: mapOfficerToFrontend(officer) 
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
    const { data: officer, error } = await supabase
      .from('officers')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;

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
    const { data: officers, error } = await supabase
      .from('officers')
      .select('id, officer_id, name, email, station, role, created_at, updated_at')
      .eq('role', req.params.role);

    if (error) throw error;

    res.json({ 
      success: true, 
      count: officers.length,
      data: officers.map(mapOfficerToFrontend) 
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
    const { data: officers, error } = await supabase
      .from('officers')
      .select('id, officer_id, name, email, station, role, created_at, updated_at')
      .eq('station', req.params.station);

    if (error) throw error;

    res.json({ 
      success: true, 
      count: officers.length,
      data: officers.map(mapOfficerToFrontend) 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
