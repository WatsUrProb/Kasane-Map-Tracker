alter table public.sightings
add column if not exists verified_count integer not null default 0,
add column if not exists last_verified_at timestamptz;

