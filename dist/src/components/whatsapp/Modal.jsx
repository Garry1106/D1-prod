"use strict";
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
const Modal = ({ children, onClose }) => {
    const modalRef = (0, react_1.useRef)(null);
    // Accessibility and focus management
    (0, react_1.useEffect)(() => {
        var _a;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        // Focus the modal container
        (_a = modalRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose} role="dialog" aria-modal="true">
      <div ref={modalRef} className="relative w-full h-full max-w-full max-h-full outline-none" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        {/* Close button */}
        <button className="absolute top-4 right-4 text-white text-3xl focus:outline-none" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        {/* Content */}
        <div className="flex items-center justify-center w-full h-full p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>);
};
exports.default = Modal;
