import React, { useState, useEffect,useRef } from "react";
import Button from "../ui/Button/Button";
import { getProfile, updateProfile } from "../../api/profileApi";

const ProfileSettings = () => {
  const userId = Number(localStorage.getItem("userId")); // Logged-in user ID
console.log("Fetching profile for userId inside component:", userId);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile on component mount
  useEffect(() => {
  if (!userId) return; // skip if undefined/null

  getProfile(userId)
    .then(res => {
      setProfileData({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
        bio: res.data.bio,
        avatarUrl: res.data.avatarUrl,
      });
    })
    .catch(() => setError("Failed to load profile"))
    .finally(() => setLoading(false));
}, [userId]);

  // File input ref for selecting a new avatar
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfileData(prev => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleEditUrl = () => {
    const url = window.prompt('Enter image URL', profileData.avatarUrl || '');
    if (url !== null) setProfileData(prev => ({ ...prev, avatarUrl: url }));
  };

  const handleRemovePhoto = () => {
    if (!window.confirm('Remove profile photo?')) return;
    setProfileData(prev => ({ ...prev, avatarUrl: '' }));
  };

  const handleChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setSaving(true);
    setError(null);

    updateProfile(userId, profileData)
      .then(() => alert("Profile saved successfully"))
      .catch(() => setError("Failed to save profile"))
      .finally(() => setSaving(false));
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <section className="profile-card">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="profile-top">
        <div className="avatar">
          {profileData.avatarUrl ? (
            <img src={profileData.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar-initials">{(profileData.firstName?.[0] || '') + (profileData.lastName?.[0] || '')}</div>
          )}
        </div>
        <div className="photo-actions">
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
          <div className="photo-main">
            <Button variant="outline" className="change-photo large" onClick={triggerFileInput}>
              <span className="camera-icon">📷</span>
              Change Photo
            </Button>
          </div>

          <div className="photo-secondary">
            <Button variant="outline" className="small-photo-btn" onClick={handleEditUrl}>
              Edit URL
            </Button>
            {profileData.avatarUrl && (
              <Button variant="outline" className="small-photo-btn" onClick={handleRemovePhoto}>
                Remove
              </Button>
            )}
          </div>

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
        <label>Email</label>
        <input name="email" value={profileData.email} onChange={handleChange} />
      </div>

      <div className="field">
        <label>Bio</label>
        <textarea name="bio" value={profileData.bio} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </section>
  );
};

export default ProfileSettings;
