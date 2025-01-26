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
      <div className="flex flex-col items-center gap-10 pb-10">
        {/* Logo */}
        <img 
          src={vitalsLogo}
          alt="Vitals.me Logo" 
          className="h-32 w-32" 
        />

        {/* Slogan */}
        <p className="slogan text-5xl" style={{ color: '#3d98a3' }}>
          Your <span style={{ color: '#c80b16' }} className="font-bold">health</span>, simplified.
        </p>
        
        {/* Name */}
        <h1 className="app-name font-black text-8xl pb-5">Vitals.me</h1>

        {/* Buttons Stack */}
        <div className="flex flex-col items-center gap-6">
          <Link to="/upload">
            <button className="button text-2xl px-8 py-10">Upload Results</button>
          </Link>
          <Link to="/login">
            <button className="button text-2xl px-8 py-20">Login</button>
          </Link>
          <Link to="/results">
            <button className="button text-2xl px-8 py-10">View Results</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;