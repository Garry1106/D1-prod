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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const button_1 = require("@/components/ui/button");
const Whatsapp_1 = __importDefault(require("@/components/forms/Whatsapp"));
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const pricingOptions = [
    {
        id: 1,
        name: 'Assist',
        price: '$29 per/month',
        description: 'Start a free trial',
        features: [
            'Shared inbox',
            'Basic chatbots and automations',
            'AI Compose',
            'Ticketing system',
            'Public help center',
            'Unlimited articles & collections',
        ],
        isPopular: false,
    },
    {
        id: 2,
        name: 'Automate',
        price: '$85 per/month',
        description: 'Start a free trial',
        features: [
            'Shared inbox',
            'Basic chatbots and automations',
            'AI Compose',
            'Ticketing system',
            'Public help center',
            'Unlimited articles & collections',
            'Multiple team inboxes',
            'Workflows for advanced automations',
        ],
        isPopular: true,
    },
    {
        id: 3,
        name: 'Optimize',
        price: '$132 per/month',
        description: 'Start a free trial',
        features: [
            'Shared inbox',
            'Basic chatbots and automations',
            'AI Compose',
            'Ticketing system',
            'Public help center',
            'Unlimited articles & collections',
            'Multiple team inboxes',
            'Workflows for advanced automations',
            'Lite seats (50 included)',
        ],
        isPopular: false,
    },
];
const featuresList = [
    'Shared inbox',
    'Basic chatbots and automations',
    'AI Compose',
    'Ticketing system',
    'Public help center',
    'Unlimited articles & collections',
    'Multiple team inboxes',
    'Workflows for advanced automations',
    'Lite seats',
    'Custom integrations',
    'Dedicated support',
];
const ProductPage = () => {
    const [isProcced, setIsProcced] = (0, react_1.useState)(false);
    const [selectedPlan, setSelectedPlan] = (0, react_1.useState)(null);
    const handlePricingClick = (id) => {
        if (typeof id === 'number') {
            setSelectedPlan(id);
        }
        else {
            // Handle custom plan selection
            setSelectedPlan(null);
        }
    };
    return (<div className="bg-white text-black p-0 min-h-screen">
      {!isProcced ? (<div className='p-8'>
          <header className="flex justify-between items-center mb-6">
            <div>
              <framer_motion_1.motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <lucide_react_1.MessageCircle className='text-[#EB6C33] w-8 h-8'/>Whatsapp AI Chatbot
              </framer_motion_1.motion.h1>
              <framer_motion_1.motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-base text-gray-600 mt-2">
                Get an overview of the latest sales, products, and user activity.
              </framer_motion_1.motion.p>
            </div>
          </header>

          <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6 w-full">
            <h2 className="text-2xl font-bold mb-4">How to Get Started: Tutorial</h2>
            <iframe width="100%" height="550" src="https://www.youtube.com/embed/zAfLcKrbSps" title="YouTube video" frameBorder="0" allowFullScreen className="rounded-2xl mx-auto shadow-2xl"></iframe>
          </framer_motion_1.motion.div>

          {/* Added Subscription Pricing Cards */}
          <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="my-8">
            <h2 className="text-3xl font-bold text-center text-black">Choose Your Plan</h2>
            <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto px-4">
              Select the plan that best fits your business needs. Whether you're just getting started or scaling your operations, we have a solution for you. All plans include powerful features to help you automate, optimize, and grow.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto px-6">
              {pricingOptions.map((plan) => (<framer_motion_1.motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 * pricingOptions.indexOf(plan) }} className={`bg-white rounded-xl shadow-xl overflow-hidden border-2 transform hover:scale-105 transition-all duration-300 ${selectedPlan === plan.id ? 'border-[#EB6C33]' : 'border-gray-200'}`}>
                  {/* Card header - Reduced padding */}
                  <div className={`p-3 text-center ${selectedPlan === plan.id ? 'bg-[#EB6C33]/10' : 'bg-gray-50'}`}>
                    <h3 className="text-xl font-semibold text-black">{plan.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{plan.price}</p>
                  </div>

                  {/* Features list - Compact spacing */}
                  <div className="p-3">
                    <ul className="space-y-1.5">
                      {featuresList.map((feature, index) => (<li key={index} className="flex items-center">
                          {plan.features.includes(feature) ? (<svg className="w-5 h-5 text-[#EB6C33] mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>) : (<svg className="w-5 h-5 text-gray-300 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>)}
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>))}
                    </ul>
                  </div>

                  
                </framer_motion_1.motion.div>))}
              
              
            </div>
          </framer_motion_1.motion.div>

          <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.0 }} className="mt-6 mb-4">
            <h1 className="text-2xl font-bold ">Get Started</h1>
            <h3 className="text-xl font-medium ">Next Step: Business Form</h3>
            <p className="text-sm text-gray-600">Fill out the form to proceed with the next steps in setting up your WhatsApp AI Chatbot.</p>
            <button_1.Button className="mt-2 bg-[#EB6C33] text-white" onClick={() => setIsProcced(true)}>
              Click here to Proceed
            </button_1.Button>
          </framer_motion_1.motion.div>
        </div>) : (<framer_motion_1.AnimatePresence>
          <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <Whatsapp_1.default />
          </framer_motion_1.motion.div>
        </framer_motion_1.AnimatePresence>)}
    </div>);
};
exports.default = ProductPage;
