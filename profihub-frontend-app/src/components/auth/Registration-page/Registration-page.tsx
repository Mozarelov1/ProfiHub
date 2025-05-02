import React, { useState , useContext} from 'react';
import { Helmet } from 'react-helmet';
import './RegistrationPage-styles.css';
import {Context} from '../../../index'
import {observer} from 'mobx-react-lite'
import { useNavigate, Link } from 'react-router-dom';

const RegistrationPage = () => {
  const [email,setEmail] = useState<string>("");
  const [password,setPassword] = useState<string>("");
  const [login,setLogin] = useState<string>("")
  const {store} = useContext(Context)

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await store.registration(email, password, login);
      if (store.isAuth) {
        navigate('/auth/email-confirmation');
      }
    } catch(err) {}
  };
  
  return (
    <div className="registration-page-wrapper">
      <Helmet>
        <title>Registration | ProfiHub®</title>
      </Helmet>
      <header className="header">
        <h1 style={{ visibility: 'hidden' }}>.</h1>
      </header>
      <div className="registration-container">
        <h2>Registration</h2>
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Login:</label>
            <input
              type="text"
              id="login"
              placeholder='Login'
              value={login}
              onChange={e => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <div className="login-redirect">
          <p>Do you have an account? <button className="link-button" onClick={() => navigate('/auth/login')}>Login</button></p>
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

export default observer(RegistrationPage);