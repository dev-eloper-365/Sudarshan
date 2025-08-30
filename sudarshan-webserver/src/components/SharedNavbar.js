import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa';

const SharedNavbar = () => {
  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
          <FaFileAlt className="text-white text-lg" />
        </div>
        <span className="text-white text-2xl font-bold">Sudarshan</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-white hover:text-orange-400 transition-colors font-medium">Home</Link>
        <Link to="/generate" className="text-white hover:text-orange-400 transition-colors font-medium">Generate</Link>
        <Link to="/upload" className="text-white hover:text-orange-400 transition-colors font-medium">Verify</Link>
        <Link to="/profile" className="text-white hover:text-orange-400 transition-colors font-medium">Profile</Link>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-4">
        <span className="text-white hover:text-orange-400 transition-colors cursor-pointer font-medium">Login</span>
        <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
          Sign up
        </button>
      </div>
    </header>
  );
};

export default SharedNavbar; 