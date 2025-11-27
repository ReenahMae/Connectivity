import React, { useState } from 'react';
import Button from '../ui/Button/Button';


// Layout-only ProfileSettings: no API calls. Reads initial values from localStorage.user
// and saves edits to localStorage only (no backend persistence).
const ProfileSettings = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [profileData, setProfileData] = useState({
    bio: storedUser.bio || '',
    avatarUrl: storedUser.avatarUrl || '',
    firstName: storedUser.fname || '',
    lastName: storedUser.lname || '',
    email: storedUser.email || ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setSaving(true);
    setError(null);

    try {
      // Persist locally only
      const updatedUser = {
        fname: profileData.firstName,
        lname: profileData.lastName,
        email: profileData.email,
        bio: profileData.bio,
        avatarUrl: profileData.avatarUrl
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Notify layout (sidebar) that user data changed
      try { window.dispatchEvent(new Event('userUpdated')); } catch (e) { /* ignore */ }

      alert('Profile saved locally (no backend).');
    } catch (err) {
      console.error('Error saving profile locally', err);
      setError('Failed to save locally');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <section className="profile-card">
        <div className="profile-header">
          <h3>Profile Information</h3>
          <div className="profile-sub">Update your personal information (local only)</div>
        </div>

        <div className="profile-top">
          <div className="avatar">{profileData.firstName?.[0]}{profileData.lastName?.[0]}</div>
          <div className="photo-actions">
            <Button variant="outline">
              <span className="camera-icon">📷</span>
              Change Photo
            </Button>
            <div className="photo-note">JPG, PNG or GIF. Max 2MB</div>
          </div>
        </div>

        <div className="divider" />

        <div className="form-grid">
          <div className="field">
            <label>First Name</label>
            <input name="firstName" value={profileData.firstName} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input name="lastName" value={profileData.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label>Email Address</label>
          <input name="email" value={profileData.email} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Bio</label>
          <textarea name="bio" value={profileData.bio} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Avatar URL</label>
          <input name="avatarUrl" value={profileData.avatarUrl} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </section>
    </>
  );
};

export default ProfileSettings;
