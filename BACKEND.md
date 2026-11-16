# Lead capture backend

The inquiry form (name, company, work email, phone, optional message) submits to `POST /api/leads`. The endpoint validates the input and sends an HTML notification, with a plain-text fallback, to `info@nouvexeng.com` through Resend.

There is no database. The email is the only record of an inquiry, so if Resend fails the endpoint returns `503` and the form asks the visitor to retry or email `info@nouvexeng.com` directly.

## Setup

1. Create a Resend account, verify `nouvexeng.com` (SPF and DKIM records), and create an API key.
2. Add the variables from `.env.example` to the Vercel project settings for Production and Preview.
3. Deploy and submit the form; confirm the notification reaches `info@nouvexeng.com`.

The Resend API key is server-only. Do not add its real value to `.env.example`, `index.html`, or Git.

## Local demo without services

Run `node dev-server.js`, then open `http://127.0.0.1:4174/#inquiry`. The demo keeps up to 50 test inquiries in memory at `http://127.0.0.1:4174/api/leads`; restarting the server clears them.

Demo mode only activates for loopback requests and never contacts Resend.

## Frontend contract

The canonical request fields, response fields, and ownership boundary live in `GRAPH.md`. Update that file whenever the public contract changes.
