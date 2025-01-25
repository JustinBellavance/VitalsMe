import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

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
        <button type="submit" className="login-button">Login</button>
      </form>
      <Link to="/">
        <button className="back-button">Back to Home</button>
      </Link>
    </div>
  );
}

export default LoginPage;