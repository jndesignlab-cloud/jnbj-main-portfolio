# Jann Jaravata Portfolio — v1.17.0

## Supabase Project Migration

This release migrates the public project archive from the legacy Apps Script project feed to the shared DesignLab Supabase project database.

### Key changes
- homepage selected projects load from Supabase
- Projects archive loads from Supabase
- individual project pages load directly from Supabase by project ID
- only `Published` projects with `show_on_personal_portfolio = true` are shown
- project data remains shared with DesignLab Creative Studio — no duplicate project entry required
- existing visitor/contact Apps Script workflows are retained

Domain: `jannjaravata.madebydesignlab.com`
