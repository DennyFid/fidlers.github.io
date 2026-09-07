// Admin endpoint to list all comments (including unmoderated)
// Requires ADMIN_KEY in header 'x-admin-key' or query param 'admin_key'
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'comments';
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(500);
  if (error) return res.status(500).json({ error: 'Failed to fetch comments' });

  const results = await Promise.all(data.map(async (c) => {
	if (c.image_path) {
	  const { publicURL } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(c.image_path);
	  c.image_url = publicURL || null;
	}
	return c;
  }));

  return res.status(200).json({ comments: results });
};
