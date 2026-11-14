# Scenara Landing Page & Waitlist

A standalone, premium landing page for **Scenara** designed to explain the multi-agent simulation platform, demonstrate an interactive network model, and securely capture early access waitlist registrations.

---

## 📁 Complete Folder Isolation

This folder (`scenara-landing/`) is completely self-contained:
- It has its own `package.json`, `node_modules`, and lockfile.
- It does **not** import, depend on, or modify any files from the main Scenara simulation application.
- When the full Scenara application is ready for production, this entire directory can be safely removed by running:
  ```bash
  rm -rf scenara-landing
  ```
  without having any impact on the main application.

---

## 🚀 Running Independently

### 1. Development Server
From inside the `scenara-landing/` directory:
```bash
cd scenara-landing
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser. (Port `3001` is used to prevent collisions with the main app on `3000`).

### 2. Run Tests
```bash
npm test
```
Runs the automated waitlist API test suite (validation, duplicate prevention, sanitized payload handling).

### 3. Production Build & Start
```bash
npm run build
npm start
```

---

## 🗄️ Supabase Waitlist Storage Configuration

The waitlist endpoint (`/api/waitlist`) is designed to write directly and securely to Supabase without exposing secret keys in frontend code.

### Supabase Table SQL
Run this SQL in your Supabase SQL Editor:
```sql
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text,
  use_case text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table waitlist enable row level security;
```

### Environment Variables
Copy `.env.example` to `.env.local` inside `scenara-landing/`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials:
```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
```

> **Note on Local Testing:** If Supabase environment variables are omitted, the API automatically falls back to storing entries locally at `data/waitlist.json` with in-memory duplicate prevention, ensuring it works out-of-the-box in local preview environments.

---

## 🚢 Independent Deployment

To deploy this landing page separately from the main app on platforms like **Vercel** or **Netlify**:
1. Set the **Root Directory** setting in your project settings to:
   ```
   scenara-landing
   ```
2. Build command: `npm run build`
3. Output directory: `.next`
4. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the hosting environment variables.

