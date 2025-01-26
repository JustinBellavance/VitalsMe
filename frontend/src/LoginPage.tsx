import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'heart' && password === 'mchacks') {
      navigate('/dummy-results'); // Update navigation path
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-[#f5d2d3] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-8">Login</h1>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-black">
              Username
            </label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d98a3] focus:border-transparent transition-all duration-200 text-black"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d98a3] focus:border-transparent transition-all duration-200 text-black"
            />
          </div>

          <div className="space-y-4 pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#3d98a3] text-white py-2 rounded-lg hover:bg-[#2c7a83] transition-colors duration-200"
            >
              Login
            </button>
            
            <Link to="/" className="block">
              <button 
                type="button" 
                className="w-full border border-[#3d98a3] text-[#3d98a3] py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Back to Home
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;