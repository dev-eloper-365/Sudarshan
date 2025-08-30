import React, { useState } from 'react';
import axios from 'axios';
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
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing document:', err);
      setMessage('Error processing document');
      setIsLoading(false);
    }
  };

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
          <a href="#" className="text-white hover:text-orange-400 transition-colors font-medium">Home</a>
          <a href="#" className="text-orange-400 font-medium">Upload</a>
          <a href="#" className="text-white hover:text-orange-400 transition-colors font-medium">About us</a>
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

      {/* Main Content Container with proper spacing */}
      <div className="relative z-10 px-8 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between py-8 gap-12 min-h-[calc(100vh-200px)]">
          
          {/* Left Content - Upload Form */}
          <div className="lg:w-1/2 w-full">
            <div className="mb-8">
              <a href="#" className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-6">
                <FaArrowLeft className="mr-2" />
                Back to Home
              </a>
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
                        <FaUpload className="text-orange-400 text-3xl mx-auto" />
                        <p className="text-white font-medium">Drag & drop your document here</p>
                        <p className="text-gray-300 text-sm">or click to browse</p>
                      </div>
                    )}
                  </div>
          </div>

                {/* Submit Button */}
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading || !documentFile || !documentType}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaUpload className="mr-3" />
                      Verify Document
                    </>
                  )}
          </button>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`mt-6 p-4 rounded-lg text-center transition-all duration-300 ${
                  message.includes('Error')
                    ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                    : 'bg-green-500/20 border border-green-500/30 text-green-300'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Results Display */}
          <div className="lg:w-1/2 w-full">
            {/* Extracted Details */}
        {result && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FaFileAlt className="mr-3 text-orange-400" />
                  Extracted Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-300">Name:</span>
                    <span className="text-white font-semibold">{result.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-300">Aadhaar Number:</span>
                    <span className="text-white font-semibold">{result.aadhaar_number}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-300">Date of Birth:</span>
                    <span className="text-white font-semibold">{result.date_of_birth}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-300">Gender:</span>
                    <span className="text-white font-semibold">{result.gender}</span>
                  </div>
                </div>
          </div>
        )}

            {/* Blockchain Response */}
        {apiResponse && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FaCheckCircle className="mr-3 text-green-400" />
                  Blockchain Verification
                </h3>
                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <pre className="text-green-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!result && !apiResponse && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
                <FaFileAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Verify</h3>
                <p className="text-gray-300">
                  Upload your document to see the extracted details and blockchain verification results here.
                </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
