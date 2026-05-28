import { useState } from 'react';

export default function MoreColoursPanel({ list, curatedIds, onAdd, onDelete, onClose }) {
  const [no, setNo] = useState('');
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#');
  const [error, setError] = useState('');

  function validate() {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return 'Hex must be # followed by 6 characters (e.g. #CC7722)';
    if (!no.trim()) return 'Prismacolor number is required';
    if (!name.trim()) return 'Prismacolor name is required';
    if (list.some(s => s.no === no.trim())) return `PC ${no.trim()} already exists in this list`;
    return null;
  }

  function handleAdd() {
    const err = validate();
    if (err) { setError(err); return; }
    onAdd({ no: no.trim(), name: name.trim(), hex: hex.toUpperCase() });
    setNo(''); setName(''); setHex('#'); setError('');
  }

  const userAdded = list.filter(s => !curatedIds.has(s.hex));

  return (
    <div className="more-colours-panel">
      <div className="more-colours-header">
        <span className="more-colours-title">More Colours</span>
        <button className="btn-icon" onClick={onClose}>×</button>
      </div>

      <div className="more-colours-form">
        <input
          value={no} onChange={e => setNo(e.target.value)}
          placeholder="PC number (e.g. 943)"
          className="more-colours-input"
        />
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Name (e.g. Burnt Ochre)"
          className="more-colours-input"
        />
        <div className="more-colours-hex-row">
          <input
            value={hex} onChange={e => setHex(e.target.value)}
            placeholder="#CC7722"
            maxLength={7}
            className="more-colours-input hex-input"
          />
          {/^#[0-9A-Fa-f]{6}$/.test(hex) && (
            <span className="hex-preview" style={{ background: hex }} />
          )}
        </div>
        {error && <div className="more-colours-error">{error}</div>}
        <button className="btn-primary" onClick={handleAdd}>Add Colour</button>
      </div>

      {userAdded.length > 0 && (
        <div className="more-colours-list">
          <div className="more-colours-list-label">Your colours</div>
          {userAdded.map(s => (
            <div key={s.hex} className="more-colours-entry">
              <span className="mc-swatch" style={{ background: s.hex }} />
              <span className="mc-no">{s.no}</span>
              <span className="mc-name">{s.name}</span>
              <button className="btn-ghost mc-delete" onClick={() => onDelete(s.hex)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {userAdded.length === 0 && (
        <div className="more-colours-empty">No custom colours yet</div>
      )}
    </div>
  );
}
