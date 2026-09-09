# Clinic Appointment System

A full-stack web application demonstrating complete CRUD operations, user authentication, interactive maps (Leaflet + OpenStreetMap), and automated email confirmations (EmailJS).

## Project Architecture
- **Backend**: Node.js, Express.js (RESTful APIs)
- **Database**: MySQL (relational database tables, schema setup included)
- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript (Modern, Premium Aesthetic)

## Features Included
1. **User Authentication**: Secure registration and login flow using JWT (`bcryptjs` for hashing).
2. **Doctor Catalog**: Retrieve and display active doctors and schedules from the DB.
3. **Appointment Booking**: Logged in users can choose a doctor, date, and time.
4. **Email Confirmation**: Automatic email alerts dispatched upon booking to the user via `EmailJS`.
5. **Dashboard & History**: View past, confirmed, or cancelled appointments.
6. **Payment Sub-system**: Mock payment gateway that upgrades a "pending" appointment to "confirmed" and logs a "completed" transaction in the DB.
7. **Mapping Interface**: Dynamic display of the clinic's location via Leaflet API.

---

## Run locally

1. **Database** — start MySQL (XAMPP or raw) and create the empty database.
   The tables + demo doctors are created automatically on first `npm start`
   (`backend/config/initDb.js`), so no manual schema import is needed:
   ```bash
   mysql -u root -e "CREATE DATABASE IF NOT EXISTS clinic_appointment_system"
   ```

2. **Config** — copy `.env.example` to `.env` and adjust to your MySQL setup:
   ```bash
   cp .env.example .env
   ```

3. **Install + run** (from the project root, not `backend/`):
   ```bash
   npm install
   npm start
   ```
   Open http://localhost:3000 — Express serves the frontend and the API together.

> The EmailJS Service/Template/Public keys in `frontend/app.js` are client-side
> public keys and are safe to commit.

## Deploy (Railway + Cloudflare subdomain)

Railway runs the Node app **and** MySQL in one project — no external database.
The app runs as a normal long-lived process (`npm start` → `backend/server.js`),
and the schema is created automatically on first boot
(`backend/config/initDb.js`), so there is no manual SQL import step.

1. **Push to GitHub** — make sure `main` is up to date (`git push`).
2. **Create the project** — [railway.com](https://railway.com) → **New Project
   → Deploy from GitHub repo** → pick this repo. The first build will fail /
   crash-loop until the database and variables exist — that's expected.
3. **Add MySQL** — in the project: **+ New → Database → Add MySQL**.
4. **Set variables** — click the **app service** → **Variables** → **Raw
   editor**, paste:
   ```
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   JWT_SECRET=<paste a long random string>
   ```
   Railway redeploys; the logs should show `Seeded doctors table.` then
   `Server running on port …`.
5. **Get a test URL** — app service → **Settings → Networking → Public
   Networking → Generate Domain**. Open the `*.up.railway.app` URL and try
   registering / logging in / booking.
6. **Add the subdomain** — same **Settings → Networking** panel →
   **Custom Domain** → enter `clinic.ishzati.com`. Railway shows a target
   like `abc123.up.railway.app`.
7. **Point Cloudflare at it** — Cloudflare dashboard → your domain → **DNS →
   Records → Add record**:
   - Type `CNAME`, Name `clinic`, Target = the value Railway showed
   - **Proxy status: DNS only** (grey cloud) — Railway issues its own TLS
     cert; leave it grey until the domain shows **Active** in Railway, then
     you may switch to proxied (orange) if you want Cloudflare in front.

   SSL in Cloudflare should be **Full (strict)**. Propagation + cert issue
   is usually a few minutes.

### Alternative: Vercel + Aiven MySQL

Also wired up (`api/[...all].js`, `vercel.json`, `DB_SSL=true` in `db.js`) if
you ever want serverless instead: create a free MySQL at
[aiven.io](https://aiven.io), load `database/schema.sql` into it, import the
repo at vercel.com (preset **Other**), set `DB_*` + `DB_SSL=true` +
`JWT_SECRET` as environment variables, then **Settings → Domains** → add the
subdomain and point a Cloudflare `CNAME clinic → cname.vercel-dns.com`
(DNS only) at it.

## REST API Overview
- `POST /api/auth/login` | Login user
- `POST /api/auth/register` | Register user
- `GET /api/doctors` | Review all doctors
- `GET /api/appointments` | Get logged in user's bookings (Protected)
- `POST /api/appointments` | Create new booking (Protected)
- `DELETE /api/appointments/:id` | Cancel/delete a booking (Protected)
- `POST /api/payments` | Mock pay an appointment (Protected)

Enjoy standard premium appointment administration!
