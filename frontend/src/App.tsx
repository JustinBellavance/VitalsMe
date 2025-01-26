import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPage from './LoginPage';
import UploadPage from './UploadPage';
import ResultsPage from './ResultsPage';
import './index.css';
import vitalsLogo from './assets/vitalsme.png';
import vitalsssLogo from './assets/vitalsss.png';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-screen bg-[#f5d2d3]"
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageWrapper>
            <LandingPage />
          </PageWrapper>
        } />
        <Route path="/login" element={
          <PageWrapper>
            <LoginPage />
          </PageWrapper>
        } />
        <Route path="/upload" element={
          <PageWrapper>
            <UploadPage />
          </PageWrapper>
        } />
        <Route path="/results" element={
          <PageWrapper>
            <ResultsPage />
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="flex flex-col items-center gap-10 pb-10">
        {/* Logo */}
        <img 
          src={vitalsssLogo}
          alt="Vitals.me Logo" 
          className="h-40 w-200 object-contain transition-transform duration-300 hover:scale-105" 
        />

        {/* Slogan */}
        <p className="slogan text-5xl" style={{ color: '#3d98a3' }}>
          Your <span style={{ color: '#c80b16' }} className="font-bold">health</span>, simplified.
        </p>
        {/* Buttons Stack */}
        <div className="flex flex-col items-center gap-10">
          <Link to="/upload">
            <button className="button text-2xl px-8 py-10 text-[#3d98a3] hover:text-[#70b3b3] transition-colors duration-300">
              Upload Results
            </button>
          </Link>
          <Link to="/login">
            <button className="button text-2xl px-8 py-10 text-[#3d98a3] hover:text-[#70b3b3] transition-colors duration-300">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;