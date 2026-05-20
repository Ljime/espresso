import { SHOT_COLOURS, CREMA_COLOURS } from '../data/sca.js';

export default function BrewAndVisualSection({ shot, onChange }) {
  function setActual(field, val) {
    const actuals = { ...shot.brew_actuals, [field]: val };
    // Auto yield ratio
    if (actuals.dose_weight && actuals.shot_weight) {
      actuals.yield_ratio = (parseFloat(actuals.shot_weight) / parseFloat(actuals.dose_weight)).toFixed(2);
    }
    onChange({ ...shot, brew_actuals: actuals });
  }

  function set(field, val) {
    onChange({ ...shot, [field]: val });
  }

  function setMouthfeel(field, val) {
    onChange({ ...shot, mouthfeel: { ...shot.mouthfeel, [field]: val } });
  }

  const yr = shot.brew_actuals?.yield_ratio;

  return (
    <>
      {/* Section 2: Brew Actuals */}
      <div className="section">
        <h2 className="section-title">02 — Brew Actuals</h2>
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

      {/* Section 3: Visual Inspection */}
      <div className="section">
        <h2 className="section-title">03 — Visual Inspection</h2>

        <div className="visual-row">
          <div className="visual-col">
            <label className="field-label">Crema Colour</label>
            <SwatchPicker swatches={CREMA_COLOURS} selected={shot.crema_colour} onSelect={hex => set('crema_colour', hex)} />
          </div>
          <div className="visual-col">
            <label className="field-label">Shot Colour</label>
            <SwatchPicker swatches={SHOT_COLOURS} selected={shot.shot_colour} onSelect={hex => set('shot_colour', hex)} />
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

function SwatchPicker({ swatches, selected, onSelect }) {
  return (
    <div className="swatch-row">
      {swatches.map(s => (
        <button
          key={s.hex}
          className={`swatch ${selected === s.hex ? 'swatch--selected' : ''}`}
          style={{ background: s.hex, border: s.hex === '#FFF44F' || s.hex === '#FFDF00' ? '1px solid #ccc' : undefined }}
          title={s.name}
          onClick={() => onSelect(s.hex)}
          aria-label={s.name}
        />
      ))}
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
