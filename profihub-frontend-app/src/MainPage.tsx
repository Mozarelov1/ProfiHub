import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './MainPage.css';
import AuthService from './services/AuthService';
import AccMgmService from './services/AccMgmService';

interface DecodedToken {
  userID: string;
}

const MainPage: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
  const [userSlug, setUserSlug] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { userID } = jwtDecode<DecodedToken>(token);
      if (userID) {
        AccMgmService.viewProfile(userID)
          .then(resp => setUserSlug(resp.data.link))
          .catch(err => console.error('Error fetching user slug:', err));
      }
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }, []);

  useEffect(() => {
    const fetchAvatar = async () => {
      setLoadingAvatar(true);
      try {
        const url = await AccMgmService.getAvatar();
        setAvatarUrl(url);
      } catch (err) {
        console.error('Failed to load avatar', err);
      } finally {
        setLoadingAvatar(false);
      }
    };
    fetchAvatar();
  }, []);

  const startLink = avatarUrl ? '/catalog' : '/auth/registration';

  return (
    <div className="main-page">
      <header className="header">
        <div className="container">
          <h1>ProfiHub</h1>
          <nav>
            <ul>
              {!loadingAvatar && avatarUrl ? (
                <li>
                  <Link to={userSlug ? `/profile/${userSlug}` : '/profile'} className="avatar-link">
                    <img src={avatarUrl} alt="User Avatar" className="user-avatar clickable" />
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/auth/registration" className="btn login-btn">
                    Sign up
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h2>Welcome to ProfiHub</h2>
          <p>Find professionals for any task</p>
          <Link to={startLink} className="btn">
            Start
          </Link>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <h2>Popular Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <img
                src="https://profihub-prod-eu-east-1.s3.eu-north-1.amazonaws.com/b15dbe4bc79c51446af163df26f23b11.jpg"
                alt="Design Service"
                className="service-image"
              />
              <h3>Design</h3>
              <p>Professional designers for unique projects</p>
            </div>
            <div className="service-card">
              <img
                src="https://profihub-prod-eu-east-1.s3.eu-north-1.amazonaws.com/15c35576fd03506b2e72241112013338.jpg"
                alt="Development Service"
                className="service-image"
              />
              <h3>Development</h3>
              <p>Developers ready to bring your ideas to life</p>
            </div>
            <div className="service-card">
              <img
                src="https://profihub-prod-eu-east-1.s3.eu-north-1.amazonaws.com/58cc3fd89a6a19d59e18ef50c8147532.jpg"
                alt="Marketing Service"
                className="service-image"
              />
              <h3>Marketing</h3>
              <p>Experts to help promote your business</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about">
        <div className="container">
          <h2>About Us</h2>
          <p>
            ProfiHub is a marketplace that connects professionals from various fields to provide quality services.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} ProfiHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;