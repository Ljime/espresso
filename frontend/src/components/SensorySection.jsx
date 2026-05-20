import DescriptorSelector from './DescriptorSelector.jsx';

const LENS_CONFIG = {
  fragrance: { number: '04', label: 'Fragrance', help: 'Dry grinds — before water contact' },
  aroma:     { number: '05', label: 'Aroma',     help: 'Wet grounds / rising steam' },
  flavour:   { number: '06', label: 'Flavour',   help: 'On the palate — first impression' },
  finish:    { number: '07', label: 'Finish',    help: 'Aftertaste — what lingers' },
};

export default function SensorySection({ lens, shot, onChange }) {
  const cfg = LENS_CONFIG[lens];
  const descriptorKey = `${lens}_descriptors`;
  const notesKey = `${lens}_notes`;

  return (
    <div className="section">
      <h2 className="section-title">{cfg.number} — {cfg.label}</h2>
      <p className="section-help">{cfg.help}</p>

      <DescriptorSelector
        lens={lens}
        descriptors={shot[descriptorKey] || []}
        onChange={val => onChange({ ...shot, [descriptorKey]: val })}
      />

      <div className="field" style={{ marginTop: '1rem' }}>
        <label className="field-label">Personal Notes</label>
        <textarea
          value={shot[notesKey] || ''}
          onChange={e => onChange({ ...shot, [notesKey]: e.target.value })}
          rows={3}
          placeholder={`Your ${cfg.label.toLowerCase()} impressions…`}
        />
      </div>
    </div>
  );
}
