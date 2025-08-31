import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUpload, FaFileAlt, FaCheckCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';

async function addBlock(blockData) {
  try {
    console.log('Sending blockData:', blockData);
    
    const response = await axios.post(
      'https://sudarshan-blockchain.onrender.com/api/blockchain/add-block',
      blockData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Block added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding block:', error.message);
    return "Document is Invalid";
  }
}

async function callFastApi(documentFile) {
  const formData = new FormData();
  formData.append('file', documentFile);

  try {
    const response = await axios.post('https://sudarshan-ocr-apiserver-12bx.onrender.com/extract-details/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Extracted details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling the FastAPI:', error.response ? error.response.data : error.message);
    return null;
  }
}

const UploadDocument = () => {
  const [documentType, setDocumentType] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDocumentFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentFile) {
      setMessage('Please select a file before submitting');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const extractedData = await callFastApi(documentFile);
      
      if (!extractedData) {
        setMessage('Error extracting data from the document');
        setIsLoading(false);
        return;
      }

      setResult(extractedData);
      extractedData.aadhaar_number = extractedData.aadhaar_number.replace(/\s+/g, '');
      
      const blockData = {
        document_content: extractedData.aadhaar_number
      };

      const apiResult = await addBlock(blockData);
      setApiResponse(apiResult);
      setMessage('Document processed successfully!');
    } catch (err) {
      console.error('Error processing document:', err);
      setMessage('Error processing document');
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Main Content Container with proper spacing */}
      <div className="relative z-10 px-8 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between py-8 gap-12 min-h-[calc(100vh-200px)]">
          
          {/* Left Content - Upload Form */}
          <div className="lg:w-1/2 w-full">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-6">
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                Document Verification
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Upload your documents securely and get them verified using our advanced blockchain technology.
              </p>
            </div>

            {/* Upload Form */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
              <div className="space-y-6">
                
                {/* Document Type Selection */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-3">
                    Document Type
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    required
                  >
                    <option value="" disabled className="bg-gray-800 text-gray-300">Select Document Type</option>
                    <option value="aadhar" className="bg-gray-800 text-white">Aadhar Card</option>
                    <option value="pan" className="bg-gray-800 text-white">PAN Card</option>
                    <option value="driving" className="bg-gray-800 text-white">Driving License</option>
                  </select>
                </div>

                {/* File Upload Area */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-3">
                    Upload Document
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-orange-400 bg-orange-400/10' 
                        : 'border-white/30 hover:border-orange-400/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setDocumentFile(e.target.files[0])}
                      accept="image/*,.pdf"
                      required
                    />
                    
                    {documentFile ? (
                      <div className="space-y-3">
                        <FaCheckCircle className="text-green-400 text-3xl mx-auto" />
                        <p className="text-white font-medium">{documentFile.name}</p>
                        <p className="text-gray-300 text-sm">Click to change file</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <FaUpload className="text-gray-400 text-3xl mx-auto" />
                        <p className="text-white font-medium">Drag & drop your document here</p>
                        <p className="text-gray-300 text-sm">or click to browse files</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !documentFile}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isLoading || !documentFile
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>Verify Document</span>
                    </>
                  )}
                </button>

                {/* Message Display */}
                {message && (
                  <div className={`p-4 rounded-lg text-center ${
                    message.includes('Error') || message.includes('Error')
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Results Display */}
          <div className="lg:w-1/2 w-full">
            {(result || apiResponse) && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Verification Results</h2>
                
                {result && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-orange-400">Extracted Information</h3>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="text-white font-medium">Name:</span> {result.name}</p>
                      <p><span className="text-white font-medium">Aadhaar Number:</span> {result.aadhaar_number}</p>
                      <p><span className="text-white font-medium">Date of Birth:</span> {result.date_of_birth}</p>
                      <p><span className="text-white font-medium">Gender:</span> {result.gender}</p>
                    </div>
                  </div>
                )}

                {apiResponse && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-orange-400">Blockchain Status</h3>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <pre className="text-green-300 text-sm overflow-x-auto">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
