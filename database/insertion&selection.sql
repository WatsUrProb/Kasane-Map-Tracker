alter table public.sightings enable row level security;

create policy "Allow public read sightings"
on public.sightings
for select
to anon
using (true);

create policy "Allow public insert sightings"
on public.sightings
for insert
to anon
with check (true);