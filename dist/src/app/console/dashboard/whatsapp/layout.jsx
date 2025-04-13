"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WhatsappLayout;
const google_1 = require("next/font/google");
const sidebar_1 = __importDefault(require("@/components/whatsapp/components/sidebar"));
require("../../../globals.css");
const TenantConfigContext_1 = require("@/context/whatsapp/TenantConfigContext");
const raleway = (0, google_1.Raleway)({ subsets: ['latin'] });
function WhatsappLayout({ children, }) {
    return (<TenantConfigContext_1.TenantConfigProvider>
            <div className={`flex h-screen bg-background font-sans ${raleway.className}`}>
                <sidebar_1.default />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </TenantConfigContext_1.TenantConfigProvider>);
}
