import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaCheckCircle, FaUsers, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen royal-black-bg relative overflow-hidden" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
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
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-orange-400 transition-colors font-medium">Home</Link>
          <Link to="/upload" className="text-white hover:text-orange-400 transition-colors font-medium">How it work?</Link>
          <Link to="/profile" className="text-white hover:text-orange-400 transition-colors font-medium">About us</Link>
          <span className="text-white hover:text-orange-400 transition-colors cursor-pointer font-medium">Support</span>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <span className="text-white hover:text-orange-400 transition-colors cursor-pointer font-medium">Login</span>
          <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col lg:flex-row items-start justify-between px-8 py-20 max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="lg:w-1/2 mb-16 lg:mb-0 lg:pr-12">
          <motion.h1 
            className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover the Unexpected with your Smart Friend
            <span className="inline-block ml-3">
              <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-sm transform rotate-45 shadow-sm"></div>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-10 leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
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
              <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
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

      {/* Statistics Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left Column */}
              <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaUsers className="text-white text-3xl" />
                </div>
            <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>4000+ Active users</h3>
            <p className="text-gray-300 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>We have approximately 4000+ active users from across the world.</p>
              </motion.div>

          {/* Right Column */}
              <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaCheckCircle className="text-white text-3xl" />
                </div>
            <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>5M+ Transaction</h3>
            <p className="text-gray-300 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>In our lifetime, we have already completed 5M transactions.</p>
              </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
