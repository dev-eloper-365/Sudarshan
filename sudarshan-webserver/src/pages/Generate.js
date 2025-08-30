import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaFileAlt, FaUser, FaCalendar, FaVenusMars, FaIdCard, FaCamera, FaDownload, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

async function addBlock(blockData) {
  try {
    const response = await axios.post('https://sudarshan-blockchain.onrender.com/api/blockchain/add-block', blockData);
    console.log('Block added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding block:', error.message);
    return null;
  }
}

const Generate = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    aadhar: '',
    photo: null
  });
  const [errors, setErrors] = useState({});
  const [showVoterID, setShowVoterID] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blockchainResult, setBlockchainResult] = useState(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value 
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (formData.aadhar) {
      const aadharNumber = formData.aadhar.replace(/\s+/g, '');
      if (aadharNumber.length < 12) {
        newErrors.aadhar = 'Aadhar number must be exactly 12 digits.';
        valid = false;
      } else if (!/^\d{12}$/.test(aadharNumber)) {
        newErrors.aadhar = 'Aadhar number must be numeric.';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const generateVoterID = (aadhaar_no) => {
    let hash = 0;
    for (let i = 0; i < aadhaar_no.length; i++) {
      hash = (hash << 5) - hash + aadhaar_no.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString().padStart(8, '0');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const voterID = generateVoterID(formData.aadhar);

    // Add block to blockchain
    const blockData = {
      document_content: formData.aadhar.replace(/\s+/g, '')
    };

    const blockchainResponse = await addBlock(blockData);
    setBlockchainResult(blockchainResponse);

    // Show the canvas and download button after submission
    setShowVoterID(true);

    // Ensure the canvas is ready before drawing
    setTimeout(() => {
      if (canvasRef.current) {
        drawVoterIDCard(formData.name, formData.dob, formData.gender, voterID, formData.photo);
      }
    }, 100);

    setIsLoading(false);
  };

  const drawVoterIDCard = (name, dob, gender, voterID, photo) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cornerRadius = 15;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(canvas.width - cornerRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, cornerRadius);
    ctx.lineTo(canvas.width, canvas.height - cornerRadius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - cornerRadius, canvas.height);
    ctx.lineTo(cornerRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#090909';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (photo) {
      const img = new Image();
      img.onload = () => {
        const photoWidth = canvas.width * 0.35;
        const photoHeight = canvas.height * 0.7;
        ctx.drawImage(img, 20, 50, photoWidth, photoHeight);
        drawText(name, dob, gender, voterID, photoWidth);
      };
      img.src = URL.createObjectURL(photo);
    } else {
      drawText(name, dob, gender, voterID, 0);
    }

    function drawText(name, dob, gender, voterID, photoWidth) {
      const textX = photoWidth + 40;
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Voter ID Card', canvas.width / 2, 40);

      ctx.font = '18px Arial';
      ctx.textAlign = 'left';
      const lineHeight = 35;
      const startY = 80;

      ctx.fillText(`Name: ${name}`, textX, startY);
      ctx.fillText(`DOB: ${dob}`, textX, startY + lineHeight);
      ctx.fillText(`Gender: ${gender}`, textX, startY + 2 * lineHeight);
      ctx.fillText(`Voter ID: ${voterID}`, textX, startY + 3 * lineHeight);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'voter_id.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Get the current date to limit the max date to year 2006 for 18+ rule
  const maxDate = new Date(2006, 11, 31).toISOString().split('T')[0];

  return (
    <div className="min-h-screen royal-black-bg relative" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
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
          <Link to="/upload" className="text-white hover:text-orange-400 transition-colors font-medium">Upload</Link>
          <Link to="/generate" className="text-orange-400 font-medium">Generate</Link>
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between px-8 py-12 pb-32 max-w-7xl mx-auto min-h-screen">
        
        {/* Left Content - Generate Form */}
        <motion.div 
          className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-6">
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
              Generate Voter ID
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Create your digital Voter ID card with blockchain verification and secure document generation.
            </p>
          </div>

          {/* Generate Form */}
          <motion.div 
            className="glassmorphism-card bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8 min-h-fit"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 pb-4">
              
              {/* Name Input */}
              <div>
                <label className="block text-white text-sm font-semibold mb-3 flex items-center">
                  <FaUser className="mr-2 text-orange-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-white text-sm font-semibold mb-3 flex items-center">
                  <FaCalendar className="mr-2 text-orange-400" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  max={maxDate}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-white text-sm font-semibold mb-3 flex items-center">
                  <FaVenusMars className="mr-2 text-orange-400" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm"
                  required
                >
                  <option value="" disabled className="bg-gray-800">Select Gender</option>
                  <option value="male" className="bg-gray-800">Male</option>
                  <option value="female" className="bg-gray-800">Female</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
              </div>

              {/* Aadhar Number */}
              <div>
                <label className="block text-white text-sm font-semibold mb-3 flex items-center">
                  <FaIdCard className="mr-2 text-orange-400" />
                  Aadhar Number
                </label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength="12"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm ${
                    errors.aadhar ? 'border-red-400' : 'border-white/20'
                  }`}
                  required
                />
                {errors.aadhar && (
                  <p className="text-red-300 text-sm mt-2 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    {errors.aadhar}
                  </p>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-white text-sm font-semibold mb-3 flex items-center">
                  <FaCamera className="mr-2 text-orange-400" />
                  Upload Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-400 file:text-white hover:file:bg-orange-500"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="mr-3" />
                    Generate Voter ID
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Right Content - Results Display */}
        <motion.div 
          className="lg:w-1/2 lg:pl-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Generated Voter ID */}
          {showVoterID && (
            <motion.div 
              className="glassmorphism-card bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaFileAlt className="mr-3 text-orange-400" />
                Generated Voter ID
              </h3>
              <div className="flex justify-center mb-6">
                <canvas ref={canvasRef} width="400" height="250" className="rounded-lg shadow-lg"></canvas>
              </div>
              <button 
                onClick={downloadImage}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <FaDownload className="mr-3" />
                Download Voter ID
              </button>
            </motion.div>
          )}

          {/* Blockchain Verification */}
          {blockchainResult && (
            <motion.div 
              className="glassmorphism-card bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaIdCard className="mr-3 text-green-400" />
                Blockchain Verification
              </h3>
              <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                <pre className="text-green-300 text-sm overflow-x-auto">
                  {JSON.stringify(blockchainResult, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!showVoterID && !blockchainResult && (
            <motion.div 
              className="glassmorphism-card bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FaFileAlt className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate</h3>
              <p className="text-gray-300">
                Fill in your details to generate a secure Voter ID card with blockchain verification.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Generate;
