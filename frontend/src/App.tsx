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
      <div className="flex items-center justify-center gap-12">
        <img 
          src={vitalsLogo}
          alt="Vitals.me Logo" 
          className="h-32 w-32"
        />
        <h1 className="app-name my-16 -mx-12 font-black text-8xl">Vitals.me</h1>
      </div>
      <p className="slogan text-3xl mt-8" style={{ color: '#3d98a3' }}>
        Your <span style={{ color: '#c80b16' }} className="font-bold">health</span>, simplified.
      </p>
      <div className="flex flex-col items-center gap-8 mt-8">
        <div className="flex justify-center gap-8">
          <Link to="/login">
            <button className="button text-2xl px-8 py-4">Login</button>
          </Link>
          <Link to="/upload">
            <button className="button text-2xl px-8 py-4">Upload Results</button>
          </Link>
        </div>
        <Link to="/results">
          <button className="button text-2xl px-8 py-4">View Results</button>
        </Link>
      </div>
    </div>
  );
}

export default App;