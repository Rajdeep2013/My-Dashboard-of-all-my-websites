# Visionary Analytics Dashboard

Phase 1 dashboard shell for **Visionary Study** and **Notes Files**. Visionary Entrepreneurs is reserved for Phase 2.

## Status
The dashboard UI is implemented, but tracking is **not yet connected**. All missing metrics display a dash rather than fabricated values.

## Next steps
1. Identify the source repositories and deployment URLs for Visionary Study and Notes Files.
2. Select a secure backend (for example, Supabase) and configure its credentials via deployment secrets, never committed files.
3. Instrument privacy-preserving aggregate events: page_view, study_session_started, quiz_completed, note_created, note_saved.
4. Build authenticated aggregate analytics endpoints. Enforce server-side authorization and rate limits.
5. Connect dashboard components to these endpoints and validate event counts.
6. Enable GitHub Pages in Settings → Pages, deploying from main/root.

## Privacy
Avoid collecting note bodies, raw study answers, personally identifying student data, or user-level activity histories. Publish only the shell until authenticated access is ready.
