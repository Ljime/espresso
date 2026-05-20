import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function ShotHistory({ profileId, onLoadProfile, onClose }) {
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.listShots(profileId)
      .then(setShots)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profileId]);

  async function handleLoadProfile(shot) {
    try {
      const profile = await api.getProfile(shot.profile_id);
      onLoadProfile(profile, null);
      onClose();
    } catch (e) {
      alert('Could not load profile: ' + e.message);
    }
  }

  async function handleLoadFullShot(shot) {
    try {
      const [profile, fullShot] = await Promise.all([
        api.getProfile(shot.profile_id),
        api.getShot(shot.id),
      ]);
      onLoadProfile(profile, fullShot);
      onClose();
    } catch (e) {
      alert('Could not load shot: ' + e.message);
    }
  }

  return (
    <div className="shot-history">
      <div className="shot-history-header">
        <h3>Past Shots {profileId && <span className="muted">(this profile)</span>}</h3>
        <button className="btn-icon" onClick={onClose}>×</button>
      </div>

      {loading && <div className="loading">Loading…</div>}

      {!loading && shots.length === 0 && (
        <div className="empty">No shots recorded yet.</div>
      )}

      <div className="shot-list">
        {shots.map(shot => (
          <div key={shot.id} className="shot-card">
            <div className="shot-card-header" onClick={() => setExpanded(expanded === shot.id ? null : shot.id)}>
              <div className="shot-meta">
                <span className="shot-date">{formatDate(shot.created_at)}</span>
                {shot.hedonic_score && (
                  <span className="shot-score">{shot.hedonic_score}/10</span>
                )}
              </div>
              {shot.brew_actuals && (
                <div className="shot-brew-summary">
                  {shot.brew_actuals.dose_weight && `${shot.brew_actuals.dose_weight}g`}
                  {shot.brew_actuals.yield_ratio && ` → ${shot.brew_actuals.yield_ratio}:1`}
                  {shot.brew_actuals.pull_time && ` @ ${shot.brew_actuals.pull_time}s`}
                </div>
              )}
              <span className="expand-icon">{expanded === shot.id ? '▲' : '▼'}</span>
            </div>

            {expanded === shot.id && (
              <div className="shot-card-body">
                {shot.final_notes && (
                  <div className="shot-final-notes">
                    <div className="notes-label">Final Notes</div>
                    <p>{shot.final_notes}</p>
                  </div>
                )}
                <div className="shot-notes-grid">
                  {shot.fragrance_notes && <NoteBlock label="Fragrance" text={shot.fragrance_notes} />}
                  {shot.aroma_notes && <NoteBlock label="Aroma" text={shot.aroma_notes} />}
                  {shot.flavour_notes && <NoteBlock label="Flavour" text={shot.flavour_notes} />}
                  {shot.finish_notes && <NoteBlock label="Finish" text={shot.finish_notes} />}
                </div>
                <div className="shot-card-actions">
                  <button className="btn-ghost" onClick={() => handleLoadFullShot(shot)}>
                    Load full shot →
                  </button>
                  <button className="btn-ghost" onClick={() => handleLoadProfile(shot)}>
                    Load profile only →
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NoteBlock({ label, text }) {
  return (
    <div className="note-block">
      <div className="notes-label">{label}</div>
      <p>{text}</p>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
