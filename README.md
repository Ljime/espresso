# Espresso Tasting App — MVP

A structured espresso tasting tool built to your UXIS spec. Records shots against persistent
profiles, saves everything as JSON for later AI analysis.

---

## Quick Start

You'll need two terminals.

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start the backend (Terminal 1)

```bash
cd backend
npm run dev        # uses node --watch for auto-reload
```

Backend runs at **http://localhost:3001**  
Data persists to `backend/data/db.json`

### 3. Start the frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend runs at **http://localhost:5173**  
API calls proxy to the backend automatically (configured in `vite.config.js`).

---

## Project Structure

```
espresso-app/
├── backend/
│   ├── server.js          # Express API
│   ├── data/
│   │   └── db.json        # JSON file store (auto-created)
│   └── package.json
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx                        # Top-level orchestration
        ├── api.js                         # API client
        ├── styles.css
        ├── data/
        │   ├── sca.js                     # SCA wheel descriptors + swatches
        │   └── defaults.js                # Empty shot/profile factories
        └── components/
            ├── ProfileSection.jsx         # Section 01 — Bean identity
            ├── BrewAndVisualSection.jsx   # Sections 02–03 — Brew + visual
            ├── SensorySection.jsx         # Sections 04–07 — Fragrance/Aroma/Flavour/Finish
            ├── DescriptorSelector.jsx     # L1→L2→L3 SCA picker + intensity
            ├── FinishingSection.jsx       # Sections 08–10 — Mouthfeel/Notes/Hedonic
            └── ShotHistory.jsx            # Past shots drawer
```

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/profiles` | List all profiles (summary) |
| POST | `/api/profiles` | Create a new profile |
| GET | `/api/profiles/:id` | Get full profile |
| PUT | `/api/profiles/:id` | Update profile |
| GET | `/api/shots` | List all shots (summary + final_notes) |
| GET | `/api/shots?profile_id=X` | Shots for a specific profile |
| POST | `/api/shots` | Save a new shot |
| GET | `/api/shots/:id` | Get full shot |

All data is stored in `backend/data/db.json` — a single JSON file you can hand directly
to an AI assistant for analysis.

---

## Workflow (matches UXIS)

1. **Load or create a Profile** — bean identity, roast info, blend components, brew defaults
2. **Save Profile** — persists it, auto-fills brew actuals for this session
3. **Fill brew actuals** — override defaults as needed; yield ratio auto-calculates
4. **Visual inspection** — crema/shot colour swatches, thickness, persistence sliders
5. **Fragrance → Aroma → Flavour → Finish** — SCA L1→L2→L3 picker + intensity + notes
6. **Mouthfeel** — body, astringency, temperature sliders
7. **Final Notes** — ideas for next shot, overall synthesis
8. **Hedonic score** — 1–10
9. **Save Shot** — creates a new record linked to the profile

**Past Shots drawer** — click "Past Shots" in the header to see all shots,
read final notes, and load the associated profile.

---

## Data for AI Analysis

The full db.json is structured for easy AI analysis:

```bash
# Example: hand this to Claude or GPT
cat backend/data/db.json | pbcopy   # macOS
cat backend/data/db.json | xclip    # Linux
```

Each shot contains:
- Full brew parameters + yield ratio
- All SCA descriptors with intensity + chronological timestamp
- Personal notes per lens
- Mouthfeel sliders
- Final notes (your ideas for next shot)
- Hedonic score

---

## Phase 2 Roadmap (from UXIS)

- [ ] SCA wheel visualization (D3 radial, colour-coded by lens)
- [ ] Shot comparison view
- [ ] Blend component profile linking (currently free text)
- [ ] Pattern detection across shots
- [ ] AI-suggested descriptors
- [ ] Hedonic correlation graphs
- [ ] Export to CSV / Markdown

---

## Notes

- **No database required** — db.json is the store. Swap in SQLite or Postgres later by
  replacing the `readDB`/`writeDB` helpers in `server.js`.
- **Responsive** — works on mobile; the form stacks vertically and the drawer is full-width.
- **SCA descriptors** — original hierarchical rendering of the SCA Flavor Wheel categories;
  not a reproduction of the copyrighted artwork.
