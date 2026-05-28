import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { randomUUID } from 'crypto';

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
  origin: ['https://coolbeansespresso.netlify.app', 'http://localhost:5173', process.env.FRONTEND_URL]
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
  .then(() => initColoursTable())
  .then(() => app.listen(PORT, () => console.log(`Espresso API on http://localhost:${PORT}`)))
  .catch(e => { console.error('DB init failed:', e); process.exit(1); });

// ── Custom Colours ────────────────────────────────────────────────────────────
async function initColoursTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_colours (
      id         TEXT PRIMARY KEY,
      list       TEXT NOT NULL CHECK (list IN ('shot', 'crema')),
      no         TEXT NOT NULL,
      name       TEXT NOT NULL,
      hex        TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ,
      UNIQUE(list, no)
    );
  `);
}

// GET /api/colours — all active custom colours
app.get('/api/colours', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, list, no, name, hex, created_at
       FROM custom_colours WHERE deleted_at IS NULL ORDER BY created_at ASC`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/colours — add a custom colour
app.post('/api/colours', async (req, res) => {
  const { list, no, name, hex } = req.body;
  if (!['shot','crema'].includes(list)) return res.status(400).json({ error: 'list must be shot or crema' });
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return res.status(400).json({ error: 'Invalid hex value' });
  try {
    const id = randomUUID();
    const { rows } = await pool.query(
      `INSERT INTO custom_colours (id, list, no, name, hex)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, list, no, name, hex, created_at`,
      [id, list, no.trim(), name.trim(), hex.toUpperCase()]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: `PC ${no} already exists in ${list} list` });
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/colours/:list/:hex — soft-delete (preserves export history)
app.delete('/api/colours/:list/:hex', async (req, res) => {
  const hex = decodeURIComponent(req.params.hex);
  try {
    await pool.query(
      `UPDATE custom_colours SET deleted_at = NOW()
       WHERE list = $1 AND hex = $2 AND deleted_at IS NULL`,
      [req.params.list, hex]
    );
    res.json({ deleted: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Export ────────────────────────────────────────────────────────────────────
app.get('/api/export', async (req, res) => {
  const { scope, format, profile_id, date_from, date_to } = req.query;

  try {
    let shotRows, profileIds;

    if (scope === 'last10' || scope === 'last20') {
      const limit = scope === 'last10' ? 10 : 20;
      const r = await pool.query(`SELECT data FROM shots ORDER BY created_at DESC LIMIT $1`, [limit]);
      shotRows = r.rows.map(r => r.data);
    } else if (scope === 'profile') {
      const r = await pool.query(`SELECT data FROM shots WHERE profile_id = $1 ORDER BY created_at DESC`, [profile_id]);
      shotRows = r.rows.map(r => r.data);
    } else if (scope === 'daterange') {
      const r = await pool.query(
        `SELECT data FROM shots WHERE created_at >= $1 AND created_at <= $2::date + interval '1 day' ORDER BY created_at DESC`,
        [date_from, date_to]
      );
      shotRows = r.rows.map(r => r.data);
    } else { // all
      const r = await pool.query(`SELECT data FROM shots ORDER BY created_at DESC`);
      shotRows = r.rows.map(r => r.data);
    }

    // Collect referenced profile IDs (including component profiles)
    profileIds = new Set(shotRows.map(s => s.profile_id).filter(Boolean));
    if (scope === 'profile' && profile_id) profileIds.add(profile_id);

    // Fetch profiles
    let profileRows = [];
    if (profileIds.size > 0) {
      const ids = [...profileIds];
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      const pr = await pool.query(`SELECT data FROM profiles WHERE id IN (${placeholders})`, ids);
      profileRows = pr.rows.map(r => r.data);

      // Also fetch any component profiles (one level deep)
      const componentIds = new Set();
      for (const p of profileRows) {
        for (const c of (p.components || [])) {
          if (c.component_profile_id && !profileIds.has(c.component_profile_id)) {
            componentIds.add(c.component_profile_id);
          }
        }
      }
      if (componentIds.size > 0) {
        const cids = [...componentIds];
        const cp = ids.map((_, i) => `$${i + 1}`).join(',');
        const cr = await pool.query(`SELECT data FROM profiles WHERE id IN (${cids.map((_, i) => `$${i+1}`).join(',')})`, cids);
        profileRows.push(...cr.rows.map(r => r.data));
      }
    }

    // Fetch custom colours for export (include deleted ones for full fidelity)
    const colourRes = await pool.query(`SELECT list, no, name, hex FROM custom_colours ORDER BY created_at ASC`);
    const customColours = colourRes.rows;

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    if (format === 'tsv') {
      // TSV: one row per shot, profile fields repeated
      const headers = [
        'shot_id','shot_date','profile_id','profile_name','roaster','origin','process',
        'roast_date','roast_level','variety','elevation',
        'dose_weight','grind_level','water_temp','pressure_max','pressure_min',
        'pull_time','shot_weight','yield_ratio',
        'crema_colour','shot_colour','crema_thickness','crema_persistence','crema_tiger_striping',
        'fragrance_descriptors','fragrance_notes',
        'aroma_descriptors','aroma_notes',
        'flavour_descriptors','flavour_notes',
        'finish_descriptors','finish_notes',
        'mouthfeel_weight','mouthfeel_astringency','mouthfeel_temperature','mouthfeel_texture',
        'final_notes','hedonic_score'
      ];

      const profileMap = Object.fromEntries(profileRows.map(p => [p.id, p]));

      const tsvRows = shotRows.map(s => {
        const p = profileMap[s.profile_id] || {};
        const ba = s.brew_actuals || {};
        const mf = s.mouthfeel || {};
        const fmtDescriptors = arr => (arr || []).map(d => `${d.label}(${d.intensity})`).join('; ');
        const fmtColour = c => Array.isArray(c) ? c.join('+') : (c || '');
        return [
          s.id, s.created_at, s.profile_id, p.name||'', p.roaster||'', p.origin||'', p.process||'',
          p.roast_date||'', p.roast_level||'', p.variety||'', p.elevation||'',
          ba.dose_weight||'', ba.grind_level||'', ba.water_temp||'', ba.pressure_max||'', ba.pressure_min||'',
          ba.pull_time||'', ba.shot_weight||'', ba.yield_ratio||'',
          fmtColour(s.crema_colour), fmtColour(s.shot_colour),
          s.crema_thickness||'', s.crema_persistence||'', s.crema_tiger_striping ? 'yes' : 'no',
          fmtDescriptors(s.fragrance_descriptors), s.fragrance_notes||'',
          fmtDescriptors(s.aroma_descriptors), s.aroma_notes||'',
          fmtDescriptors(s.flavour_descriptors), s.flavour_notes||'',
          fmtDescriptors(s.finish_descriptors), s.finish_notes||'',
          mf.weight||'', mf.astringency||'', mf.temperature||'', mf.texture||'',
          s.final_notes||'', s.hedonic_score||''
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join('\t');
      });

      const tsv = [headers.join('\t'), ...tsvRows].join('\n');
      res.setHeader('Content-Type', 'text/tab-separated-values');
      res.setHeader('Content-Disposition', `attachment; filename="tasting-data-${date}.tsv"`);
      return res.send(tsv);
    }

    // JSON
    const payload = { exported_at: new Date().toISOString(), profiles: profileRows, shots: shotRows, custom_colours: customColours };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="tasting-data-${date}.json"`);
    return res.send(JSON.stringify(payload, null, 2));

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});
