// Vercel serverless function to list public (moderated = true) comments
// Environment variables required: SUPABASE_URL, SUPABASE_SERVICE_KEY

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'comments';

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(100).eq('moderated', true);
  if (error) return res.status(500).json({ error: 'Failed to fetch comments' });

  // For each comment with image_path, generate a public URL
  const results = await Promise.all(data.map(async (c) => {
	if (c.image_path) {
	  const { publicURL, error: urlErr } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(c.image_path);
	  c.image_url = publicURL || null;
	  if (urlErr) c.image_url = null;
	}
	return c;
  }));

  return res.status(200).json({ comments: results });
};
