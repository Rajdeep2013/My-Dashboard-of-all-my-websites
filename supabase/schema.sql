-- Apply in Supabase SQL editor. Keep service_role key server-side only.
create table if not exists public.analytics_events (
 id bigint generated always as identity primary key,
 site text not null check(site in ('notes','study')),
 event text not null check(event in ('page_view','study_opened','quiz_started','quiz_completed','note_opened','note_saved','note_created')),
 created_at timestamptz not null default now()
);
create index if not exists analytics_events_site_date on public.analytics_events(site,created_at desc);
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon,authenticated;
-- No direct client writes/reads. Edge functions use service role after validating requests.
