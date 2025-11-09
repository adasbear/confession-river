# Confession River – Project Brief (MVP)
## Elevator Pitch
An anonymous, text-only confession site that feels like a dark-anime Telegram channel.  
No login, no profiles, no images—just write, read, scroll.

## Core Flow
1. Landing → tap “Join” → ghost cookie set → redirect /feed#bottom  
2. Feed shows **approved** confessions, newest at bottom.  
   - Infinite scroll by “Load older” button (no auto-fetch).  
   - Card: #number, full text, likes + comment icons + counts, timestamp.  
3. Floating “+” → bottom-sheet to write confession (unlimited chars).  
4. Submit → stored `approved=false` → toast “Sent for review”.  
5. Mod page (password-protected) → approve / reject.

## Tech Choices
- Next.js 15 App Router (server components by default).  
- Tailwind CSS, colours: black #000, blood-red #DC2626, gold #FFD700.  
- Drizzle ORM + Turso SQLite (serverless).  
- No client-side state management; URL + server state only.

## Schema
confession:  
  id, body, approved, createdAt  
like:  
  confessionId, userId (composite PK)  
comment:  
  id, confessionId, userId, body, createdAt  
ghostUser:  
  id, createdAt (no email, no password)

## Ghost User Rules
- Cookie `ghost` = nanoid(12), 10 y expiry, http-only, same-site strict.  
- Fallback localStorage; if both lost → new user (by design).  
- Rate-limit: 5 unapproved posts per 24 h.

## Pages & Components
- `/` – Landing (static)  
- `/feed` – server component, fetches approved confessions asc by createdAt, scroll-to-bottom on load.  
- `/api/confess` – POST, insert unapproved, return {ok}.  
- `/mod` – basic-auth password, list unapproved, 1-click approve/reject.

## Design Assets
- Designs folder exported from Stitch:  
  landingpagecode.html, feedpagecode.html, newpostcode.html  
  colours, spacing, card style must match exactly.

## Out of Scope (post-MVP)
Images, follower system, push notifications, reporting, search, ads.

## Success Metric
Ship &lt; 48 h, &lt; 200 USD / yr running cost, zero database admin.