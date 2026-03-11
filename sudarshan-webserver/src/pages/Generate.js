import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaFileAlt, FaUser, FaCalendar, FaVenusMars, FaIdCard, FaCamera, FaDownload, FaSpinner, FaCheckCircle } from 'react-icons/fa';


async function addBlock(blockData) {
  try {
    const response = await axios.post('/api/blockchain/add-block', blockData);
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
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
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
    if (!validateForm()) return;
    setIsLoading(true);

    const voterID = generateVoterID(formData.aadhar);
    const blockData = { document_content: formData.aadhar.replace(/\s+/g, '') };
    const blockchainResponse = await addBlock(blockData);
    
    setBlockchainResult(blockchainResponse);
    setShowVoterID(true);

    setTimeout(() => {
      if (canvasRef.current) {
        drawVoterIDCard(formData.name, formData.dob, formData.gender, voterID, formData.photo);
      }
    }, 100);

    setIsLoading(false);
  };

  const drawVoterIDCard = (name, dob, gender, voterID, photo) => {
    const canvas = canvasRef.current;
    if (!canvas) return; const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Card Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header Bar
    ctx.fillStyle = '#003366';
    ctx.fillRect(0, 0, canvas.width, 40);

    ctx.strokeStyle = '#E0E5EC';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    if (photo) {
      const img = new Image();
      img.onload = () => {
        const photoWidth = canvas.width * 0.25;
        const photoHeight = canvas.height * 0.55;
        ctx.drawImage(img, 20, 60, photoWidth, photoHeight);
        drawText(name, dob, gender, voterID, photoWidth);
      };
      img.src = URL.createObjectURL(photo);
    } else {
      drawText(name, dob, gender, voterID, 0);
    }

    function drawText(name, dob, gender, voterID, photoWidth) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ELECTION COMMISSION OF INDIA', canvas.width / 2, 25);

      const textX = photoWidth + 40;
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      const lineHeight = 25;
      const startY = 80;

      ctx.font = 'bold 14px Arial';
      ctx.fillText(`EPIC NO: ${voterID}`, textX, startY);
      
      ctx.font = '14px Arial';
      ctx.fillText(`Name: ${name}`, textX, startY + lineHeight);
      ctx.fillText(`DOB: ${dob}`, textX, startY + 2 * lineHeight);
      ctx.fillText(`Gender: ${gender}`, textX, startY + 3 * lineHeight);
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

  const maxDate = new Date(2006, 11, 31).toISOString().split('T')[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-[#003366]">Document Generation Engine</h1>
        <p className="text-gray-600 mt-2">Generate officially verifiable digital documents recorded on the Sudarshan blockchain.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Content - Generate Form */}
        <div className="lg:w-1/2">
          <div className="official-card shadow-sm">
            <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-gray-100">
              <FaIdCard className="text-[#FF9933] text-xl" />
              <h2 className="text-xl font-bold text-[#333333]">Voter ID Generation</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
                  <FaUser className="mr-2 text-gray-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="As per official records"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#003366] focus:border-[#003366]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
                    <FaCalendar className="mr-2 text-gray-400" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={maxDate}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#003366] focus:border-[#003366]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
                    <FaVenusMars className="mr-2 text-gray-400" /> Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#003366] focus:border-[#003366]"
                    required
                  >
                    <option value="" disabled>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
                  <FaIdCard className="mr-2 text-gray-400" /> Aadhaar Number
                </label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhaar"
                  maxLength="12"
                  className={`w-full px-4 py-2 bg-gray-50 border rounded focus:outline-none focus:ring-1 focus:ring-[#003366] focus:border-[#003366] ${
                    errors.aadhar ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.aadhar && <p className="text-red-500 text-xs mt-1">{errors.aadhar}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
                  <FaCamera className="mr-2 text-gray-400" /> Passport Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#E0E5EC] file:text-[#003366] hover:file:bg-gray-300"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full btn-official flex items-center justify-center py-3"
                >
                  {isLoading ? (
                    <><FaSpinner className="animate-spin mr-2" /> Processing Request...</>
                  ) : (
                    <><FaFileAlt className="mr-2" /> Generate Verified Document</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Content - Results Display */}
        <div className="lg:w-1/2">
          
          {!showVoterID && !blockchainResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center h-full flex flex-col justify-center items-center">
              <FaCheckCircle className="text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Awaiting Generation</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Submit the required details on the left to generate cryptographic proof and visual representation of the document.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {showVoterID && (
              <div className="official-card bg-[#F8F9FA] shadow-sm border border-[#E0E5EC]">
                <h3 className="text-sm font-bold text-[#003366] mb-4 uppercase tracking-wider flex items-center">
                  <FaFileAlt className="mr-2 text-[#138808]" /> Digital Document
                </h3>
                <div className="flex justify-center bg-white p-4 border rounded shadow-inner mb-4">
                  <canvas ref={canvasRef} width="400" height="250" className="w-full max-w-md h-auto border"></canvas>
                </div>
                <button 
                  onClick={downloadImage}
                  className="w-full bg-[#138808] text-white py-2 rounded font-medium hover:bg-green-700 transition duration-200 flex items-center justify-center"
                >
                  <FaDownload className="mr-2" /> Download Copy
                </button>
              </div>
            )}

            {blockchainResult && (
              <div className="official-card shadow-sm border border-[#E0E5EC]">
                <h3 className="text-sm font-bold text-[#003366] mb-4 uppercase tracking-wider flex items-center">
                  <FaIdCard className="mr-2 text-[#FF9933]" /> Blockchain Receipt
                </h3>
                <div className="bg-gray-900 rounded p-4 shadow-inner">
                  <pre className="text-green-400 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                    {JSON.stringify(blockchainResult, null, 2)}
                  </pre>
                </div>
                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <FaCheckCircle className="text-green-500 mr-1" /> Verified on Sudarshan Ledger
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Generate;
