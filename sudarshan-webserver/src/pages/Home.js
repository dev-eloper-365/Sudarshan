import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaCheckCircle, FaUsers, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen royal-black-bg relative overflow-hidden" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <FaFileAlt className="text-white text-lg" />
          </div>
          <span className="text-white text-2xl font-bold">Sudarshan</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="text-gray-300 hover:text-gray-100 transition-colors font-medium no-underline">Home</Link>
          <Link to="/generate" className="text-gray-300 hover:text-gray-100 transition-colors font-medium no-underline">Generate</Link>
          <Link to="/verify" className="text-gray-300 hover:text-gray-100 transition-colors font-medium no-underline">Verify</Link>
          <Link to="/profile" className="text-gray-300 hover:text-gray-100 transition-colors font-medium no-underline">Profile</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col lg:flex-row items-start justify-between px-8 py-20 max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="lg:w-1/2 mb-16 lg:mb-0 lg:pr-12">
          <motion.h1 
            className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 900 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
                         Generate.<br />
             Scan.<br />
             Verify.<br />
            <span className="inline-block ml-3">
              <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-sm transform rotate-45 shadow-sm"></div>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-10 leading-relaxed"
            style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 400 }}
            initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Helping people and small businesses see the bigger picture with secure document verification and blockchain technology.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/upload">
              <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center text-lg" style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 600 }}>
                Get the App
                <FaUpload className="ml-3 text-white text-lg" />
              </button>
                </Link>
          </motion.div>
              </div>

        {/* Right Visual Area */}
        <div className="lg:w-1/2 relative flex items-start justify-center">
          {/* 3D Glassmorphism Cards */}
              <motion.div
            className="card-3d-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Bottom Card (Back) */}
            <div className="glassmorphism-card-3d bottom-card absolute">
              <div className="card-logo">VERIFIED</div>
              <div className="card-chip"></div>
              <div className="card-number">4785 0*** **** 4520</div>
              <div className="card-name">Muhammad Shefuddoula</div>
              <div className="card-date">25/12/2022</div>
              <div className="card-ring"></div>
                </div>

            {/* Top Card (Front) */}
            <div className="glassmorphism-card-3d top-card absolute">
              <div className="card-logo">SUDARSHAN</div>
              <div className="card-chip"></div>
              <div className="card-number">4785 0125 012 4520</div>
              <div className="card-name">Muhammad Shefuddoula</div>
              <div className="card-date">25/12/2023</div>
              <div className="card-ring"></div>
                </div>
              </motion.div>
        </div>
      </section>


    </div>
  );
};

export default Home;
