// Local dev / any host that runs this as one long-lived process
// (Railway, Render, your own machine). Vercel does NOT use this file — it
// calls backend/app.js directly through api/[...all].js instead, since
// serverless functions don't keep a process alive to listen() on.
const app = require('./app');
const initDb = require('./config/initDb');

const PORT = process.env.PORT || 3000;

// Ensure the schema exists (safe to run every boot), then start listening.
// If init fails we still start, so the logs are reachable and the next
// deploy can retry.
initDb()
    .catch((err) => console.error('Database init failed:', err.message))
    .finally(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
