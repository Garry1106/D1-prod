"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/components/sidebar/index");
const DashboardLayout = ({ children }) => {
    return (<div className="flex max-h-screen bg-gray-100">
      <index_1.Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>);
};
exports.default = DashboardLayout;
