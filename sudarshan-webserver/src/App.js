import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UploadDocument from './pages/UploadDocument';
import Generate from './pages/Generate'; 
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col items-center w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-[#003366] text-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="mb-4 md:mb-0">
              <span className="font-semibold tracking-wide block mb-1">SUDARSHAN PORTAL</span>
              <span className="text-gray-400">Secure Document Verification System</span>
            </div>
            <div className="text-gray-400 text-xs text-center md:text-right">
              &copy; {new Date().getFullYear()} Sudarshan. All rights reserved.<br/>
              Platform designed for Secure Authentication.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
