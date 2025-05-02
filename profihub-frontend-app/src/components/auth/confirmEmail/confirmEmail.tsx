import React from 'react';
import { Helmet } from 'react-helmet';
import '../confirmedEmail/confirmedEmail.css';

const EmailConfirmationPage = () =>{
    return (
        <div className="email-confirmation-wrapper">
          <Helmet>
            <title>Email Confirmation | ProfiHub®</title>
          </Helmet>
          <header className="email-confirmation-header">
            <h1 style={{ visibility: 'hidden' }}>.</h1>
          </header>
          <div className="email-confirmation-container">
            <h2>Confirm Email</h2>
            <p>Your email has been sent.</p>
          </div>
          <footer className="email-confirmation-footer">
            <p>&copy; ProfiHub. All rights reserved.</p>
          </footer>
        </div>
      );
    };
    
 
export default EmailConfirmationPage;
