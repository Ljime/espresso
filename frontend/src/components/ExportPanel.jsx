import { useState } from 'react';
import { api } from '../api.js';

const SCOPES = [
  { id: 'last10',     label: 'Last 10 shots' },
  { id: 'last20',     label: 'Last 20 shots' },
  { id: 'profile',    label: 'All shots for a profile' },
  { id: 'daterange',  label: 'Shots in date range' },
  { id: 'all',        label: 'All shots' },
];

export default function ExportPanel({ profiles, currentProfileId, onClose }) {
  const [scope, setScope] = useState('last10');
  const [format, setFormat] = useState('json');
  const [profileId, setProfileId] = useState(currentProfileId || '');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleExport() {
    if (scope === 'profile' && !profileId) { setError('Select a profile'); return; }
    if (scope === 'daterange' && (!dateFrom || !dateTo)) { setError('Select start and end date'); return; }
    setError('');
    setLoading(true);
    try {
      const params = new URLSearchParams({ scope, format });
      if (scope === 'profile') params.set('profile_id', profileId);
      if (scope === 'daterange') { params.set('date_from', dateFrom); params.set('date_to', dateTo); }

      const res = await fetch(`${api.base}/export?${params}`);
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `tasting-data-${date}.${format}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="export-panel">
      <div className="export-header">
        <span className="export-title">Export Shot Data</span>
        <button className="btn-icon" onClick={onClose}>×</button>
      </div>

      <div className="export-body">
        <div className="export-group">
          <div className="export-group-label">Scope</div>
          {SCOPES.map(s => (
            <label key={s.id} className="export-radio">
              <input type="radio" name="scope" value={s.id}
                checked={scope === s.id} onChange={() => setScope(s.id)} />
              {s.label}
            </label>
          ))}
        </div>

        {scope === 'profile' && (
          <div className="export-sub">
            <select value={profileId} onChange={e => setProfileId(e.target.value)} className="export-select">
              <option value="">— Select profile —</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.roaster ? `${p.roaster} — ` : ''}{p.name || p.origin || 'Unnamed'}
                </option>
              ))}
            </select>
          </div>
        )}

        {scope === 'daterange' && (
          <div className="export-sub export-dates">
            <div className="field">
              <label className="field-label">From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>
        )}

        <div className="export-group">
          <div className="export-group-label">Format</div>
          <label className="export-radio">
            <input type="radio" name="format" value="json"
              checked={format === 'json'} onChange={() => setFormat('json')} />
            JSON — full fidelity, for AI analysis
          </label>
          <label className="export-radio">
            <input type="radio" name="format" value="tsv"
              checked={format === 'tsv'} onChange={() => setFormat('tsv')} />
            TSV — one row per shot, for Excel / Sheets
          </label>
        </div>

        {error && <div className="export-error">{error}</div>}

        <button className="btn-primary export-btn" onClick={handleExport} disabled={loading}>
          {loading ? 'Exporting…' : 'Download Export'}
        </button>
      </div>
    </div>
  );
}
