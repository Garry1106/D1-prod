"use strict";
// "use client"
// import React, { useState } from 'react';
// const TestingBanner: React.FC = () => {
//   const [isVisible, setIsVisible] = useState(true);
//   const handleClose = () => {
//     setIsVisible(false); // Close the banner when the cancel button is clicked
//   };
//   const handleAccept = () => {
//     setIsVisible(false); // Close the banner when the "Got it!" button is clicked
//   };
//   if (!isVisible) return null; // Do not render if the banner is not visible
//   return (
//     <div className="fixed top-0 left-0 w-full bg-white shadow-lg p-4 flex justify-between items-center z-50">
//       <div className="flex items-center space-x-4">
//         <span className="text-sm text-gray-700">
//           This website is currently under testing phase. We are working to improve your experience. Thank you for your patience!
//         </span>
//       </div>
//       <div className="flex items-center space-x-4">
//         <button
//           onClick={handleClose}
//           className="text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleAccept}
//           className="bg-[#EB6C33] text-white text-sm px-4 py-2 rounded hover:bg-[#f29367] focus:outline-none"
//         >
//           Got it!
//         </button>
//       </div>
//     </div>
//   );
// };
// export default TestingBanner;
"use client";
// "use client"
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const TestingWatermark = () => {
    const [isVisible, setIsVisible] = (0, react_1.useState)(true);
    const handleClose = () => {
        setIsVisible(false); // Close the watermark when the cancel button is clicked
    };
    if (!isVisible)
        return null; // Do not render if the watermark is not visible
    return (<div className="fixed bottom-0 right-0 p-4 flex justify-between items-center z-50 opacity-70">
      <div className="flex items-center space-x-4 bg-darkText mx-2">
        <span className="text-lg text-white font-semibold transform">
          This website is under testing phase
        </span>
      </div>
    </div>);
};
exports.default = TestingWatermark;
