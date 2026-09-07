// Admin endpoint to approve or reject comments
// POST JSON { id: <id>, action: 'approve'|'reject' }
// Requires ADMIN_KEY in header 'x-admin-key' or query param 'admin_key'
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  const { id, action } = req.body || {};
  if (!id || !action) return res.status(400).json({ error: 'Missing id or action' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'comments';
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (action === 'approve') {
	const { error } = await supabase.from('comments').update({ moderated: true }).eq('id', id);
	if (error) return res.status(500).json({ error: 'Failed to approve' });
	return res.status(200).json({ ok: true });
  } else if (action === 'reject') {
	const { error } = await supabase.from('comments').delete().eq('id', id);
	if (error) return res.status(500).json({ error: 'Failed to delete' });
	return res.status(200).json({ ok: true });
  } else {
	return res.status(400).json({ error: 'Unknown action' });
  }
};
