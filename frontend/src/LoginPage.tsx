import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="app-name">Login</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="button">Login</button>
      </form>
      <Link to="/">
        <button className="button-secondary">Back to Home</button>
      </Link>
      <Link to="/results">
        <button className="button">View Results</button>
      </Link>
    </div>
  );
}

export default LoginPage;