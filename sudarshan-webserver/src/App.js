// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import MyDocuments from './pages/MyDocuments';
// import UploadDocument from './pages/UploadDocument';
// import VerificationRequests from './pages/VerificationRequests';
// import Profile from './pages/Profile';

// function App() {
//   return (
//     <Router>
//       <div className="app-container">
//         <Navbar />
//         <main className="main-content container mt-5 mb-5">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/my-documents" element={<MyDocuments />} />
//             <Route path="/upload-document" element={<UploadDocument />} />
//             <Route path="/verification-requests" element={<VerificationRequests />} />
//             <Route path="/profile" element={<Profile />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import UploadDocument from './pages/UploadDocument';
import Generate from './pages/Generate'; 
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
