Supabase setup for Blog comments
================================

Overview
--------
This project uses Supabase Storage to host uploaded images and a Postgres table to store comments. A serverless API (Vercel) handles uploads and DB writes.

Steps
-----
1. Create a Supabase project at https://app.supabase.com/
2. In the Supabase dashboard, open SQL Editor and run `sql/create_comments_table.sql` to create the comments table.
3. Create a Storage bucket (name: comments) and set public access to "public" for objects you want publicly accessible (or leave private and use signed URLs).
4. Obtain the Supabase URL and a Service Role key (or anon key if you configure RLS). In the Supabase dashboard: Settings -> API.

Vercel environment variables
----------------------------
In your Vercel project settings add the following Environment Variables:
- SUPABASE_URL = https://... (your Supabase project URL)
- SUPABASE_SERVICE_KEY = <service_role_key> (needed for server-side writes and storage upload)
- SUPABASE_BUCKET = comments

Deployment
----------
1. Push the repo and connect it to Vercel. Vercel will detect the api/ folder and deploy serverless functions.
2. Ensure environment variables are set in Vercel before deployment so the functions can access Supabase.

Moderation
----------
By default comments are inserted with `moderated = false`. Use Supabase dashboard (Table Editor) to mark comments as moderated=true to make them visible on the public site. You can implement an admin function later.

Security notes
--------------
- Using a Service Role key in serverless functions is convenient but treat it as a secret; set it only in Vercel env and never expose on client-side.
- For higher security, implement RLS policies and use a restricted key.
