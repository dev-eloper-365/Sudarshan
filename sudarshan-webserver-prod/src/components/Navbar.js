import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">Document Verification</Link>
        <div className="space-x-4">
          <Link className={location.pathname === "/" ? "underline" : ""} to="/">Home</Link>
          <Link className={location.pathname === "/upload" ? "underline" : ""} to="/upload">Verify</Link>
          <Link className={location.pathname === "/generate" ? "underline" : ""} to="/generate">Generate</Link>
          <Link className={location.pathname === "/profile" ? "underline" : ""} to="/profile">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;