const { createClient } = require('@supabase/supabase-js');

// Initialize the Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'public-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
