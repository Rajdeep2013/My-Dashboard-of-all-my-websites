# Supabase activation guide

## Current status
GitHub code is committed. No Supabase project has been provisioned, no functions have been deployed, and no live data collection has been verified.

## 1. Create or choose Supabase project
In Supabase SQL Editor run `supabase/schema.sql`. Create an administrator account in Authentication → Users. Copy that user's **UUID**.

## 2. Deploy Edge Functions
Using Supabase CLI linked to your project:
```bash
supabase functions deploy ingest-event --no-verify-jwt
supabase functions deploy dashboard-stats --no-verify-jwt
```
The dashboard-stats function validates the JWT itself. Do not deploy it without that authorization check.

Set function secrets:
- `ALLOWED_ORIGINS`: exact origins for Notes and Study deployments, comma-separated.
- `DASHBOARD_ORIGIN`: exact GitHub Pages dashboard origin, e.g. https://rajdeep2013.github.io (origin excludes path).
- `DASHBOARD_ADMIN_UID`: your Supabase Authentication user UUID.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: supplied by Supabase's Edge Function environment or configured securely as secrets. Never put service-role key into browser or GitHub files.

## 3. Enable website tracking
In **both** source websites, insert the following BEFORE the `visionary-analytics.js` script tag:
```html
<script>window.VISIONARY_ANALYTICS_ENDPOINT='https://YOUR-PROJECT.supabase.co/functions/v1/ingest-event';</script>
```
The endpoint is a public ingestion API, not a secret. Update the placeholder with the actual project ref. The current website adapters are dormant until this setting exists.

For specific events, invoke `window.visionaryTrack?.('quiz_completed')` or `window.visionaryTrack?.('note_saved')` at the corresponding successful action. The initial installation only calls `page_view`.

## 4. Dashboard
Open the GitHub Pages dashboard and use the Supabase connection form. Enter only the **public** project URL, publishable/anon key, and administrator credentials. It requests aggregate event counts through the protected function.

## Limitations and hardening
- Page views are event counts, **not unique visitors or currently active users**.
- This initial ingest endpoint validates origin and event names, but browser Origin headers are not proof of identity. Before high-traffic production use, add rate limiting and bot controls at the edge.
- Counts are limited to the most recent 10,000 rows in a 30-day window. Add a server-side aggregation query for scale.
- Avoid tracking raw note contents, answers, student identities or personal activity trails.
- GitHub Pages is public; protect the backend as implemented and never expose secrets in frontend code.
