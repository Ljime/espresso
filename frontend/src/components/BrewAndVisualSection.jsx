import { SHOT_COLOURS, CREMA_COLOURS } from '../data/sca.js';

export default function BrewAndVisualSection({ shot, onChange }) {
  function setActual(field, val) {
    const actuals = { ...shot.brew_actuals, [field]: val };
    if (actuals.dose_weight && actuals.shot_weight) {
      actuals.yield_ratio = (parseFloat(actuals.shot_weight) / parseFloat(actuals.dose_weight)).toFixed(2);
    }
    onChange({ ...shot, brew_actuals: actuals });
  }

  function set(field, val) {
    onChange({ ...shot, [field]: val });
  }

  // Dual swatch toggle: stores array of up to 2 hex values
  function toggleSwatch(field, hex) {
    const current = shot[field] || [];
    const arr = Array.isArray(current) ? current : [current].filter(Boolean);
    if (arr.includes(hex)) {
      set(field, arr.filter(h => h !== hex));
    } else if (arr.length < 2) {
      set(field, [...arr, hex]);
    } else {
      // Replace the oldest (first) selection
      set(field, [arr[1], hex]);
    }
  }

  const yr = shot.brew_actuals?.yield_ratio;

  return (
    <>
      {/* Section 03: Brew Actuals */}
      <div className="section">
        <h2 className="section-title">03 — Brew Actuals</h2>
        <div className="field-grid">
          <Field label="Dose (g)">
            <input type="number" step="0.1" value={shot.brew_actuals?.dose_weight || ''} onChange={e => setActual('dose_weight', e.target.value)} />
          </Field>
          <Field label="Grind Level">
            <input value={shot.brew_actuals?.grind_level || ''} onChange={e => setActual('grind_level', e.target.value)} />
          </Field>
          <Field label="Water Temp (°C)">
            <input type="number" value={shot.brew_actuals?.water_temp || ''} onChange={e => setActual('water_temp', e.target.value)} />
          </Field>
          <Field label="Pressure (bar)">
            <input type="number" step="0.5" value={shot.brew_actuals?.pressure || ''} onChange={e => setActual('pressure', e.target.value)} />
          </Field>
          <Field label="Pull Time (s)">
            <input type="number" value={shot.brew_actuals?.pull_time || ''} onChange={e => setActual('pull_time', e.target.value)} />
          </Field>
          <Field label="Shot Weight (g)">
            <input type="number" step="0.1" value={shot.brew_actuals?.shot_weight || ''} onChange={e => setActual('shot_weight', e.target.value)} />
          </Field>
        </div>
        {yr && (
          <div className="yield-badge">Yield ratio: <strong>{yr}:1</strong></div>
        )}
      </div>

      {/* Section 04: Visual Inspection */}
      <div className="section">
        <h2 className="section-title">04 — Visual Inspection</h2>
        <p className="section-help">Select up to two swatches per colour to capture blended tones.</p>

        <div className="visual-row">
          <div className="visual-col">
            <label className="field-label">Crema Colour</label>
            <SwatchPicker
              swatches={CREMA_COLOURS}
              selected={shot.crema_colour}
              onToggle={hex => toggleSwatch('crema_colour', hex)}
            />
          </div>
          <div className="visual-col">
            <label className="field-label">Shot Colour</label>
            <SwatchPicker
              swatches={SHOT_COLOURS}
              selected={shot.shot_colour}
              onToggle={hex => toggleSwatch('shot_colour', hex)}
            />
          </div>
        </div>

        <div className="field-grid">
          <SliderField label="Crema Thickness" min={1} max={5} value={shot.crema_thickness ?? 3}
            onChange={v => set('crema_thickness', v)} leftLabel="Thin" rightLabel="Thick" />
          <SliderField label="Crema Persistence" min={1} max={5} value={shot.crema_persistence ?? 3}
            onChange={v => set('crema_persistence', v)} leftLabel="Fades fast" rightLabel="Persistent" />
          <Field label="Tiger Striping">
            <label className="toggle">
              <input type="checkbox" checked={!!shot.crema_tiger_striping}
                onChange={e => set('crema_tiger_striping', e.target.checked)} />
              <span className="toggle-label">Present</span>
            </label>
          </Field>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

// Dual-select swatch picker with Prismacolor numbers
function SwatchPicker({ swatches, selected, onToggle }) {
  const selectedArr = Array.isArray(selected) ? selected : [selected].filter(Boolean);

  return (
    <div className="swatch-row">
      {swatches.map((s, i) => {
        const selIdx = selectedArr.indexOf(s.hex);
        const isSelected = selIdx >= 0;
        const selOrder = isSelected ? selIdx + 1 : null; // 1 or 2
        const isLight = s.hex === '#FFF44F' || s.hex === '#FFDF00' || s.hex === '#FFA500';
        return (
          <button
            key={s.hex}
            className={`swatch-tile ${isSelected ? 'swatch-tile--selected' : ''}`}
            onClick={() => onToggle(s.hex)}
            title={`${s.name} (PC ${s.no})`}
            aria-label={s.name}
          >
            <span
              className="swatch-color"
              style={{
                background: s.hex,
                border: isLight ? '1px solid #ccc' : undefined,
              }}
            >
              {selOrder && <span className="swatch-order">{selOrder}</span>}
            </span>
            <span className="swatch-no">{s.no}</span>
          </button>
        );
      })}
    </div>
  );
}

function SliderField({ label, min, max, value, onChange, leftLabel, rightLabel }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="slider-row">
        <span className="slider-edge">{leftLabel}</span>
        <input type="range" min={min} max={max} step={1} value={value}
          onChange={e => onChange(Number(e.target.value))} className="range-input" />
        <span className="slider-edge">{rightLabel}</span>
        <span className="slider-val">{value}</span>
      </div>
    </div>
  );
}
