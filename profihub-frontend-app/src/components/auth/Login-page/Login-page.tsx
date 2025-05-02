import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import './LoginPage-styles.css';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await store.login(email, password);
      if (store.isAuth) {
        navigate('/catalog');
      }
    } catch (err) {
      console.error('Login error:', err);
      
    }
  };

  return (
    <div className="login-page-wrapper">
      <Helmet>
        <title>Login | ProfiHub®</title>
      </Helmet>
      <header className="header">
        <h1 style={{ visibility: 'hidden' }}>.</h1>
      </header>
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={store.isLoading}>
            {store.isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="register-redirect">
          <p>Don't have an account? <button className="link-button" onClick={() => navigate('/auth/registration')}>Register</button></p>
        </div>
      </div>
      <footer className="footer">
        <div className="container">
          <p>&copy; ProfiHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default observer(LoginPage);