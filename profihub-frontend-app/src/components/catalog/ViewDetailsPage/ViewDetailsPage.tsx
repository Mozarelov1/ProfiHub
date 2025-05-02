import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ViewDetailsPage.css';
import CatalogService from '../../../services/CatalogService';
import AccMgmService from '../../../services/AccMgmService';

interface PostDetail {
  id: string;
  authorLink: string;    
  title: string;
  experience: string;
  category: string;
  description?: string;
  salary?: number | null;
}

const ViewDetailsPage: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const resPost = await CatalogService.readPost(link!);
        const postData = resPost.data;

        const identifier = postData.author;
        const resUser = await AccMgmService.viewProfile(identifier);
        const userProfile = resUser.data;
        const authorSlug = userProfile.link ?? identifier;


        setPost({
          id: postData.id,
          authorLink: authorSlug,
          title: postData.titlе,      
          experience: postData.experience,
          category: postData.category,
          description: postData.description,
          salary: postData.salary != null
            ? Number(postData.salary)
            : undefined,
        });
      } catch (e) {
        console.error(e);
        setError('Failed to load post details or author profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [link]);

  if (loading) return <p>Loading details…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="view-details-page">
      <header className="catalog-header">
        <div className="container header-inner">
          <Link to="/catalog" className="btn">
            Back to Catalog
          </Link>
        </div>
      </header>

      <main className="main-content details-section">
        <div className="container cards-container">
          {post && (
            <div className="details-card">
              <h2 className="details-title">{post.title}</h2>
              <p>
                <strong>Category:</strong> {post.category}
              </p>
              <p>
                <strong>Experience:</strong> {post.experience}
              </p>

              {post.salary != null && (
                <p>
                  <strong>Salary:</strong> ${post.salary}
                </p>
              )} 

              {post.description && (
                <div className="details-desc">
                  <h3>Description</h3>
                  <p>{post.description}</p>
                </div>
              )}

              <Link
                to={`/profile/${post.authorLink}`}
                className="btn details-btn"
              >
                View Creator Profile
              </Link>
            </div>
          )}
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

export default ViewDetailsPage;
