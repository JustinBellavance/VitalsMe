import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './LoginPage';
import UploadPage from './UploadPage';
import ResultsPage from './ResultsPage';
import './index.css';
import vitalsLogo from './assets/vitalsme.png';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="flex items-center justify-center gap-6">
        <img 
          src={vitalsLogo}
          alt="Vitals.me Logo" 
          className="h-16 w-16 my-auto"
        />
        <h1 className="app-name my-auto">Vitals.me</h1>
      </div>
      <p className="slogan">Your health, simplified.</p>
      <div className="button-container">
        <Link to="/login">
          <button className="button">Login</button>
        </Link>
        <Link to="/upload">
          <button className="button">Upload Results</button>
        </Link>
        <Link to="/results">
          <button className="button">View Results</button>
        </Link>
      </div>
    </div>
  );
}

export default App;