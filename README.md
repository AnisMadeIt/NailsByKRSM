# nailsbykrsm — Booking Site

Full-stack Next.js booking site. Deploy to Vercel in ~10 minutes.

## Stack

- **Next.js 14** (App Router)
- **Supabase** — Postgres DB (free tier)
- **Resend** — transactional emails (free tier, 3000/mo)
- **Vercel** — hosting (free)

---

## Setup (do this once)

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run
3. Go to **Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Resend

1. Go to [resend.com](https://resend.com) → create free account
2. Create an API key → `RESEND_API_KEY`
3. For testing, use `onboarding@resend.dev` as `EMAIL_FROM`
4. For production, add your domain and use `nails@yourdomain.com`

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=choose_a_strong_password
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

### 4. Gallery Photos

Drop your nail photos into `/public/gallery/`:

- `hero.jpg` — hero section background
- `1.jpg` through `6.jpg` — gallery grid

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or push to GitHub and import at [vercel.com/new](https://vercel.com/new).

Add all env vars in Vercel dashboard under **Settings → Environment Variables**.

---

## URLs

| Page | URL |
|------|-----|
| Home | `/` |
| Booking | `/book` |
| Admin | `/admin` |
| Admin Login | `/admin/login` |

## Admin Dashboard Features

- View all bookings (pending / confirmed / cancelled)
- Confirm or cancel with one click → email sent to client automatically
- Block specific time slots (days off, personal time)
- Revenue stats

---

## Local Dev

```bash
npm install
cp .env.example .env.local
# fill in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
