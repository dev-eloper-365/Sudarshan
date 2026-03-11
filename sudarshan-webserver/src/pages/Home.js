import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaCheckCircle, FaFileAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      
      {/* Tricolor Bar */}
      <div className="flex w-full h-2">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Primary Header */}
      <header className="bg-[#003366] text-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-2">
              <FaShieldAlt className="text-[#003366] text-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wide">SUDARSHAN</span>
              <span className="text-xs text-blue-200">Secure Document Verification Portal</span>
            </div>
          </div>

          {/* Navigation Area */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#FF9933] transition-colors font-medium border-b-2 border-transparent hover:border-[#FF9933] pb-1">Home</Link>
            <Link to="/generate" className="text-gray-300 hover:text-white transition-colors font-medium">Generate</Link>
            <Link to="/verify" className="text-gray-300 hover:text-white transition-colors font-medium">Verify</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors font-medium">Profile</Link>
          </nav>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left Hero Text */}
          <div className="flex flex-col items-start space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#003366] leading-tight">
              A Unified Portal for <br/> 
              <span className="text-[#FF9933]">Document Authentication</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-[#138808] pl-4 bg-white py-2 pr-4 shadow-sm">
              Sudarshan utilizes advanced blockchain technology to ensure the integrity, security, and instantaneous verification of official documents for citizens and organizations.
            </p>
            
            <div className="pt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <Link to="/upload" className="w-full sm:w-auto">
                <button className="w-full bg-[#003366] text-white px-8 py-3 rounded font-medium hover:bg-[#002244] transition-colors shadow flex items-center justify-center">
                  <FaUpload className="mr-2" /> Upload Document
                </button>
              </Link>
              <Link to="/verify" className="w-full sm:w-auto">
                <button className="w-full bg-white text-[#003366] border border-[#003366] px-8 py-3 rounded font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center">
                  <FaCheckCircle className="mr-2 text-[#138808]" /> Verify Status
                </button>
              </Link>
            </div>
            
            <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center"><FaCheckCircle className="text-[#138808] mr-2"/> Secure Platform</div>
              <div className="flex items-center"><FaCheckCircle className="text-[#138808] mr-2"/> Instant Verification</div>
            </div>
          </div>

          {/* Right Visual Area - Official Card Style */}
          <div className="w-full flex justify-center lg:justify-end perspective-1000">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-full max-w-md transform transition-transform duration-300 hover:-translate-y-1">
              {/* Card Header */}
              <div className="bg-[#003366] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                  <FaFileAlt className="text-[#FF9933]" />
                  <span className="font-semibold text-sm tracking-widest">VERIFIED DOCUMENT</span>
                </div>
                <div className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center text-[10px] font-bold">IN</div>
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-24 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">PHOTO</span>
                  </div>
                  <div className="w-16 h-16 bg-gray-100 border border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center leading-none">QR<br/>CODE</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Document ID</div>
                    <div className="text-lg font-mono font-bold text-[#003366] tracking-widest">SUD-8492-771X</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Holder Name</div>
                      <div className="text-sm font-semibold text-gray-800">Muhammad Shefuddoula</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Issued Date</div>
                      <div className="text-sm font-semibold text-gray-800">12 Aug 2023</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-[#138808] font-bold flex items-center">
                    <FaCheckCircle className="mr-1" /> ACTIVE STATUS
                  </span>
                  <div className="h-1 w-16 bg-[#FF9933] rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </main>
      
    </div>
  );
};

export default Home;
