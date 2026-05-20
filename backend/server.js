import express from 'express';
import cors from 'cors';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import pg from 'pg';
import { randomUUID } from 'crypto';
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3001;

// ── DB Pool ──────────────────────────────────────────────────────────────────
// Set DATABASE_URL in your environment / Render dashboard
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:coolbeansespresso1!@db.coizzoagbainviqfkqfi.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
  family: 4
});

// ── Schema bootstrap ─────────────────────────────────────────────────────────
// Runs once on startup — safe to re-run (IF NOT EXISTS)
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id          TEXT PRIMARY KEY,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data        JSONB NOT NULL
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shots (
      id          TEXT PRIMARY KEY,
      profile_id  TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data        JSONB NOT NULL
    );
  `);
  console.log('DB ready');
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://coolbeansespresso.netlify.app/' || '*',
}));
app.use(express.json());

// ── Profiles ─────────────────────────────────────────────────────────────────

// GET /api/profiles — list summaries
app.get('/api/profiles', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, created_at,
              data->>'name'        AS name,
              data->>'roaster'     AS roaster,
              data->>'origin'      AS origin,
              data->>'roast_date'  AS roast_date,
              data->>'roast_level' AS roast_level
       FROM profiles
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/profiles — create
app.post('/api/profiles', async (req, res) => {
  try {
    const id = randomUUID();
    const profile = { id, created_at: new Date().toISOString(), ...req.body };
    await pool.query(
      'INSERT INTO profiles (id, data) VALUES ($1, $2)',
      [id, profile]
    );
    res.status(201).json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/profiles/:id — full profile
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT data FROM profiles WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Profile not found' });
    res.json(rows[0].data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/profiles/:id — update
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT data FROM profiles WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Profile not found' });
    const updated = { ...rows[0].data, ...req.body, id: req.params.id };
    await pool.query(
      'UPDATE profiles SET data = $1 WHERE id = $2',
      [updated, req.params.id]
    );
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ── Shots ────────────────────────────────────────────────────────────────────

// GET /api/shots — summary list, optional ?profile_id= filter
app.get('/api/shots', async (req, res) => {
  try {
    const filter = req.query.profile_id;
    const { rows } = await pool.query(
      `SELECT id, profile_id, created_at,
              data->'brew_actuals'   AS brew_actuals,
              data->>'hedonic_score' AS hedonic_score,
              data->>'final_notes'   AS final_notes,
              data->>'fragrance_notes' AS fragrance_notes,
              data->>'aroma_notes'     AS aroma_notes,
              data->>'flavour_notes'   AS flavour_notes,
              data->>'finish_notes'    AS finish_notes
       FROM shots
       ${filter ? 'WHERE profile_id = $1' : ''}
       ORDER BY created_at DESC`,
      filter ? [filter] : []
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/shots — save new shot
app.post('/api/shots', async (req, res) => {
  try {
    const actuals = req.body.brew_actuals || {};
    if (actuals.dose_weight && actuals.shot_weight) {
      actuals.yield_ratio = parseFloat(
        (actuals.shot_weight / actuals.dose_weight).toFixed(2)
      );
    }
    const id = randomUUID();
    const shot = {
      id,
      created_at: new Date().toISOString(),
      ...req.body,
      brew_actuals: actuals,
    };
    await pool.query(
      'INSERT INTO shots (id, profile_id, data) VALUES ($1, $2, $3)',
      [id, shot.profile_id, shot]
    );
    res.status(201).json(shot);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shots/:id — full shot
app.get('/api/shots/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT data FROM shots WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Shot not found' });
    res.json(rows[0].data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', async (_, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (e) {
    res.status(500).json({ status: 'error', db: e.message });
  }
});

// ── Start ────────────────────────────────────────────────────────────────────
initDB()
  .then(() => app.listen(PORT, () => console.log(`Espresso API on http://localhost:${PORT}`)))
  .catch(e => { console.error('DB init failed:', e); process.exit(1); });
