import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { observer } from 'mobx-react-lite';
import './CatalogPage.css';

import CatalogService from '../../../services/CatalogService';
import AccMgmService from '../../../services/AccMgmService';
import { PostResponse } from '../../../models/Response/PostResponse';
import { AccMgmResponse } from '../../../models/Response/AccMgmResponse';

const CatalogPage: React.FC = () => {
  const { category: routeCategory } = useParams<{ category: string }>();

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'All', 'Frontend', 'Backend', 'Quality-Assurance',
    'Artificial-Intelligence', 'Mobile', 'DevOps',
    'GameDev', 'Hardware', 'Artist'
  ];
  const [selectedCategory, setSelectedCategory] = useState(
    routeCategory ? capitalize(routeCategory) : 'All'
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [userSlug, setUserSlug] = useState<string | null>(null);


  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      interface DecodedToken { userID: string; }
      const { userID } = jwtDecode<DecodedToken>(token);
      if (userID) {
        AccMgmService.viewProfile(userID)
          .then(resp => {
            const profile: AccMgmResponse = resp.data;
            setUserSlug(profile.link);
          })
          .catch(err => {
            console.error('Error fetching profile link:', err);
          });
      }
    } catch (err) {
      console.error('Invalid token format:', err);
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


  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = selectedCategory === 'All'
          ? await CatalogService.getAllPosts()
          : await CatalogService.filterPost(selectedCategory);
        setPosts(res.data);
      } catch {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [selectedCategory]);

  return (
    <div className="catalog-page">
      <aside className="sidebar">
        <nav>
          <ul>
            {categories.map(cat => (
              <li key={cat}>
                <button
                  className="sidebar-btn"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="catalog-header">
          <div className="container header-inner">
            <Link to="/catalog/posts/create" className="btn create-post-btn">
              Create Post
            </Link>
            {!loadingAvatar && avatarUrl && (
              <Link to={userSlug ? `/profile/${userSlug}` : '/profile'}>
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="user-avatar clickable"
                />
              </Link>
            )}
          </div>
        </header>

        <section className="services-section">
          <div className="container">
            {loading && <p>Loading posts...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && posts.length === 0 && (
              <p>No posts found under “{selectedCategory}”.</p>
            )}
            <div className="service-list">
              {posts.map(post => (
                <div key={post.id} className="service-item">
                  <h3>{post.titlе}</h3>
                  <p><strong>Experience:</strong> {post.experience}</p>
                  {post.salary && <p><strong>Salary:</strong> ${post.salary}</p>}
                  <Link to={`/watch/${post.link}`} className="btn service-btn">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="catalog-footer">
          <div className="container">
            <p>© ProfiHub. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default observer(CatalogPage);
