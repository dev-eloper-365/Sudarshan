import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (linkPath) =>
    `flex items-center justify-center space-x-2 text-sm no-underline transition-all duration-300 px-4 py-2 rounded ${
      path === linkPath
        ? 'bg-[#002244] text-white font-semibold' 
        : 'text-gray-200 hover:text-white hover:bg-[#002244]' 
    }`;

  // We don't need to render Navbar on home page since Home.js has its own specific header
  if (path === '/') return null;

  return (
    <div className="w-full">
      {/* Tricolor Bar */}
      <div className="flex w-full h-1.5">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>
      
      {/* Official Main Navigation */}
      <nav className="bg-[#003366] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          
          {/* Left Aligned Official Logo Area */}
          <Link to="/" className="flex items-center space-x-3 no-underline group">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1.5 group-hover:bg-gray-100 transition-colors">
              <FaShieldAlt className="text-[#003366] text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wide text-white">SUDARSHAN</span>
              <span className="text-[10px] text-blue-200 uppercase tracking-widest hidden sm:block">Document Authentication</span>
            </div>
          </Link>

          {/* Right Aligned Area */}
          <div className="flex items-center space-x-2">
            <Link to="/" className={getLinkClass('/')}><span>Home</span></Link>
            <Link to="/generate" className={getLinkClass('/generate')}><span>Generate</span></Link>
            <Link to="/upload" className={getLinkClass('/upload')}><span>Verify</span></Link>
            <Link to="/profile" className={getLinkClass('/profile')}><span>Profile</span></Link>
            
            <div className="h-6 w-px bg-blue-800 mx-2 hidden sm:block"></div>
            
            <button className="hidden sm:flex text-xs bg-white text-[#003366] px-3 py-1.5 rounded font-bold hover:bg-gray-100 transition-colors">
              LOGIN
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;