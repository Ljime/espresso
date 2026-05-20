export default function FinishingSection({ shot, onChange }) {
  function setMouthfeel(field, val) {
    onChange({ ...shot, mouthfeel: { ...shot.mouthfeel, [field]: val } });
  }

  function set(field, val) {
    onChange({ ...shot, [field]: val });
  }

  const mf = shot.mouthfeel || {};

  return (
    <>
      {/* Mouthfeel */}
      <div className="section">
        <h2 className="section-title">08 — Mouthfeel</h2>
        <div className="field-grid">
          <SliderField label="Body Weight" min={1} max={10} value={mf.weight ?? 5}
            onChange={v => setMouthfeel('weight', v)} leftLabel="Thin" rightLabel="Heavy" />
          <SliderField label="Astringency" min={1} max={10} value={mf.astringency ?? 5}
            onChange={v => setMouthfeel('astringency', v)} leftLabel="Low" rightLabel="High" />
          <SliderField label="Temperature" min={1} max={10} value={mf.temperature ?? 5}
            onChange={v => setMouthfeel('temperature', v)} leftLabel="Cool" rightLabel="Hot" />
        </div>
        <div className="field">
          <label className="field-label">Texture Notes</label>
          <input value={mf.texture || ''} onChange={e => setMouthfeel('texture', e.target.value)}
            placeholder="e.g. silky, gritty, coating…" />
        </div>
      </div>

      {/* Final Notes */}
      <div className="section">
        <h2 className="section-title">09 — Final Notes</h2>
        <p className="section-help">Your synthesis — ideas for next shot, overall impression, adjustments to try.</p>
        <div className="field">
          <textarea
            value={shot.final_notes || ''}
            onChange={e => set('final_notes', e.target.value)}
            rows={5}
            placeholder="Overall impression, what to adjust next time…"
          />
        </div>
      </div>

      {/* Hedonic */}
      <div className="section">
        <h2 className="section-title">10 — Hedonic Score</h2>
        <div className="hedonic-row">
          <input
            type="range" min={1} max={10} step={0.5}
            value={shot.hedonic_score ?? 5}
            onChange={e => set('hedonic_score', Number(e.target.value))}
            className="range-input hedonic-range"
          />
          <span className="hedonic-val">{shot.hedonic_score ?? '—'}</span>
          <input
            type="number" min={1} max={10} step={0.5}
            value={shot.hedonic_score ?? ''}
            onChange={e => set('hedonic_score', Number(e.target.value))}
            className="hedonic-number"
          />
        </div>
        <div className="hedonic-labels">
          <span>1 — Unpleasant</span>
          <span>5 — OK</span>
          <span>10 — Exceptional</span>
        </div>
      </div>
    </>
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
