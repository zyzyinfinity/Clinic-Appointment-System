// Local dev / any host that runs this as one long-lived process
// (Railway, Render, your own machine). Vercel does NOT use this file — it
// calls backend/app.js directly through api/[...all].js instead, since
// serverless functions don't keep a process alive to listen() on.
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
