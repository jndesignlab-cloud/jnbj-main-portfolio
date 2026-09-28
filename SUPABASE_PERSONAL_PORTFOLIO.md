# Personal Portfolio — Supabase Project Migration

Version: 1.17.0

## What changed

The personal portfolio at `jannjaravata.madebydesignlab.com` now reads its project archive directly from the same Supabase `projects` table used by DesignLab Creative Studio.

Public project queries require:
- `status = Published`
- `show_on_personal_portfolio = true`

This means there is no second project database to maintain.

## Publishing workflow

Continue adding/editing projects through the DesignLab Supabase project admin. Enable **Show on Personal Portfolio** for any project that should also appear on Jann's personal site.

## Supabase configuration

The personal front end uses the browser-safe Supabase publishable key in `config.js` and relies on the existing Row Level Security policies for public reads.

## What remains on Apps Script

The personal visitor counter and contact workflow remain connected to the existing Apps Script endpoint. This matches the current DesignLab architecture, where project data is in Supabase while non-project workflows can remain on Apps Script.
