// src/pages/VerificationRequests.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa';

const VerificationRequests = () => {
  // Sample Data (Replace with dynamic data as needed)
  const requests = [
    {
      id: 1,
      documentType: 'Birth Certificate',
      user: 'John Doe',
      dateSubmitted: '2024-08-25',
      status: 'Pending',
    },
    {
      id: 2,
      documentType: 'Academic Transcript',
      user: 'Jane Smith',
      dateSubmitted: '2024-08-20',
      status: 'Approved',
    },
    // Add more requests as needed
  ];

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      case 'Rejected':
        return 'text-danger';
      default:
        return 'text-secondary';
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

      <div className="relative z-10 container mt-5 px-8">
      <h2>Verification Requests</h2>
      <table className="table table-hover mt-3">
        <thead className="table-primary">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Document Type</th>
            <th scope="col">User</th>
            <th scope="col">Date Submitted</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <th scope="row">{req.id}</th>
              <td>{req.documentType}</td>
              <td>{req.user}</td>
              <td>{req.dateSubmitted}</td>
              <td className={getStatusColor(req.status)}>
                {req.status}
              </td>
              <td>
                <button className="btn btn-primary btn-sm me-2">
                  View
                </button>
                <button className="btn btn-secondary btn-sm">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default VerificationRequests;
