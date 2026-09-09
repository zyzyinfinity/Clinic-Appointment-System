const fs = require('fs');
const path = require('path');
const db = require('./db');

// Runs the schema on startup so a fresh database (e.g. a brand-new Railway
// MySQL plugin) is ready with no manual import. Safe to run on every boot:
// every table uses CREATE TABLE IF NOT EXISTS, and the doctor seed only runs
// when the table is empty.
async function initDb() {
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    const raw = fs.readFileSync(schemaPath, 'utf8');

    // mysql2 runs one statement per query() call, so split the file. Strip
    // `--` comment lines first; this schema has no semicolons inside strings.
    const statements = raw
        .replace(/^\s*--.*$/gm, '')
        .split(';')
        .map(s => s.trim())
        .filter(Boolean);

    for (const statement of statements) {
        // The doctor seed is handled separately below (see note above).
        if (/^INSERT\s+INTO\s+doctors/i.test(statement)) continue;
        await db.query(statement);
    }

    const [rows] = await db.query('SELECT COUNT(*) AS count FROM doctors');
    if (rows[0].count === 0) {
        await db.query(
            `INSERT INTO doctors (name, specialization, available_days, available_time) VALUES
            ('Dr. Alice Smith', 'Cardiologist', 'Mon, Wed, Fri', '09:00 - 13:00'),
            ('Dr. Bob Jones', 'Dermatologist', 'Tue, Thu', '10:00 - 16:00'),
            ('Dr. Charlie Brown', 'General Practitioner', 'Mon-Fri', '08:00 - 17:00'),
            ('Dr. Diana Prince', 'Pediatrician', 'Mon, Wed, Fri', '14:00 - 18:00')`
        );
        console.log('Seeded doctors table.');
    }

    console.log('Database schema is ready.');
}

module.exports = initDb;
