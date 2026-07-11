# NailsByKRSM

A full-stack booking website built for a Montréal-based nail artist — from landing page to admin dashboard. Live in production on Vercel.

🔗 **Live:** [nails-by-krsm.vercel.app](https://nails-by-krsm.vercel.app)

## Overview

A complete client-facing site plus a private back-office, designed and built end to end:

- **Landing / portfolio** — hero, work gallery, and a full services & pricing menu (full sets, refills, removals with durations and prices)
- **Booking flow** — appointment booking with a required deposit, cancellation and late policies
- **Admin dashboard** — password-protected back-office (`/admin`) for managing bookings and content

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Supabase** for the backend (database + auth)
- **Vercel** for deployment (CI/CD on every push)
- Custom **middleware** for route protection on the admin area

## Design

Dark, editorial aesthetic — near-black background with a mint accent, oversized typography, and generous spacing. The goal was a look that feels closer to a fashion brand than a typical service-booking template.

## What I built / learned

- Structuring a full Next.js App Router project (pages, layouts, middleware)
- Integrating Supabase for data and authentication
- Building and protecting an admin-only area behind a login
- Managing environment variables safely (secrets kept out of the repo via `.env.example` + `.gitignore`)
- Full deployment lifecycle: local → build → production on Vercel

## Notes

Portfolio images shown on the live site are the client's own content and aren't included in the repo. This project is a real, deployed build made for an actual small business.

---

*Built by [Anis](https://github.com/AnisMadeIt) · Montréal*
