import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaFileAlt, FaCheckCircle, FaSpinner, FaIdCard, FaExclamationCircle, FaShieldAlt } from 'react-icons/fa';

async function addBlock(blockData) {
  try {
    const response = await axios.post(
      '/api/blockchain/verify-data',
      blockData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding block:', error.message);
    return "Document is Invalid";
  }
}

async function callFastApi(documentFile, documentType) {
  const formData = new FormData();
  formData.append('file', documentFile);
  const endpoint = documentType === 'pan'
    ? '/ocr-api/extract-pan-details/'
    : '/ocr-api/extract-details/';
  try {
    const response = await axios.post(endpoint, formData);
    return response.data;
  } catch (error) {
    console.error('Error calling the FastAPI:', error.response ? error.response.data : error.message);
    return null;
  }
}

const UploadDocument = () => {
  const [documentType, setDocumentType] = useState('aadhar');
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
    setResult(null);
    setApiResponse(null);

    try {
      const extractedData = await callFastApi(documentFile, documentType);
      if (!extractedData) {
        setMessage('Error extracting data from the document');
        setIsLoading(false);
        return;
      }

      setResult(extractedData);
      const documentNumber = documentType === 'pan'
        ? (extractedData.pan_number || '').replace(/\s+/g, '')
        : (extractedData.aadhaar_number || '').replace(/\s+/g, '');
      
      const blockData = {
        document_content: documentNumber
      };

      const apiResult = await addBlock(blockData);
      setApiResponse(apiResult);
      if(apiResult === "Document is Invalid") {
        setMessage('Verification Failed: Document is Invalid');
      } else {
        setMessage('Document successfully verified against the Sudarshan Ledger.');
      }
    } catch (err) {
      console.error('Error processing document:', err);
      setMessage('An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-[#003366]">Document Verification Portal</h1>
        <p className="text-gray-600 mt-2">Upload official documents to verify their authenticity against the national blockchain ledger.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Content - Upload Form */}
        <div className="lg:w-1/2">
          <div className="official-card shadow-sm">
            <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-gray-100">
              <FaIdCard className="text-[#003366] text-xl" />
              <h2 className="text-xl font-bold text-[#333333]">Upload for Verification</h2>
            </div>

            <div className="space-y-6">
              
              {/* Document Type Selection */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Document Type
                </label>
                <select
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#003366]"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  required
                >
                  <option value="aadhar">Aadhaar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="driving">Driving License</option>
                </select>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Upload Scanned Document
                </label>
                <div
                  className={`relative border-2 border-dashed rounded bg-gray-50 p-8 text-center transition-all duration-200 ${
                    dragActive 
                      ? 'border-[#003366] bg-blue-50' 
                      : 'border-gray-300 hover:border-[#003366]'
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
                    <div className="flex flex-col items-center space-y-2">
                      <FaFileAlt className="text-[#003366] text-3xl" />
                      <p className="text-gray-800 font-medium">{documentFile.name}</p>
                      <p className="text-gray-500 text-xs text-center border-t pt-2 mt-2 w-full">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <FaUpload className="text-gray-400 text-3xl" />
                      <p className="text-gray-600 font-medium">Drag & drop your document here</p>
                      <p className="text-gray-400 text-sm">or click to browse from device</p>
                      <p className="text-xs text-gray-400 mt-2">Accepted formats: JPG, PNG, PDF</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !documentFile}
                  className={`w-full py-3 rounded font-medium transition-colors flex items-center justify-center ${
                    isLoading || !documentFile
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-official'
                  }`}
                >
                  {isLoading ? (
                    <><FaSpinner className="animate-spin mr-2" /> Processing & Verifying...</>
                  ) : (
                    <><FaCheckCircle className="mr-2" /> Initiate Verification</>
                  )}
                </button>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-3 rounded text-sm flex items-start ${
                  message.includes('Error') || message.includes('Failed') || message.includes('Invalid')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {message.includes('Error') || message.includes('Failed') || message.includes('Invalid') ? (
                    <FaExclamationCircle className="mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <FaCheckCircle className="mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <span>{message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content - Results Display */}
        <div className="lg:w-1/2">
          {!result && !apiResponse && !isLoading && (
            <div className="bg-gray-50 border border-gray-200 rounded p-10 text-center h-full flex flex-col justify-center items-center">
              <FaShieldAlt className="text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-600 mb-2">Awaiting Document</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Upload a document to initiate OCR extraction and cryptographic verification on the blockchain.
              </p>
            </div>
          )}

          {(result || apiResponse) && (
            <div className="space-y-6">
              
              {result && (
                <div className="official-card shadow-sm border border-[#E0E5EC]">
                  <h3 className="text-sm font-bold text-[#003366] mb-4 uppercase tracking-wider border-b pb-2">
                    Extracted Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3">
                    <div>
                      <span className="text-gray-500 uppercase text-xs font-semibold block mb-1">Name</span>
                      <span className="text-gray-800 font-medium">{result.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-xs font-semibold block mb-1">Aadhaar Number</span>
                      <span className="text-gray-800 font-medium">{result.aadhaar_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-xs font-semibold block mb-1">Date of Birth</span>
                      <span className="text-gray-800 font-medium">{result.date_of_birth || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-xs font-semibold block mb-1">Gender</span>
                      <span className="text-gray-800 font-medium">{result.gender || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {apiResponse && (
                <div className={`official-card shadow-sm border ${
                  apiResponse === "Document is Invalid" ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"
                }`}>
                  <h3 className={`text-sm font-bold mb-4 uppercase tracking-wider border-b pb-2 ${
                    apiResponse === "Document is Invalid" ? "text-red-700 border-red-200" : "text-green-700 border-green-200"
                  }`}>
                    Blockchain Status
                  </h3>
                  
                  {apiResponse === "Document is Invalid" ? (
                    <div className="flex items-center text-red-600">
                      <FaExclamationCircle className="mr-2 text-xl" />
                      <span className="font-semibold">Match Not Found. Document is invalid or forged.</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-green-700 mb-3">
                        <FaCheckCircle className="mr-2 text-xl" />
                        <span className="font-semibold">Cryptographic Match Found</span>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-100 shadow-inner">
                        <pre className="text-gray-700 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                          {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
