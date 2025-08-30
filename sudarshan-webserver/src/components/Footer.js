// import React from 'react';
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

// function Footer() {
//   return (
//     <footer className="footer bg-primary text-white text-center py-3">
//       <div className="container">
//         <p className="mb-1">&copy; 2024 Sudarshan. All rights reserved.</p>
//         <div>
//           {/* <a href="#" className="text-white me-3"><FaFacebookF /></a>
//           <a href="#" className="text-white me-3"><FaTwitter /></a>
//           <a href="#" className="text-white"><FaLinkedinIn /></a> */}
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;


import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#000046] to-[#1cb5e0] text-white text-center py-4 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <p className="mb-2 text-sm">&copy; 2024 Sudarshan. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <button className="text-white text-xl hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer">
            <FaFacebookF />
          </button>
          <button className="text-white text-xl hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer">
            <FaTwitter />
          </button>
          <button className="text-white text-xl hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer">
            <FaLinkedinIn />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
