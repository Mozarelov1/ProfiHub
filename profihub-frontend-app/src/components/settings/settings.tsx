import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './settings.css';
import AccMgmService from '../../services/AccMgmService';
import AuthService from '../../services/AuthService';
import { observer } from 'mobx-react-lite';

interface ProfileData {
  login: string;
  avatar: string;
  bio: string;
  hired: boolean;
  email: string;
  link: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBio, setNewBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AccMgmService.viewMyProfile();
      const data = res.data;
      setProfile({
        login: data.login,
        avatar: data.avatar,
        bio: data.bio,
        hired: data.hired,
        email: data.email,
        link: data.link,
      });
      setNewBio(data.bio);
      setStatus(data.hired);
    } catch (e) {
      console.error(e);
      setError('Failed to load your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    if (!newBio.trim()) return;
    try {
      await AccMgmService.updateProfileBio(newBio);
      await loadProfile();
    } catch (e) {
      console.error(e);
      alert('Failed to update bio');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleChangeAvatar = async () => {
    if (!avatarFile) return;
    const form = new FormData();
    form.append('image', avatarFile);
    try {
      await AccMgmService.changeAvatar(form);
      await loadProfile();
    } catch (e) {
      console.error(e);
      alert('Failed to change avatar');
    }
  };

  const handleResetAvatar = async () => {
    try {
      await AccMgmService.resetAvatar();
      await loadProfile();
    } catch (e) {
      console.error(e);
      alert('Failed to reset avatar');
    }
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus = !status;
      await AccMgmService.changeStatus({ status: newStatus });
      setStatus(newStatus);
      setProfile(prev => prev ? { ...prev, hired: newStatus } : prev);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !currentPassword.trim()) return;
    try {
      await AccMgmService.resetPassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      alert('Password successfully updated');
    } catch (err) {
      console.error(err);
      alert('Failed to reset password');
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        await AccMgmService.deleteProfile();
        window.location.href = '/';
      } catch (err) {
        console.error(err);
        alert('Failed to delete profile');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Failed to log out');
    }
  };

  if (loading) return <p className="loading">Loading profile…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!profile) return null;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="container header-inner">
          <Link to="/catalog" className="btn back-btn">
            ← Back to Catalog
          </Link>
        </div>
      </header>

      <main className="main-content profile-section">
        <div className="container cards-container">
          <div className="profile-card">
            <div className="profile-content">
              <div className="avatar-wrapper">
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="profile-avatar"
                />
              </div>
              <div className="profile-info">
                <h2 className="profile-username">{profile.login}</h2>
                <p className="profile-email">
                  <strong>Email:</strong> {profile.email}
                </p>
                <p className="profile-bio">
                  <strong>Bio:</strong> {profile.bio}
                </p>
                <p className="profile-hired">
                  <strong>Hired:</strong> {profile.hired ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h3 className="settings-title">Profile Settings</h3>

            <div className="settings-form">
              <label htmlFor="bio-input">Bio:</label>
              <textarea
                id="bio-input"
                value={newBio}
                onChange={e => setNewBio(e.target.value)}
                placeholder="Tell us about yourself"
              />
              <button className="btn setting-btn" onClick={handleUpdateBio}>
                Update Bio
              </button>
            </div>

            <div className="settings-form">
              <label htmlFor="current-password-input">
                Current Password:
              </label>
              <input
                id="current-password-input"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="settings-form">
              <label htmlFor="new-password-input">New Password:</label>
              <input
                id="new-password-input"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                className="btn setting-btn"
                onClick={handleResetPassword}
                disabled={!newPassword || !currentPassword}
              >
                Change Password
              </button>
            </div>

            <div className="settings-form status-form">
              <label>Hired Status:</label>
              <button
                className={`status-btn ${status ? 'hired' : 'not-hired'}`}
                onClick={handleStatusToggle}
                aria-label="Toggle Hired Status"
              >
                {status ? '✓' : '✕'}
              </button>
            </div>

            <div className="settings-form">
              <label htmlFor="avatar-input">New Avatar:</label>
              <input
                id="avatar-input"
                type="file"
                onChange={handleFileChange}
              />
              <button
                className="btn setting-btn upload-avatar-btn"
                onClick={handleChangeAvatar}
                disabled={!avatarFile}
              >
                Upload Avatar
              </button>
              <button
                className="btn setting-btn"
                onClick={handleResetAvatar}
              >
                Reset Avatar
              </button>
            </div>

            <div className="settings-actions">
              <button className="btn logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>

            <div className="settings-actions">
              <button
                className="btn delete-btn"
                onClick={handleDeleteProfile}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="catalog-footer">
        <div className="container footer-inner">
          <p>© ProfiHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default observer(SettingsPage);
