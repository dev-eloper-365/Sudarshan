import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Generate from './pages/Generate';
import UploadDocument from './pages/UploadDocument';
import MyDocuments from './pages/MyDocuments';
import Profile from './pages/Profile';
import VerificationRequests from './pages/VerificationRequests';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/my-documents" element={<MyDocuments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verification-requests" element={<VerificationRequests />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;