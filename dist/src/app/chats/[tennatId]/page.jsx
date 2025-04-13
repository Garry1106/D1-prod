"use strict";
"use client"; // Mark this as a client component
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatPage;
const navigation_1 = require("next/navigation");
const ChatComponent_1 = __importDefault(require("../../../components/chat/ChatComponent"));
function ChatPage() {
    const pathname = (0, navigation_1.usePathname)(); // Get the current path
    console.log("Pathname:", pathname); // Debugging
    // Extract tenantId from the path (e.g., /chats/666 => 666)
    const tenantId = pathname === null || pathname === void 0 ? void 0 : pathname.split("/")[2]; // Adjust the index based on your URL structure
    console.log("Tenant ID in page.tsx:", tenantId); // Debugging
    if (!tenantId) {
        return <div>Tenant ID is missing</div>; // Handle the case where tenantId is undefined
    }
    return (<div>
      <ChatComponent_1.default tenantId={tenantId}/>
    </div>);
}
