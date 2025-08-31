import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa';

const Profile = () => {
  // Sample user data (replace with dynamic data as needed)
  const user = {
    name: 'Admin',
    email: 'xyz@example.com',
    profilePicture: 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg', // Replace with actual profile picture URL
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

      <div className="relative z-10 py-12 px-4">
      <div className="container mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-none">
        <div className="flex justify-center mb-6">
          <motion.img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <h1 className="text-3xl font-semibold text-center mb-4">{user.name}</h1>
        <p className="text-center text-gray-600 mb-4">{user.email}</p>

        {/* Profile Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-none">
          <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
          <p className="mb-2"><span className="font-semibold">Name:</span> {user.name}</p>
          <p className="mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
          {/* Add more user details as needed */}
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 text-center">
          <button className="text-blue-500 hover:underline bg-transparent border-none cursor-pointer">Edit Profile</button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
