create table if not exists public.sightings (
  id uuid primary key default gen_random_uuid(),

  category text not null,
  animal_type text,
  group_type text,
  count integer default 0,
  behaviour text,
  description text,

  lat double precision not null,
  lng double precision not null,

  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);