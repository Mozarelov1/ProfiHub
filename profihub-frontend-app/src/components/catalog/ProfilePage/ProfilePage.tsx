import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import AccMgmService from '../../../services/AccMgmService';

interface ProfileData {
  login: string; 
  avatar: string;
  bio: string;
  hired: boolean;
  email: string;
  link: string; 
}

const ProfilePage: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate(); 
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await AccMgmService.viewProfile(link!);
        setProfile(res.data);

        navigate(`/profile/${res.data.user}`, { replace: true });
      } catch (e) {
        console.error(e);
        setError('Не удалось загрузить профиль пользователя.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [link, navigate]);

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
                <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
              </div>
              <div className="profile-info">
                <h2 className="profile-username">{profile.login}</h2>
                <p className="profile-email"><strong>Email:</strong> {profile.email}</p>
                <p className="profile-bio"><strong>Bio:</strong> {profile.bio}</p>
                <p className="profile-hired"><strong>Hired:</strong> {profile.hired ? 'Yes' : 'No'}</p>
              </div>
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

export default ProfilePage;
