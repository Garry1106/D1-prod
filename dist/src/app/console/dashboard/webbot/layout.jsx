"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WeBotLayout;
const google_1 = require("next/font/google");
const index_1 = __importDefault(require("@/components/webbot/sidebar/index"));
require("../../../globals.css");
const raleway = (0, google_1.Raleway)({ subsets: ['latin'] });
function WeBotLayout({ children, }) {
    return (<div className={`flex h-screen bg-background font-sans ${raleway.className}`}>
            <index_1.default />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>);
}
