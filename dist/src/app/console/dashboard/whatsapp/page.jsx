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
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const navigation_1 = require("next/navigation");
const mongodb_1 = require("@/lib/mongodb");
const TenantConfigContext_1 = require("@/context/whatsapp/TenantConfigContext");
const use_user_1 = require("@/hooks/user/use-user");
// Demo WhatsApp data
const messages = [
    { sender: 'John Doe', message: 'Hey, how are you?', timestamp: '2024-11-12 10:00 AM' },
    { sender: 'Jane Smith', message: 'Can we reschedule the meeting?', timestamp: '2024-11-12 09:30 AM' },
    { sender: 'Alice Johnson', message: 'Here are the documents you requested.', timestamp: '2024-11-12 09:00 AM' },
    { sender: 'Bob Brown', message: 'Thanks for the update!', timestamp: '2024-11-12 08:45 AM' },
];
function WhatsAppDashboard({}) {
    const router = (0, navigation_1.useRouter)();
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    const [hasProduct, setHasProduct] = (0, react_1.useState)(null);
    const { hasPurchasedProduct, userDetails } = (0, use_user_1.useUserDetails)();
    const { tenantConfig, setTenantConfig } = (0, TenantConfigContext_1.useTenantConfig)(); // Using context for tenantConfig
    (0, react_1.useEffect)(() => {
        const fetchTenantConfig = async () => {
            if (userDetails === null || userDetails === void 0 ? void 0 : userDetails.userId) {
                const productStatus = await hasPurchasedProduct(userDetails.userId);
                setHasProduct((productStatus === null || productStatus === void 0 ? void 0 : productStatus.name) === "Whatsapp-bot");
                setIsLoaded(true);
            }
            if (!tenantConfig && (userDetails === null || userDetails === void 0 ? void 0 : userDetails.clerkId)) { // Avoid re-fetching if config is already set
                const fetchedConfig = await (0, mongodb_1.getTenantConfigByClerk)(userDetails.clerkId);
                console.log("Fetched Config is", fetchedConfig);
                const completeConfig = Object.assign({}, fetchedConfig);
                console.log("Complete Config is", completeConfig);
                setTenantConfig(completeConfig);
            }
        };
        fetchTenantConfig();
        setIsClient(true);
    }, [userDetails, tenantConfig, setTenantConfig]);
    console.log("Tenant Config in Context is", tenantConfig);
    if (hasProduct === false) {
        return (<div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <card_1.Card className="max-w-md w-full p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <lucide_react_1.ShieldAlert className="h-8 w-8 text-destructive" aria-hidden="true"/>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Restricted Access
            </h1>

            <p className="text-muted-foreground">
              You need to purchase WhatsApp-Bot to access this dashboard. Unlock all features and take your experience to the next level.
            </p>
          </div>

          <div className="space-y-4">
            <button_1.Button className="w-full font-medium" size="lg" onClick={() => router.push('/console/services/whatsapp')} aria-label="Purchase WhatsAppBot">
              Purchase Now
              <lucide_react_1.ExternalLink className="ml-2 h-4 w-4" aria-hidden="true"/>
            </button_1.Button>

            <button_1.Button variant="outline" className="w-full" onClick={() => window.history.back()} aria-label="Go back to previous page">
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
            <lucide_react_1.MessageCircle className="w-6 h-6 text-[#41b658]"/>
            <h1 className="text-3xl font-semibold text-[#41b658]">WhatsApp Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600 mt-2 font-bold">Welcome back, {(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.businessName) || 'User'}</p>
          <p className="text-base text-gray-600 mt-2">Get an overview of your WhatsApp activity, messages, and user engagement.</p>
        </div>
      </framer_motion_1.motion.header>

      {/* Recent Messages Section */}
      {isClient && (<framer_motion_1.motion.section className="bg-white shadow-sm rounded-lg p-4 mt-3" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#252422' }}>Recent Messages</h2>
          <div className="overflow-x-auto">
            <table_1.Table>
              <table_1.TableHeader>
                <table_1.TableRow>
                  <table_1.TableHead>Sender</table_1.TableHead>
                  <table_1.TableHead>Message</table_1.TableHead>
                  <table_1.TableHead>Timestamp</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {messages.map((message, index) => (<table_1.TableRow key={index} className="border-t">
                    <table_1.TableCell>{message.sender}</table_1.TableCell>
                    <table_1.TableCell>{message.message}</table_1.TableCell>
                    <table_1.TableCell>{message.timestamp}</table_1.TableCell>
                  </table_1.TableRow>))}
              </table_1.TableBody>
            </table_1.Table>
          </div>
        </framer_motion_1.motion.section>)}


      {/* Financial Overview and Customer Order Section */}
      {isClient && ( // Render only on the client
        <framer_motion_1.motion.section className="grid grid-cols-3 gap-4 mt-3" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.4 }}>
          {/* Paid Invoices and Funds Received */}
          <framer_motion_1.motion.div className="col-span-1 flex flex-col space-y-4 bg-white shadow-md rounded-lg p-6" // Added shadow and white background
         initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.6 }}>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#252422' }}>Total Users</h3>
              <p className="text-2xl font-bold" style={{ color: '#41b658' }}>3000</p>
              <p className="text-sm" style={{ color: '#666' }}>Current  Year</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#252422' }}>Subscriptions</h3>
              <p className="text-2xl font-bold" style={{ color: '#41b658' }}>1,201</p>
              <p className="text-sm" style={{ color: '#666' }}>Active Subscriptions</p>
            </div>
          </framer_motion_1.motion.div>

          {/* Customer Order Table */}
          <framer_motion_1.motion.div className="col-span-2 bg-white shadow-md rounded-lg p-6" // Added shadow and white background
         initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.8 }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#252422' }}>Recent Campaigns</h2>
            <div className="overflow-y-auto max-h-48">
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead style={{ color: '#252422' }}>Campaign</table_1.TableHead>
                    <table_1.TableHead style={{ color: '#252422' }}>Status</table_1.TableHead>
                    <table_1.TableHead style={{ color: '#252422' }}>Engagement</table_1.TableHead>
                    <table_1.TableHead style={{ color: '#252422' }}>Messages Sent</table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  <table_1.TableRow>
                    <table_1.TableCell style={{ color: '#403D39' }}>Summer Sale</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>Active</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>72%</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>1,200</table_1.TableCell>
                  </table_1.TableRow>
                  <table_1.TableRow>
                    <table_1.TableCell style={{ color: '#403D39' }}>New Year Offer</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>Completed</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>85%</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>2,500</table_1.TableCell>
                  </table_1.TableRow>
                  <table_1.TableRow>
                    <table_1.TableCell style={{ color: '#403D39' }}>Product Launch</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>Pending</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>45%</table_1.TableCell>
                    <table_1.TableCell style={{ color: '#403D39' }}>800</table_1.TableCell>
                  </table_1.TableRow>
                </table_1.TableBody>
              </table_1.Table>
            </div>
          </framer_motion_1.motion.div>
        </framer_motion_1.motion.section>)}

    </framer_motion_1.motion.div>);
}
