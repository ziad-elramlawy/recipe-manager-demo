# Recipe Manager Demo (EN/AR, roles)

A minimal, bilingual recipe manager you can deploy to Vercel in minutes. No backend yet (uses localStorage).

## Quick start
```bash
npm i
npm run dev
```

## Deploy to Vercel
1. Create a new Vercel project and **Import** this folder (upload or push to Git).
2. Framework preset: **Vite** (or just leave as Other).
3. Build command: `npm run build`
4. Output directory: `dist`
5. Click **Deploy**.

## Notes
- Language toggle EN/AR with RTL.
- Role toggle Admin/Editor/Viewer (Viewer = read-only).
- Recipes persist in **localStorage** in your browser.
- Next step: connect Supabase for auth, Postgres, and file storage.
