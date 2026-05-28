import { ROAST_LEVELS, PROCESSES } from '../data/sca.js';

export default function ProfileSection({ profile, onChange, profiles = [] }) {
  function set(field, val) {
    onChange({ ...profile, [field]: val });
  }

  function setDefault(field, val) {
    onChange({ ...profile, brew_defaults: { ...profile.brew_defaults, [field]: val } });
  }

  function addComponent() {
    onChange({
      ...profile,
      components: [...(profile.components || []), { component_profile_id: '', component_profile_name: '', weight_g: '' }]
    });
  }

  function updateComponent(idx, field, val) {
    const comps = [...(profile.components || [])];
    comps[idx] = { ...comps[idx], [field]: val };
    const total = comps.reduce((sum, c) => sum + (parseFloat(c.weight_g) || 0), 0);
    const withPct = comps.map(c => ({
      ...c,
      percentage: total > 0 ? Math.round((parseFloat(c.weight_g) || 0) / total * 100) : 0
    }));
    onChange({ ...profile, components: withPct });
  }

  function selectComponentProfile(idx, profileId) {
    const picked = profiles.find(p => p.id === profileId);
    const comps = [...(profile.components || [])];
    comps[idx] = {
      ...comps[idx],
      component_profile_id: profileId,
      component_profile_name: picked ? (picked.name || picked.origin || 'Unnamed') : '',
    };
    // Recalculate percentages after profile change
    const total = comps.reduce((sum, c) => sum + (parseFloat(c.weight_g) || 0), 0);
    const withPct = comps.map(c => ({
      ...c,
      percentage: total > 0 ? Math.round((parseFloat(c.weight_g) || 0) / total * 100) : 0
    }));
    onChange({ ...profile, components: withPct });
  }

  function removeComponent(idx) {
    const comps = profile.components.filter((_, i) => i !== idx);
    const total = comps.reduce((sum, c) => sum + (parseFloat(c.weight_g) || 0), 0);
    const withPct = comps.map(c => ({
      ...c,
      percentage: total > 0 ? Math.round((parseFloat(c.weight_g) || 0) / total * 100) : 0
    }));
    onChange({ ...profile, components: withPct });
  }

  return (
    <div className="section">
      <h2 className="section-title">01 — Profile</h2>

      <div className="field-grid">
        <Field label="Profile Name" required>
          <input value={profile.name || ''} onChange={e => set('name', e.target.value)} placeholder="e.g. Ethiopia Yirgacheffe Natural" />
        </Field>
        <Field label="Roaster">
          <input value={profile.roaster || ''} onChange={e => set('roaster', e.target.value)} />
        </Field>
        <Field label="Origin / Blend">
          <input value={profile.origin || ''} onChange={e => set('origin', e.target.value)} />
        </Field>
        <Field label="Producer">
          <input value={profile.producer || ''} onChange={e => set('producer', e.target.value)} />
        </Field>
        <Field label="Location">
          <input value={profile.location || ''} onChange={e => set('location', e.target.value)} />
        </Field>
        <Field label="Elevation">
          <input value={profile.elevation || ''} onChange={e => set('elevation', e.target.value)} placeholder="e.g. 1800 masl" />
        </Field>
        <Field label="Variety">
          <input value={profile.variety || ''} onChange={e => set('variety', e.target.value)} placeholder="e.g. Heirloom, Gesha" />
        </Field>
        <Field label="Process">
          <select value={profile.process || ''} onChange={e => set('process', e.target.value)}>
            <option value="">—</option>
            {PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Roast Date">
          <input type="date" value={profile.roast_date || ''} onChange={e => set('roast_date', e.target.value)} />
        </Field>
        <Field label="Roast Level">
          <select value={profile.roast_level || ''} onChange={e => set('roast_level', e.target.value)}>
            <option value="">—</option>
            {ROAST_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      {/* Brew Defaults */}
      <div className="subsection">
        <h3 className="subsection-title">Brew Defaults</h3>
        <div className="field-grid">
          <Field label="Dose (g)">
            <input type="number" step="0.1" value={profile.brew_defaults?.dose_weight || ''} onChange={e => setDefault('dose_weight', e.target.value)} />
          </Field>
          <Field label="Grind Level">
            <input value={profile.brew_defaults?.grind_level || ''} onChange={e => setDefault('grind_level', e.target.value)} />
          </Field>
          <Field label="Water Temp (°C)">
            <input type="number" value={profile.brew_defaults?.water_temp || ''} onChange={e => setDefault('water_temp', e.target.value)} />
          </Field>
          <Field label="Pressure Max (bar)">
            <input type="number" step="0.5" value={profile.brew_defaults?.pressure_max || ''} onChange={e => setDefault('pressure_max', e.target.value)} />
          </Field>
          <Field label="Pressure Min (bar)">
            <input type="number" step="0.5" value={profile.brew_defaults?.pressure_min || ''} onChange={e => setDefault('pressure_min', e.target.value)} />
          </Field>
          <Field label="Pull Time (s)">
            <input type="number" value={profile.brew_defaults?.pull_time || ''} onChange={e => setDefault('pull_time', e.target.value)} />
          </Field>
          <Field label="Shot Weight (g)">
            <input type="number" step="0.1" value={profile.brew_defaults?.shot_weight || ''} onChange={e => setDefault('shot_weight', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Blend Components */}
      <div className="subsection">
        <h3 className="subsection-title">Blend Components (Listing Profiles)</h3>

        <div className="blend-total-row">
          <Field label="Total Blend Dose (g)">
            <input
              type="number" step="0.1" min="0"
              value={profile.blend_total_g || ''}
              onChange={e => {
                const total = parseFloat(e.target.value) || 0;
                const comps = profile.components || [];
                const currentTotal = comps.reduce((s, c) => s + (parseFloat(c.weight_g) || 0), 0);
                const updated = comps.map(c => {
                  const currentW = parseFloat(c.weight_g) || 0;
                  const newW = currentTotal > 0 && total > 0
                    ? parseFloat(((currentW / currentTotal) * total).toFixed(2))
                    : currentW;
                  const pct = total > 0 ? Math.round((newW / total) * 100) : (c.percentage ?? 0);
                  return { ...c, weight_g: newW || '', percentage: pct };
                });
                onChange({ ...profile, blend_total_g: e.target.value, components: updated });
              }}
              placeholder="e.g. 18"
            />
          </Field>
          <span className="blend-total-hint">Sets the dose; component weights scale proportionally</span>
        </div>

        {(profile.components || []).map((comp, idx) => {
          const linkedProfile = profiles.find(p => p.id === comp.component_profile_id);
          const displayName = linkedProfile
            ? (linkedProfile.roaster ? `${linkedProfile.roaster} — ` : '') + (linkedProfile.name || linkedProfile.origin || 'Unnamed')
            : comp.component_profile_name || null;

          return (
            <div key={idx} className="component-row">
              <div className="component-profile-col">
                <select
                  className="component-profile-select"
                  value={comp.component_profile_id || ''}
                  onChange={e => selectComponentProfile(idx, e.target.value)}
                >
                  <option value="">— Select profile —</option>
                  {profiles
                    .filter(p => p.id !== profile.id)
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.roaster ? `${p.roaster} — ` : ''}{p.name || p.origin || 'Unnamed'}
                      </option>
                    ))
                  }
                </select>
                {comp.component_profile_id && !linkedProfile && displayName && (
                  <span className="component-linked-fallback" title="Profile ID saved; loading…">
                    ↳ {displayName}
                  </span>
                )}
              </div>
              <input
                className="component-weight"
                type="number" step="0.1"
                value={comp.weight_g || ''}
                onChange={e => updateComponent(idx, 'weight_g', e.target.value)}
                placeholder="g"
              />
              <span className="component-pct">{comp.percentage ?? 0}%</span>
              <button className="btn-icon" onClick={() => removeComponent(idx)}>×</button>
            </div>
          );
        })}
        <button className="btn-ghost" onClick={addComponent}>+ Add Component</button>
      </div>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div className="field">
      <label className="field-label">{label}{required && <span className="required"> *</span>}</label>
      {children}
    </div>
  );
}
