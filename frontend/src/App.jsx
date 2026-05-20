import { useState, useEffect } from 'react';
import { api } from './api.js';
import { emptyShot, emptyProfile } from './data/defaults.js';
import ProfileSection from './components/ProfileSection.jsx';
import BrewAndVisualSection from './components/BrewAndVisualSection.jsx';
import SensorySection from './components/SensorySection.jsx';
import FinishingSection from './components/FinishingSection.jsx';
import ShotHistory from './components/ShotHistory.jsx';

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [profile, setProfile] = useState(emptyProfile());
  const [shot, setShot] = useState(emptyShot());
  const [profileId, setProfileId] = useState(null); // saved profile id
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState(null);
  const [profileCollapsed, setProfileCollapsed] = useState(false);

  // Load profile list on mount
  useEffect(() => {
    api.listProfiles().then(setProfiles).catch(console.error);
  }, []);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function loadProfile(id) {
    try {
      const p = await api.getProfile(id);
      setProfile(p);
      setProfileId(p.id);
      // Pre-fill brew actuals from defaults
      setShot({
        ...emptyShot(p.id),
        brew_actuals: { ...p.brew_defaults }
      });
      showToast(`Loaded: ${p.name}`);
    } catch (e) {
      showToast('Failed to load profile', 'error');
    }
  }

  async function saveProfile() {
    if (!profile.name) return showToast('Profile needs a name', 'error');
    setSavingProfile(true);
    try {
      let saved;
      if (profileId) {
        saved = await api.updateProfile(profileId, profile);
      } else {
        saved = await api.createProfile(profile);
        setProfileId(saved.id);
      }
      setProfile(saved);
      setProfiles(prev => {
        const idx = prev.findIndex(p => p.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [...prev, saved];
      });
      showToast('Profile saved');
    } catch (e) {
      showToast('Failed to save profile: ' + e.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveShot() {
    if (!profileId) return showToast('Save the profile first', 'error');
    setSaving(true);
    try {
      const data = { ...shot, profile_id: profileId };
      await api.createShot(data);
      showToast('Shot saved!');
      // Reset shot, keep profile
      setShot(emptyShot(profileId));
    } catch (e) {
      showToast('Failed to save shot: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  function newSession() {
    if (!window.confirm('Start a fresh session? Unsaved shot data will be lost.')) return;
    setProfile(emptyProfile());
    setShot(emptyShot());
    setProfileId(null);
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">☕</span>
          <h1 className="header-title">Espresso Tasting</h1>
        </div>
        <div className="header-actions">
          {profiles.length > 0 && (
            <select
              className="profile-select"
              value={profileId || ''}
              onChange={e => e.target.value && loadProfile(e.target.value)}
            >
              <option value="">Load profile…</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.roaster ? `${p.roaster} — ` : ''}{p.name || p.origin || 'Unnamed'}</option>
              ))}
            </select>
          )}
          <button className="btn-ghost" onClick={() => setShowHistory(true)}>
            Past Shots
          </button>
          <button className="btn-ghost" onClick={newSession}>
            New Session
          </button>
        </div>
      </header>

      {/* Main layout */}
      <main className="app-main">
        <div className="form-panel">

          {/* Profile */}
          <div className={`collapsible ${profileCollapsed ? 'collapsed' : ''}`}>
            <button className="collapse-toggle" onClick={() => setProfileCollapsed(v => !v)}>
              {profileCollapsed ? '▶' : '▼'} Profile {profile.name && <span className="muted">— {profile.name}</span>}
            </button>
            {!profileCollapsed && (
              <>
                <ProfileSection profile={profile} onChange={setProfile} />
                <div className="section-actions">
                  <button className="btn-primary" onClick={saveProfile} disabled={savingProfile}>
                    {savingProfile ? 'Saving…' : profileId ? 'Update Profile' : 'Save Profile'}
                  </button>
                  {profileId && <span className="saved-badge">✓ Profile saved</span>}
                </div>
              </>
            )}
          </div>

          <BrewAndVisualSection shot={shot} onChange={setShot} />
          <SensorySection lens="fragrance" shot={shot} onChange={setShot} />
          <SensorySection lens="aroma" shot={shot} onChange={setShot} />
          <SensorySection lens="flavour" shot={shot} onChange={setShot} />
          <SensorySection lens="finish" shot={shot} onChange={setShot} />
          <FinishingSection shot={shot} onChange={setShot} />

          {/* Save Shot */}
          <div className="save-shot-bar">
            <button
              className="btn-save-shot"
              onClick={saveShot}
              disabled={saving || !profileId}
            >
              {saving ? 'Saving…' : 'Save Shot →'}
            </button>
            {!profileId && <span className="muted save-hint">Save the profile above first</span>}
          </div>
        </div>
      </main>

      {/* Shot history drawer */}
      {showHistory && (
        <div className="drawer-overlay" onClick={() => setShowHistory(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <ShotHistory
              profileId={profileId}
              onLoadProfile={(p, shotData) => {
                setProfile(p);
                setProfileId(p.id);
                if (shotData) {
                  setShot(shotData);
                } else {
                  setShot({ ...emptyShot(p.id), brew_actuals: { ...p.brew_defaults } });
                }
              }}
              onClose={() => setShowHistory(false)}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
