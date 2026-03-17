-- Run this in Supabase SQL Editor

create table bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  service text not null,
  price integer not null,
  duration_mins integer not null,
  date date not null,
  time text not null,
  notes text,
  status text not null default 'pending',  -- pending | confirmed | cancelled
  created_at timestamptz default now()
);

create table blocked_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text not null,
  reason text,
  unique(date, time)
);

-- Index for fast slot lookups
create index bookings_date_idx on bookings(date);
create index blocked_date_idx on blocked_slots(date);
