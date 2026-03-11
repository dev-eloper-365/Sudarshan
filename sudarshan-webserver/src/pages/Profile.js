import React from 'react';
import { FaUserCircle, FaEnvelope, FaRegAddressCard, FaPhone, FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
  const user = {
    name: 'Admin User',
    email: 'admin@sudarshan.gov.in',
    department: 'Ministry of Authorization',
    employeeId: 'EMP-90214-IN',
    phone: '+91 98765 43210',
    profilePicture: 'https://ui-avatars.com/api/?name=Admin+User&background=003366&color=fff&size=200',
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-[#003366]">User Profile</h1>
        <p className="text-gray-600 mt-2">Manage your official portal credentials and personal details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Profile Summary */}
        <div className="lg:w-1/3">
          <div className="official-card shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-sm mx-auto object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-[#138808] w-6 h-6 rounded-full border-2 border-white flex items-center justify-center" title="Verified Account">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#333333] mb-1">{user.name}</h2>
            <p className="text-[#003366] font-medium text-sm mb-4">{user.department}</p>
            
            <div className="bg-gray-50 rounded p-3 mb-6 inline-block w-full">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Employee ID</p>
              <p className="font-mono font-bold text-gray-800">{user.employeeId}</p>
            </div>
            
            <button className="w-full btn-official-outline text-sm py-2">
              Update Photo
            </button>
          </div>
        </div>

        {/* Right Content - Profile Details */}
        <div className="lg:w-2/3">
          <div className="official-card shadow-sm h-full">
            <h3 className="text-lg font-bold text-[#003366] mb-6 pb-2 border-b flex items-center">
              <FaRegAddressCard className="mr-2" /> Official Information
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-semibold mb-1 flex items-center">
                    <FaUserCircle className="mr-1" /> Full Name
                  </label>
                  <div className="text-gray-800 font-medium py-2 px-3 bg-gray-50 border border-gray-200 rounded">
                    {user.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-semibold mb-1 flex items-center">
                    <FaEnvelope className="mr-1" /> Official Email
                  </label>
                  <div className="text-gray-800 font-medium py-2 px-3 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                    {user.email}
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded uppercase font-bold">Verified</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-semibold mb-1 flex items-center">
                    <FaPhone className="mr-1" /> Contact Number
                  </label>
                  <div className="text-gray-800 font-medium py-2 px-3 bg-gray-50 border border-gray-200 rounded">
                    {user.phone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                    Department
                  </label>
                  <div className="text-gray-800 font-medium py-2 px-3 bg-gray-50 border border-gray-200 rounded">
                    {user.department}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button className="btn-official-outline">
                Change Password
              </button>
              <button className="btn-official">
                Edit Details
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
