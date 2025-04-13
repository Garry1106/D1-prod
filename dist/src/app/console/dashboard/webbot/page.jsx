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
exports.default = WhatsAppDashboard;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const table_1 = require("@/components/ui/table");
const lucide_react_1 = require("lucide-react");
const use_user_1 = require("@/hooks/user/use-user");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const navigation_1 = require("next/navigation");
const messages = [
    { sender: 'John Doe', message: 'Hey, how are you?', timestamp: '2024-11-12 10:00 AM' },
    { sender: 'Jane Smith', message: 'Can we reschedule the meeting?', timestamp: '2024-11-12 09:30 AM' },
    { sender: 'Alice Johnson', message: 'Here are the documents you requested.', timestamp: '2024-11-12 09:00 AM' },
    { sender: 'Bob Brown', message: 'Thanks for the update!', timestamp: '2024-11-12 08:45 AM' },
];
function WhatsAppDashboard({}) {
    const router = (0, navigation_1.useRouter)();
    const [isClient, setIsClient] = (0, react_1.useState)(true);
    const [hasProduct, setHasProduct] = (0, react_1.useState)(true);
    const { hasPurchasedProduct, userDetails } = (0, use_user_1.useUserDetails)();
    if (hasProduct === false) {
        return (<div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
        <card_1.Card className="max-w-md w-full p-6 space-y-6 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-blue-600/10 rounded-full">
              <lucide_react_1.ShieldAlert className="h-8 w-8 text-blue-600" aria-hidden="true"/>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-blue-600">
              Restricted Access
            </h1>

            <p className="text-gray-600">
              You need to purchase WhatsApp-Bot to access this dashboard. Unlock all features and take your experience to the next level.
            </p>
          </div>

          <div className="space-y-4">
            <button_1.Button className="w-full font-medium bg-blue-600 hover:bg-blue-600/90 text-white" size="lg" onClick={() => router.push('/console/services/whatsapp')} aria-label="Purchase WhatsAppBot">
              Purchase Now
              <lucide_react_1.ExternalLink className="ml-2 h-4 w-4" aria-hidden="true"/>
            </button_1.Button>

            <button_1.Button variant="outline" className="w-full border-blue-600/20 text-blue-600 hover:bg-blue-600/5" onClick={() => window.history.back()} aria-label="Go back to previous page">
              Go Back
            </button_1.Button>
          </div>
        </card_1.Card>
      </div>);
    }
    return (<framer_motion_1.motion.div className="p-4 min-h-screen bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Header Section */}
      <framer_motion_1.motion.header className="flex justify-between items-center mb-4 bg-white shadow-sm rounded-lg p-6" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div>
          <div className="flex items-center gap-2">
            <lucide_react_1.LaptopMinimal className="w-6 h-6 text-blue-600"/>
            <h1 className="text-3xl font-semibold text-blue-600">WebChatbot Dashboard</h1>
          </div>
          <p className="text-lg text-gray-700 mt-2 font-bold">Welcome back, User</p>
          <p className="text-base text-gray-600 mt-2">Get an overview of your WhatsApp activity, messages, and user engagement.</p>
        </div>
      </framer_motion_1.motion.header>

      {/* Recent Messages Section */}
      {isClient && (<framer_motion_1.motion.section className="bg-white shadow-sm rounded-lg p-4 mt-3" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Recent Messages</h2>
          <div className="overflow-x-auto">
            <table_1.Table>
              <table_1.TableHeader>
                <table_1.TableRow className="bg-blue-600/5">
                  <table_1.TableHead className="text-blue-600">Sender</table_1.TableHead>
                  <table_1.TableHead className="text-blue-600">Message</table_1.TableHead>
                  <table_1.TableHead className="text-blue-600">Timestamp</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {messages.map((message, index) => (<table_1.TableRow key={index} className="border-t hover:bg-blue-600/5">
                    <table_1.TableCell className="text-gray-700">{message.sender}</table_1.TableCell>
                    <table_1.TableCell className="text-gray-700">{message.message}</table_1.TableCell>
                    <table_1.TableCell className="text-gray-700">{message.timestamp}</table_1.TableCell>
                  </table_1.TableRow>))}
              </table_1.TableBody>
            </table_1.Table>
          </div>
        </framer_motion_1.motion.section>)}

      {/* Financial Overview and Customer Order Section */}
      {isClient && (<framer_motion_1.motion.section className="grid grid-cols-3 gap-4 mt-3" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.4 }}>
          {/* Stats Cards */}
          <framer_motion_1.motion.div className="col-span-1 flex flex-col space-y-4 bg-white shadow-md rounded-lg p-6" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.6 }}>
            <div>
              <h3 className="text-lg font-semibold text-blue-600">Total Users</h3>
              <p className="text-2xl font-bold text-blue-600">3000</p>
              <p className="text-sm text-gray-600">Current Year</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-600">Subscriptions</h3>
              <p className="text-2xl font-bold text-blue-600">1,201</p>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
            </div>
          </framer_motion_1.motion.div>

          {/* Campaigns Table */}
          <framer_motion_1.motion.div className="col-span-2 bg-white shadow-md rounded-lg p-6" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.8 }}>
            <h2 className="text-lg font-semibold mb-2 text-blue-600">Recent Campaigns</h2>
            <div className="overflow-y-auto max-h-48">
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow className="bg-blue-600/5">
                    <table_1.TableHead className="text-blue-600">Campaign</table_1.TableHead>
                    <table_1.TableHead className="text-blue-600">Status</table_1.TableHead>
                    <table_1.TableHead className="text-blue-600">Engagement</table_1.TableHead>
                    <table_1.TableHead className="text-blue-600">Messages Sent</table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  <table_1.TableRow className="hover:bg-blue-600/5">
                    <table_1.TableCell className="text-gray-700">Summer Sale</table_1.TableCell>
                    <table_1.TableCell className="text-blue-600">Active</table_1.TableCell>
                    <table_1.TableCell className="text-gray-700">72%</table_1.TableCell>
                    <table_1.TableCell className="text-gray-700">1,200</table_1.TableCell>
                  </table_1.TableRow>
                  <table_1.TableRow className="hover:bg-blue-600/5">
                    <table_1.TableCell className="text-gray-700">New Year Offer</table_1.TableCell>
                    <table_1.TableCell className="text-blue-600">Completed</table_1.TableCell>
                    <table_1.TableCell className="text-gray-700">85%</table_1.TableCell>
                    <table_1.TableCell className="text-gray-700">2,500</table_1.TableCell>
                  </table_1.TableRow>
                  <table_1.TableRow className="hover:bg-blue-600/5">
                    <table_1.TableCell className="text-gray-700">Product Launch</table_1.TableCell>
                    <table_1.TableCell className="text-blue-600">Pending</table_1.TableCell>
                    <table_1.TableCell className="text-gray-700">45%</table_1.TableCell>
                    <table_1.TableCell className="text-gray-700">800</table_1.TableCell>
                  </table_1.TableRow>
                </table_1.TableBody>
              </table_1.Table>
            </div>
          </framer_motion_1.motion.div>
        </framer_motion_1.motion.section>)}
    </framer_motion_1.motion.div>);
}
