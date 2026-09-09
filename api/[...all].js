// Vercel serverless entry point. This file's name (`[...all]`) is a
// catch-all — Vercel routes every request under /api/* here, and the
// Express app (backend/app.js) does its normal internal routing from
// there (/api/auth, /api/doctors, …). No .listen() — Vercel invokes this
// export as the request handler per invocation; the mysql2 pool inside
// backend/config/db.js is created once at module load and reused across
// warm invocations, same as any other require()'d module.
module.exports = require('../backend/app');
