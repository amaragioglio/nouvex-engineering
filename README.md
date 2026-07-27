# Nouvex Engineering

Static B2B website for laboratory and cleanroom equipment, materials analysis, CAD and prototype design, and engineering consulting.

The site uses plain HTML, CSS, and JavaScript with no build step. Vercel serves the public site and `/api/leads` stores inquiries in Supabase before sending an email notification through Resend.

## Local demo

```powershell
node dev-server.js
```

Open `http://127.0.0.1:4174/`. Local submissions remain in memory and are visible at `http://127.0.0.1:4174/api/leads`.

## Third-party photographs

Licensing and source links for stock photography live in `assets/PHOTO_CREDITS.md`. Stock photographs provide general context and do not depict Nouvex facilities, employees, products, or completed projects.
