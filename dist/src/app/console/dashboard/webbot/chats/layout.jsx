"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatLayout;
function ChatLayout({ children, }) {
    return (<div className="flex h-screen bg-gray-50">
        {children}
      </div>);
}
