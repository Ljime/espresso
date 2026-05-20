import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── JSON File Store ─────────────────────────────────────────────────────────
const DB_PATH = join(__dirname, 'data', 'db.json');

function readDB() {
  if (!existsSync(DB_PATH)) {
    const empty = { profiles: [], shots: [] };
    writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── Profiles ────────────────────────────────────────────────────────────────

// GET /api/profiles — list all profiles (id, name, roaster, origin only)
app.get('/api/profiles', (req, res) => {
  const db = readDB();
  const summaries = db.profiles.map(({ id, name, roaster, origin, roast_date, roast_level }) => ({
    id, name, roaster, origin, roast_date, roast_level
  }));
  res.json(summaries);
});

// POST /api/profiles — create a new profile
app.post('/api/profiles', (req, res) => {
  const db = readDB();
  const profile = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...req.body,
  };
  db.profiles.push(profile);
  writeDB(db);
  res.status(201).json(profile);
});

// GET /api/profiles/:id — load full profile
app.get('/api/profiles/:id', (req, res) => {
  const db = readDB();
  const profile = db.profiles.find(p => p.id === req.params.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile);
});

// PUT /api/profiles/:id — update profile
app.put('/api/profiles/:id', (req, res) => {
  const db = readDB();
  const idx = db.profiles.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Profile not found' });
  db.profiles[idx] = { ...db.profiles[idx], ...req.body, id: req.params.id };
  writeDB(db);
  res.json(db.profiles[idx]);
});

// ── Shots ───────────────────────────────────────────────────────────────────

// GET /api/shots — list all shots (summary view), optional ?profile_id= filter
app.get('/api/shots', (req, res) => {
  const db = readDB();
  let shots = db.shots;
  if (req.query.profile_id) {
    shots = shots.filter(s => s.profile_id === req.query.profile_id);
  }
  // Return summary: no heavy descriptor arrays, just key fields + final_notes
  const summaries = shots.map(({
    id, profile_id, created_at, hedonic_score, final_notes,
    brew_actuals, fragrance_notes, aroma_notes, flavour_notes, finish_notes
  }) => ({
    id, profile_id, created_at, hedonic_score, final_notes,
    brew_actuals, fragrance_notes, aroma_notes, flavour_notes, finish_notes
  }));
  res.json(summaries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

// POST /api/shots — save a new shot
app.post('/api/shots', (req, res) => {
  const db = readDB();
  // Auto-calculate yield ratio
  const actuals = req.body.brew_actuals || {};
  if (actuals.dose_weight && actuals.shot_weight) {
    actuals.yield_ratio = parseFloat(
      (actuals.shot_weight / actuals.dose_weight).toFixed(2)
    );
  }
  const shot = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...req.body,
    brew_actuals: actuals,
  };
  db.shots.push(shot);
  writeDB(db);
  res.status(201).json(shot);
});

// GET /api/shots/:id — load full shot (profile section only, per spec)
app.get('/api/shots/:id', (req, res) => {
  const db = readDB();
  const shot = db.shots.find(s => s.id === req.params.id);
  if (!shot) return res.status(404).json({ error: 'Shot not found' });
  // Return full shot — client decides what to display
  res.json(shot);
});

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Espresso API running on http://localhost:${PORT}`);
});
