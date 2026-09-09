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

1. **Database** — start MySQL (XAMPP or raw), then import the schema.
   `schema.sql` no longer creates the database itself, so create it first:
   ```bash
   mysql -u root -e "CREATE DATABASE IF NOT EXISTS clinic_appointment_system"
   mysql -u root clinic_appointment_system < database/schema.sql
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

## Deploy (Vercel + Aiven MySQL)

Vercel doesn't host MySQL, so the database lives on a free host (Aiven) and
the Express API runs as a Vercel serverless function — see `api/[...all].js`
and `vercel.json`. `backend/server.js` (the `app.listen()` version) is only
used for local dev / a traditional host; Vercel calls `backend/app.js`
directly instead.

1. **Database** — create a free MySQL service at [aiven.io](https://aiven.io)
   (no card required). From its console, copy the host, port, user, password,
   default database name, and connect (Aiven gives you a ready `mysql`
   command) to load the schema:
   ```bash
   mysql --host <host> --port <port> -u <user> -p<pass> <db> --ssl-mode=REQUIRED < database/schema.sql
   ```
2. **Import to Vercel** — vercel.com → **Add New → Project** → import this
   repo. Framework preset **Other**; leave build/output blank.
3. Project → **Settings → Environment Variables**, add:
   ```
   DB_HOST=<Aiven host>
   DB_PORT=<Aiven port>
   DB_USER=<Aiven user>
   DB_PASSWORD=<Aiven password>
   DB_NAME=<Aiven database name>
   DB_SSL=true
   JWT_SECRET=<a long random string>
   ```
4. Deploy, open the `*.vercel.app` URL Vercel gives you, and try
   registering/logging in/booking.
5. **Settings → Domains** → add `clinic.ishzati.com` → point a Cloudflare
   `CNAME clinic → cname.vercel-dns.com` (DNS only) at it, same as any other
   Vercel project on this domain.

### Alternative: Railway (app + MySQL together)

Railway runs the Node app and MySQL in one project instead — no external DB
needed, but the app must run as a normal long-lived process there (it does,
via `npm start` / `backend/server.js`).

1. Push this repo to GitHub, then **New Project → Deploy from GitHub repo**.
2. **+ New → Database → MySQL**.
3. On the app service → **Variables**, add:
   ```
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   JWT_SECRET=<a long random string>
   ```
4. Import the schema into the MySQL plugin (Railway's **Data** tab → Query, or
   `mysql` against the plugin's public connection string):
   ```bash
   mysql -h <host> -P <port> -u <user> -p<pass> <db> < database/schema.sql
   ```
5. App service → **Settings → Networking → Generate Domain** to smoke-test, then
   add a **Custom Domain** (`clinic.ishzati.com`) and point a CNAME at the value
   Railway shows.

## REST API Overview
- `POST /api/auth/login` | Login user
- `POST /api/auth/register` | Register user
- `GET /api/doctors` | Review all doctors
- `GET /api/appointments` | Get logged in user's bookings (Protected)
- `POST /api/appointments` | Create new booking (Protected)
- `DELETE /api/appointments/:id` | Cancel/delete a booking (Protected)
- `POST /api/payments` | Mock pay an appointment (Protected)

Enjoy standard premium appointment administration!
