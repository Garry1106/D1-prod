"use strict";
"use client";
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
exports.useUserContext = exports.UserProvider = void 0;
const react_1 = __importStar(require("react"));
// Create the context with an undefined default value
const UserContext = (0, react_1.createContext)(undefined);
// Create the provider component
const UserProvider = ({ children }) => {
    // State to hold the product type, with a default value
    const [productType, setProductType] = (0, react_1.useState)('Whatsapp-bot');
    // State to handle dark mode toggle
    const [isDarkMode, setIsDarkMode] = (0, react_1.useState)(false);
    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };
    return (<UserContext.Provider value={{
            productType,
            setProductType,
            isDarkMode,
            toggleDarkMode
        }}>
      {children}
    </UserContext.Provider>);
};
exports.UserProvider = UserProvider;
// Custom hook to use the UserContext
const useUserContext = () => {
    const context = (0, react_1.useContext)(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
exports.useUserContext = useUserContext;
