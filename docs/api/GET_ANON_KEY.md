# Get Supabase Anon Key

## Project Details:
- **Project ID:** `onbpsjzgzcfnucikheso`
- **Dashboard:** https://supabase.com/dashboard/project/onbpsjzgzcfnucikheso

## Steps:
1. Go to Settings → API in your Supabase dashboard
2. Copy the **anon public** key (starts with `eyJ...`)
3. Add to `.env` file:
   ```env
   SUPABASE_ANON_KEY=your-copied-key-here
   ```
4. Restart dev server: `npm run dev`