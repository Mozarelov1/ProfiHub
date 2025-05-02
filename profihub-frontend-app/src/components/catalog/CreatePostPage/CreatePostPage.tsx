import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreatePostPage.css';
import CatalogService from '../../../services/CatalogService';
import AccMgmService from '../../../services/AccMgmService';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [link, setLink] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      setLoadingAvatar(true);
      try {
        const url = await AccMgmService.getAvatar();
        setAvatarUrl(url);
      } catch {
      } finally {
        setLoadingAvatar(false);
      }
    };
    fetchAvatar();
  }, []);

  const categories = [
    'Frontend', 'Backend', 'Quality-Assurance', 'Artificial-Intelligence',
    'Mobile', 'DevOps', 'GameDev', 'Hardware', 'Artist'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (Number(salary) < 0) {
      setError('Salary cannot be negative.');
      setLoading(false);
      return;
    }

    try {
      await CatalogService.createPost(
        title,
        experience,
        category,
        description,
        Number(salary),
      );
      navigate('/profile');
    } catch {
      setError('Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <header className="catalog-header">
        <div className="container header-inner">
          <Link to="/catalog" className="btn">
            Back to Catalog
          </Link>
          {!loadingAvatar && avatarUrl && (
            <Link to="/profile">
              <img src={avatarUrl} alt="User Avatar" className="user-avatar" />
            </Link>
          )}
        </div>
      </header>

      <main className="main-content form-section">
        <div className="container" style={{ minWidth: '600px' }}>
            <h2>Create New Post</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="post-form">
              <label>
                Title
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </label>

              <label>
                Experience
                <input
                  type="text"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  required
                />
              </label>

              <label>
                Category
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Description
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </label>

              <label>
                Salary
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  min="0"
                />
              </label>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </form>
        </div>
      </main>

      <footer className="catalog-footer">
        <div className="container">
          <p>© ProfiHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CreatePostPage;
