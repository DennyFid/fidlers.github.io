// Vercel serverless function to accept comment posts and upload images to Supabase Storage
// Environment variables required:
// SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_BUCKET

const { createClient } = require('@supabase/supabase-js');
const formidable = require('formidable');
const fs = require('fs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Basic rate limiting: allow 5 posts per minute per IP (very simple)
  // NOTE: For production use a durable store (Redis) — this is best-effort
  try {
	const form = formidable({ multiples: false });
	form.parse(req, async (err, fields, files) => {
	  if (err) return res.status(400).json({ error: 'Invalid form data' });

	  const name = (fields.name || '').toString().slice(0, 200);
	  const content = (fields.content || '').toString().slice(0, 2000);
	  if (!content) return res.status(400).json({ error: 'Empty content' });

	  const SUPABASE_URL = process.env.SUPABASE_URL;
	  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
	  const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'comments';

	  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

	  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

	  let image_path = null;
	  if (files && files.photo) {
		const photo = files.photo;
		const data = fs.readFileSync(photo.path);
		const filename = `comment_images/${Date.now()}_${photo.name.replace(/[^a-zA-Z0-9_.-]/g,'_')}`;
		const { error: upErr } = await supabase.storage.from(SUPABASE_BUCKET).upload(filename, data, { contentType: photo.type });
		if (upErr) {
		  console.error('Upload error', upErr);
		  return res.status(500).json({ error: 'Failed to upload image' });
		}
		image_path = filename;
	  }

	  const insert = await supabase.from('comments').insert([{ name, content, image_path }]).select('*');
	  if (insert.error) {
		console.error('Insert error', insert.error);
		return res.status(500).json({ error: 'Failed to save comment' });
	  }

	  return res.status(200).json({ ok: true, comment: insert.data[0] });
	});
  } catch (e) {
	console.error(e);
	return res.status(500).json({ error: 'Server error' });
  }
};
