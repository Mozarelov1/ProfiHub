import React from 'react';
import { Helmet } from 'react-helmet';
import './confirmedEmail.css';

const EmailConfirmedPage = () => {
  const handleRedirect = () => {
    window.location.href = 'http://localhost:5173/catalog';
  };

  return (
    <div className="email-confirmation-wrapper">
      <Helmet>
        <title>Email Confirmation | ProfiHub®</title>
      </Helmet>
      <header className="email-confirmation-header">
        <h1 style={{ visibility: 'hidden' }}>.</h1>
      </header>
      <div className="email-confirmation-container">
        <h2>Email Confirmed</h2>
        <p>Your email has been successfully confirmed.</p>
        <button className="email-confirmation-button" onClick={handleRedirect}>
          Go to Catalog
        </button>
      </div>
      <footer className="email-confirmation-footer">
        <p>&copy; ProfiHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EmailConfirmedPage;
