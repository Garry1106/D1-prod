"use strict";
'use client';
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
exports.useTenantConfig = exports.TenantConfigProvider = void 0;
// context/TenantConfigContext.tsx
const react_1 = __importStar(require("react"));
const TenantConfigContext = (0, react_1.createContext)(undefined);
const TenantConfigProvider = ({ children }) => {
    const [tenantConfig, setTenantConfig] = (0, react_1.useState)(null);
    return (<TenantConfigContext.Provider value={{ tenantConfig, setTenantConfig }}>
            {children}
        </TenantConfigContext.Provider>);
};
exports.TenantConfigProvider = TenantConfigProvider;
const useTenantConfig = () => {
    const context = (0, react_1.useContext)(TenantConfigContext);
    if (!context) {
        throw new Error('useTenantConfig must be used within a TenantConfigProvider');
    }
    return context;
};
exports.useTenantConfig = useTenantConfig;
