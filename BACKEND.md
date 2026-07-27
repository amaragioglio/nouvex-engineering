# Lead capture backend

The guided inquiry submits qualified B2B requests to `POST /api/leads`. The endpoint stores the inquiry in Supabase and sends an ordered HTML notification, with a plain-text fallback, to `info@nouvexeng.com` through Resend.

Storage and email delivery are independent. If either service is temporarily unavailable, the other is still attempted. The endpoint only rejects the inquiry when both operations fail.

## Setup

1. Create a Supabase project and run `supabase/schema.sql` in the Supabase SQL Editor.
2. Create a Resend account, verify `nouvexeng.com`, and create an API key.
3. Add the variables from `.env.example` to the Vercel project settings for Production, Preview, and Development as needed.
4. Deploy the project to Vercel and submit a complete guided inquiry.
5. Confirm the row appears in `public.project_leads`, `notification_status` is `sent`, and the ordered notification reaches `info@nouvexeng.com`.

The Supabase secret and Resend API key are server-only. Do not add their real values to `.env.example`, `index.html`, or Git.

## Local demo without services

Run `node dev-server.js`, then open `http://127.0.0.1:4174/#inquiry`. Complete the guided inquiry and submit it. The demo keeps up to 50 test inquiries in memory at `http://127.0.0.1:4174/api/leads`; restarting the server clears them.

Demo mode only activates for loopback requests and never contacts Supabase or Resend.

## Frontend contract

The canonical request fields, response fields, ownership boundary, and task-specific reading routes live in `GRAPH.md`. Update that file whenever the public contract changes.
