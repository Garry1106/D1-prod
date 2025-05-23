"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfilePage;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const skeleton_1 = require("@/components/ui/skeleton");
const label_1 = require("@/components/ui/label");
const tabs_1 = require("@/components/ui/tabs");
const google_1 = require("next/font/google");
const lucide_react_1 = require("lucide-react");
const tooltip_1 = require("@/components/ui/tooltip");
const progress_1 = require("@/components/ui/progress");
const avatar_1 = require("@/components/ui/avatar");
const separator_1 = require("@/components/ui/separator");
// Initialize fonts
const raleway = (0, google_1.Raleway)({
    subsets: ['latin'],
    variable: '--font-raleway',
});
const inter = (0, google_1.Inter)({
    subsets: ['latin'],
    variable: '--font-inter',
});
// Sample user data
const userData = {
    _id: "65f4a3b7c4e8c0a3b7c4e8c0",
    clerkId: "user_2Xj8HjKMp9F5tY7Z",
    businessName: "TechInnovate Solutions",
    selectOption: "Enterprise",
    country: "United States",
    currency: "USD",
    subscriptionLevel: "Premium",
    price: 199.99,
    subscriptionExpiry: new Date("2025-12-31"),
    waba_id: "183754209871654",
    displayPhoneNumber: "+1 (555) 123-4567",
    phoneNumberId: "109827365142938",
    accessToken: "EAAGm3bZB7jxABO9zu...",
    appId: "5437219608534",
    appSecret: "a1b2c3d4e5f6g7h8i9j0...",
    text: true,
    tts: true,
    aiResponse: true,
    image: true,
    audio: true,
    document: true,
    video: false,
    sticker: false,
    interactive: true,
    retrieval: true,
    messagesCount: 10000,
    ttsCount: 5000,
    imagesCount: 2000,
    audiosCount: 1000,
    documentsCount: 500,
    videosCount: 0,
};
// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};
const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};
// Secure field component with reveal option
const SecureField = ({ label, value, icon }) => {
    const [revealed, setRevealed] = (0, react_1.useState)(false);
    const displayValue = revealed ? value : value.substring(0, 5) + "•".repeat(10);
    return (<framer_motion_1.motion.div className="mb-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#EB6C33]/30 shadow-sm hover:shadow transition-all" whileHover={{ y: -2 }}>
      <div className="flex items-center mb-2">
        <div className="text-[#EB6C33] mr-2">{icon}</div>
        <label_1.Label className="text-sm font-semibold text-gray-700">{label}</label_1.Label>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-base font-medium overflow-hidden text-ellipsis">{displayValue}</div>
        <button onClick={() => setRevealed(!revealed)} className="text-xs px-3 py-1 rounded-full bg-[#EB6C33]/10 text-[#EB6C33] hover:bg-[#EB6C33]/20 transition-colors">
          {revealed ? "Hide" : "Show"}
        </button>
      </div>
    </framer_motion_1.motion.div>);
};
// Field display component with icon
const Field = ({ label, value, icon }) => {
    let displayValue = value;
    if (value instanceof Date) {
        displayValue = value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    else if (typeof value === 'boolean') {
        return (<framer_motion_1.motion.div className="mb-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#EB6C33]/30 shadow-sm hover:shadow transition-all" whileHover={{ y: -2 }}>
        <div className="flex items-center mb-2">
          <div className="text-[#EB6C33] mr-2">{icon}</div>
          <label_1.Label className="text-sm font-semibold text-gray-700">{label}</label_1.Label>
        </div>
        <div className="flex items-center">
          {value ? (<div className="flex items-center bg-[#EB6C33]/10 text-[#EB6C33] px-3 py-1 rounded-full">
              <lucide_react_1.CheckCircle className="h-4 w-4 mr-1"/>
              <span className="font-medium text-sm">Enabled</span>
            </div>) : (<div className="flex items-center bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              <lucide_react_1.XCircle className="h-4 w-4 mr-1"/>
              <span className="font-medium text-sm">Disabled</span>
            </div>)}
        </div>
      </framer_motion_1.motion.div>);
    }
    else if (typeof value === 'number' && label.includes('price')) {
        displayValue = `$${value.toFixed(2)}`;
    }
    return (<framer_motion_1.motion.div className="mb-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#EB6C33]/30 shadow-sm hover:shadow transition-all" whileHover={{ y: -2 }}>
      <div className="flex items-center mb-2">
        <div className="text-[#EB6C33] mr-2">{icon}</div>
        <label_1.Label className="text-sm font-semibold text-gray-700">{label}</label_1.Label>
      </div>
      <div className="text-base font-medium text-gray-800">{displayValue}</div>
    </framer_motion_1.motion.div>);
};
// Skeleton loader for fields
const FieldSkeleton = () => (<div className="mb-4 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
    <div className="flex items-center mb-2">
      <skeleton_1.Skeleton className="h-5 w-5 rounded-full mr-2"/>
      <skeleton_1.Skeleton className="h-4 w-28"/>
    </div>
    <skeleton_1.Skeleton className="h-6 w-full max-w-xs mt-2"/>
  </div>);
// Feature badge component with tooltip
const FeatureBadge = ({ name, enabled, icon }) => (<tooltip_1.TooltipProvider>
    <tooltip_1.Tooltip>
      <tooltip_1.TooltipTrigger asChild>
        <framer_motion_1.motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <badge_1.Badge className={`mr-2 mb-2 py-2 px-3 rounded-full ${enabled
        ? 'bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white'
        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center">
              <span className="mr-1.5">{icon}</span>
              {name}
            </div>
          </badge_1.Badge>
        </framer_motion_1.motion.div>
      </tooltip_1.TooltipTrigger>
      <tooltip_1.TooltipContent className="bg-gray-800 text-white">
        <p>{enabled ? `${name} is enabled` : `${name} is disabled`}</p>
      </tooltip_1.TooltipContent>
    </tooltip_1.Tooltip>
  </tooltip_1.TooltipProvider>);
// Usage progress component
const UsageProgress = ({ label, used, total, icon }) => {
    const percentage = Math.min(100, Math.round((used / total) * 100)) || 0;
    const isHigh = percentage > 80;
    return (<framer_motion_1.motion.div className="mb-6 p-4 rounded-xl border border-gray-100 hover:border-[#EB6C33]/30 shadow-sm hover:shadow bg-white transition-all" whileHover={{ y: -2 }}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className={`mr-2 ${isHigh ? 'text-amber-500' : 'text-[#EB6C33]'}`}>{icon}</span>
          <label_1.Label className={`text-sm font-semibold ${isHigh ? 'text-amber-500' : 'text-gray-700'}`}>{label}</label_1.Label>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">
            {used.toLocaleString()} / {total.toLocaleString()}
          </span>
          {isHigh && (<lucide_react_1.AlertTriangle className="h-4 w-4 text-amber-500 ml-2"/>)}
        </div>
      </div>
      <progress_1.Progress value={percentage} className="h-2.5 rounded-full" style={{
            backgroundColor: isHigh ? '#FEF3C7' : '#E5E7EB',
            opacity: 0.5
        }}/>
      <div className="mt-2 text-xs font-medium flex justify-between items-center">
        <span className={isHigh ? 'text-amber-500' : 'text-gray-500'}>
          {percentage}% used
        </span>
        <span className="text-gray-500">
          {(total - used).toLocaleString()} remaining
        </span>
      </div>
    </framer_motion_1.motion.div>);
};
// Subscription status component
const SubscriptionStatus = ({ expiryDate, level, price }) => {
    const currentDate = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    const isLow = daysUntilExpiry < 30;
    return (<framer_motion_1.motion.div className={`p-4 rounded-xl shadow-sm border ${isLow ? 'bg-amber-50 border-amber-200' : 'bg-[#EB6C33]/5 border-[#EB6C33]/20'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-bold ${isLow ? 'text-amber-600' : 'text-[#EB6C33]'}`}>
            {level} Plan
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            ${price.toFixed(2)}/month
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isLow ? 'bg-amber-100 text-amber-600' : 'bg-[#EB6C33]/10 text-[#EB6C33]'}`}>
          {daysUntilExpiry} days left
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${isLow ? 'bg-amber-500' : 'bg-[#EB6C33]'}`} style={{ width: `${Math.min(100, (daysUntilExpiry / 365) * 100)}%` }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Today</span>
          <span>{expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <button className={`w-full py-2 rounded-lg text-white font-medium text-sm ${isLow ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#EB6C33] hover:bg-[#EB6C33]/90'} transition-colors`}>
          Renew Subscription
        </button>
      </div>
    </framer_motion_1.motion.div>);
};
// Icon mapping for feature types
const featureIcons = {
    text: <lucide_react_1.MessageSquare size={16}/>,
    tts: <lucide_react_1.Headphones size={16}/>,
    aiResponse: <lucide_react_1.MessageCircle size={16}/>,
    image: <lucide_react_1.Image size={16}/>,
    audio: <lucide_react_1.Headphones size={16}/>,
    document: <lucide_react_1.File size={16}/>,
    video: <lucide_react_1.Video size={16}/>,
    sticker: <lucide_react_1.Sticker size={16}/>,
    interactive: <lucide_react_1.MessageCircle size={16}/>,
    retrieval: <lucide_react_1.Database size={16}/>
};
// Main component
function ProfilePage() {
    var _a;
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [user, setUser] = (0, react_1.useState)(null);
    // Simulate data loading
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            setUser(userData);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);
    // Format features for display
    const features = user ? [
        { name: 'Text', enabled: user.text, icon: featureIcons.text },
        { name: 'TTS', enabled: user.tts, icon: featureIcons.tts },
        { name: 'AI Response', enabled: user.aiResponse, icon: featureIcons.aiResponse },
        { name: 'Image', enabled: user.image, icon: featureIcons.image },
        { name: 'Audio', enabled: user.audio, icon: featureIcons.audio },
        { name: 'Document', enabled: user.document, icon: featureIcons.document },
        { name: 'Video', enabled: user.video, icon: featureIcons.video },
        { name: 'Sticker', enabled: user.sticker, icon: featureIcons.sticker },
        { name: 'Interactive', enabled: user.interactive, icon: featureIcons.interactive },
        { name: 'Retrieval', enabled: user.retrieval, icon: featureIcons.retrieval },
    ] : [];
    // Count enabled features
    const enabledFeaturesCount = features.filter(f => f.enabled).length;
    return (<div className={`min-h-screen bg-gradient-to-br from-white to-gray-50 p-6 ${raleway.className} ${inter.variable}`}>
      <div className="max-w-6xl mx-auto">
        {loading ? (
        // Skeleton loader when loading
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <skeleton_1.Skeleton className="h-12 w-64"/>
              <skeleton_1.Skeleton className="h-16 w-16 rounded-full"/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <skeleton_1.Skeleton className="h-48 w-full rounded-xl"/>
                <skeleton_1.Skeleton className="h-64 w-full rounded-xl mt-6"/>
              </div>
              <div className="md:col-span-2">
                <skeleton_1.Skeleton className="h-12 w-full rounded-lg mb-4"/>
                <skeleton_1.Skeleton className="h-96 w-full rounded-xl"/>
              </div>
            </div>
          </div>) : (
        // Actual content when loaded
        <framer_motion_1.AnimatePresence>
            <framer_motion_1.motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
              {/* Profile Header with User Info */}
              <framer_motion_1.motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center mb-4 sm:mb-0">
                  <avatar_1.Avatar className="h-16 w-16 mr-4 border-2 border-[#EB6C33] shadow-lg">
                    <avatar_1.AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user === null || user === void 0 ? void 0 : user.businessName}`} alt={user === null || user === void 0 ? void 0 : user.businessName}/>
                    <avatar_1.AvatarFallback className="bg-[#EB6C33] text-white text-xl">
                      {((_a = user === null || user === void 0 ? void 0 : user.businessName) === null || _a === void 0 ? void 0 : _a.split(' ').map(word => word[0]).join('')) || 'TS'}
                    </avatar_1.AvatarFallback>
                  </avatar_1.Avatar>
                  
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{(user === null || user === void 0 ? void 0 : user.businessName) || ''}</h1>
                    <div className="flex items-center mt-1">
                      <badge_1.Badge className="bg-[#EB6C33]/10 text-[#EB6C33] hover:bg-[#EB6C33]/20 border-none">
                        {user === null || user === void 0 ? void 0 : user.selectOption}
                      </badge_1.Badge>
                      <separator_1.Separator className="mx-2 h-4 w-px bg-gray-300" orientation="vertical"/>
                      <span className="text-sm text-gray-500">{user === null || user === void 0 ? void 0 : user.country}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <badge_1.Badge className="bg-[#EB6C33] text-white hover:bg-[#EB6C33]/90">
                      {user === null || user === void 0 ? void 0 : user.subscriptionLevel}
                    </badge_1.Badge>
                    <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                      ID: {user === null || user === void 0 ? void 0 : user._id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </framer_motion_1.motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <framer_motion_1.motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
                  {/* Subscription Card */}
                  <framer_motion_1.motion.div variants={cardVariants}>
                    {user && (<SubscriptionStatus expiryDate={user.subscriptionExpiry} level={user.subscriptionLevel} price={user.price}/>)}
                  </framer_motion_1.motion.div>
                  
                  {/* WhatsApp API Information */}
                  <framer_motion_1.motion.div variants={cardVariants}>
                    <card_1.Card className="border-gray-200 shadow-sm overflow-hidden">
                      <card_1.CardHeader className="bg-gradient-to-r from-[#EB6C33]/10 to-transparent pb-3">
                        <div className="flex justify-between items-center">
                          <card_1.CardTitle className="text-lg font-bold text-gray-800">API Credentials</card_1.CardTitle>
                          <lucide_react_1.Lock className="h-5 w-5 text-[#EB6C33]"/>
                        </div>
                      </card_1.CardHeader>
                      <card_1.CardContent className="pt-4">
                        <SecureField label="WABA ID" value={(user === null || user === void 0 ? void 0 : user.waba_id) || ''} icon={<lucide_react_1.Key size={18}/>}/>
                        <Field label="Phone Number" value={(user === null || user === void 0 ? void 0 : user.displayPhoneNumber) || ''} icon={<lucide_react_1.Phone size={18}/>}/>
                        <SecureField label="Phone ID" value={(user === null || user === void 0 ? void 0 : user.phoneNumberId) || ''} icon={<lucide_react_1.Key size={18}/>}/>
                        
                        <separator_1.Separator className="my-4"/>
                        
                        <div className="text-center">
                          <button className="text-sm text-[#EB6C33] hover:text-[#EB6C33]/80 font-medium flex items-center justify-center w-full">
                            View all credentials
                            <lucide_react_1.ChevronRight className="h-4 w-4 ml-1"/>
                          </button>
                        </div>
                      </card_1.CardContent>
                    </card_1.Card>
                  </framer_motion_1.motion.div>
                  
                  {/* Features Overview Card */}
                  <framer_motion_1.motion.div variants={cardVariants}>
                    <card_1.Card className="border-gray-200 shadow-sm overflow-hidden">
                      <card_1.CardHeader className="bg-gradient-to-r from-[#EB6C33]/10 to-transparent pb-3">
                        <div className="flex justify-between items-center">
                          <card_1.CardTitle className="text-lg font-bold text-gray-800">Features Overview</card_1.CardTitle>
                          <div className="flex items-center bg-[#EB6C33]/10 text-[#EB6C33] px-2 py-1 rounded-full text-xs font-semibold">
                            {enabledFeaturesCount}/{features.length} enabled
                          </div>
                        </div>
                      </card_1.CardHeader>
                      <card_1.CardContent className="pt-4">
                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                          {features.map((feature, index) => (<div key={index} className={`flex items-center p-2 rounded-lg ${feature.enabled
                    ? 'bg-[#EB6C33]/5 border border-[#EB6C33]/10'
                    : 'bg-gray-50 border border-gray-100'}`}>
                              {feature.enabled ? (<lucide_react_1.CheckCircle className="h-4 w-4 text-[#EB6C33] mr-2 flex-shrink-0"/>) : (<lucide_react_1.XCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"/>)}
                              <span className="flex items-center">
                                <span className={feature.enabled ? 'text-[#EB6C33] mr-2' : 'text-gray-400 mr-2'}>
                                  {feature.icon}
                                </span>
                                <span className={`font-medium text-sm ${feature.enabled ? 'text-gray-800' : 'text-gray-500'}`}>
                                  {feature.name}
                                </span>
                              </span>
                            </div>))}
                        </div>
                      </card_1.CardContent>
                    </card_1.Card>
                  </framer_motion_1.motion.div>
                </framer_motion_1.motion.div>
                
                {/* Main Content Area */}
                <framer_motion_1.motion.div variants={itemVariants} className="md:col-span-2">
                  <tabs_1.Tabs defaultValue="usage" className="w-full">
                    <tabs_1.TabsList className="w-full bg-white p-1 rounded-xl mb-6 border border-gray-200">
                      <tabs_1.TabsTrigger value="usage" className="flex-1 rounded-lg data-[state=active]:bg-[#EB6C33] data-[state=active]:text-white">
                        <lucide_react_1.BarChart className="h-4 w-4 mr-2"/>
                        Usage
                      </tabs_1.TabsTrigger>
                      <tabs_1.TabsTrigger value="account" className="flex-1 rounded-lg data-[state=active]:bg-[#EB6C33] data-[state=active]:text-white">
                        <lucide_react_1.User className="h-4 w-4 mr-2"/>
                        Account
                      </tabs_1.TabsTrigger>
                      <tabs_1.TabsTrigger value="settings" className="flex-1 rounded-lg data-[state=active]:bg-[#EB6C33] data-[state=active]:text-white">
                        <lucide_react_1.Settings className="h-4 w-4 mr-2"/>
                        Settings
                      </tabs_1.TabsTrigger>
                    </tabs_1.TabsList>
                    
                    <tabs_1.TabsContent value="usage" className="mt-0">
                      <card_1.Card className="border-gray-200 shadow-sm">
                        <card_1.CardHeader className="bg-gradient-to-r from-[#EB6C33]/10 to-transparent">
                          <div className="flex justify-between items-center">
                            <card_1.CardTitle className="text-xl font-bold text-gray-800">Usage & Limits</card_1.CardTitle>
                            <badge_1.Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                              {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </badge_1.Badge>
                          </div>
                          <card_1.CardDescription>Current usage against your plan limits</card_1.CardDescription>
                        </card_1.CardHeader>
                        <card_1.CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <UsageProgress label="Messages" used={(user === null || user === void 0 ? void 0 : user.messagesCount) || 0} total={10000} icon={<lucide_react_1.MessageSquare size={18}/>}/>
                            <UsageProgress label="Text-to-Speech" used={(user === null || user === void 0 ? void 0 : user.ttsCount) || 0} total={5000} icon={<lucide_react_1.Headphones size={18}/>}/>
                            <UsageProgress label="Images" used={(user === null || user === void 0 ? void 0 : user.imagesCount) || 0} total={3000} icon={<lucide_react_1.Image size={18}/>}/>
                            <UsageProgress label="Audio" used={(user === null || user === void 0 ? void 0 : user.audiosCount) || 0} total={2000} icon={<lucide_react_1.Headphones size={18}/>}/>
                            <UsageProgress label="Documents" used={(user === null || user === void 0 ? void 0 : user.documentsCount) || 0} total={1000} icon={<lucide_react_1.File size={18}/>}/>
                            <UsageProgress label="Videos" used={(user === null || user === void 0 ? void 0 : user.videosCount) || 0} total={500} icon={<lucide_react_1.Video size={18}/>}/>
                          </div>
                          
                          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="flex items-start">
                              <lucide_react_1.Info className="h-5 w-5 text-[#EB6C33] mr-3 mt-0.5"/>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-800">Usage Information</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Usage counters reset on the first day of each month. Upgrade your plan to increase limits.
                                </p>
                              </div>
                            </div>
                          </div>
                        </card_1.CardContent>
                      </card_1.Card>
                    </tabs_1.TabsContent>
                    
                    <tabs_1.TabsContent value="account" className="mt-0">
                      <card_1.Card className="border-gray-200 shadow-sm">
                        <card_1.CardHeader className="bg-gradient-to-r from-[#EB6C33]/10 to-transparent">
                          <card_1.CardTitle className="text-xl font-bold text-gray-800">Account Information</card_1.CardTitle>
                          <card_1.CardDescription>Your business and subscription details</card_1.CardDescription>
                        </card_1.CardHeader>
                        <card_1.CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Business Name" value={(user === null || user === void 0 ? void 0 : user.businessName) || ''} icon={<lucide_react_1.Building size={18}/>}/>
                            <Field label="Account Type" value={(user === null || user === void 0 ? void 0 : user.selectOption) || ''} icon={<lucide_react_1.Database size={18}/>}/>
                            <Field label="Country" value={(user === null || user === void 0 ? void 0 : user.country) || ''} icon={<lucide_react_1.Globe size={18}/>}/>
                            <Field label="Currency" value={(user === null || user === void 0 ? void 0 : user.currency) || ''} icon={<lucide_react_1.CreditCard size={18}/>}/>
                            <Field label="Clerk ID" value={(user === null || user === void 0 ? void 0 : user.clerkId) || ''} icon={<lucide_react_1.User size={18}/>}/>
                            <Field label="Subscription Level" value={(user === null || user === void 0 ? void 0 : user.subscriptionLevel) || ''} icon={<lucide_react_1.Database size={18}/>}/>
                          </div>
                          
                          <separator_1.Separator className="my-6"/>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">API Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <SecureField label="App ID" value={(user === null || user === void 0 ? void 0 : user.appId) || ''} icon={<lucide_react_1.Key size={18}/>}/>
                              <SecureField label="App Secret" value={(user === null || user === void 0 ? void 0 : user.appSecret) || ''} icon={<lucide_react_1.Lock size={18}/>}/>
                              <SecureField label="Access Token" value={(user === null || user === void 0 ? void 0 : user.accessToken) || ''} icon={<lucide_react_1.Lock size={18}/>}/>
                            </div>
                          </div>
                        </card_1.CardContent>
                      </card_1.Card>
                    </tabs_1.TabsContent>
                    
                    <tabs_1.TabsContent value="settings" className="mt-0">
                      <card_1.Card className="border-gray-200 shadow-sm">
                        <card_1.CardHeader className="bg-gradient-to-r from-[#EB6C33]/10 to-transparent">
                          <card_1.CardTitle className="text-xl font-bold text-gray-800">Account Settings</card_1.CardTitle>
                          <card_1.CardDescription>Manage your account preferences</card_1.CardDescription>
                        </card_1.CardHeader>
                        <card_1.CardContent className="pt-6">
                          <div className="space-y-6">
                            <div className="p-4 rounded-xl border border-gray-200 bg-white">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Features Management</h3>
                              <p className="text-sm text-gray-600 mb-4">Enable or disable features for your account</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((feature, index) => (<div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                                    <div className="flex items-center">
                                      <span className="text-[#EB6C33] mr-2">{feature.icon}</span>
                                      <span className="font-medium text-sm">{feature.name}</span>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative ${feature.enabled ? 'bg-[#EB6C33]' : 'bg-gray-300'}`}>
                                      <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${feature.enabled ? 'left-[22px]' : 'left-0.5'}`}></div>
                                    </div>
                                  </div>))}
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-xl border border-gray-200 bg-white">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Subscription Management</h3>
                              <p className="text-sm text-gray-600 mb-4">Update or change your subscription plan</p>
                              
                              <div className="flex items-center justify-between p-4 rounded-lg border border-[#EB6C33]/20 bg-[#EB6C33]/5">
                                <div>
                                  <p className="font-semibold text-gray-800">Current Plan: <span className="text-[#EB6C33]">{user === null || user === void 0 ? void 0 : user.subscriptionLevel}</span></p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Renews on {user === null || user === void 0 ? void 0 : user.subscriptionExpiry.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
                                  </p>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-[#EB6C33] text-white text-sm font-medium hover:bg-[#EB6C33]/90 transition-colors">
                                  Change Plan
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-xl border border-gray-200 bg-white">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Security</h3>
                              <p className="text-sm text-gray-600 mb-4">Manage your account security settings</p>
                              
                              <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#EB6C33]/30 bg-gray-50 hover:bg-gray-100 transition-all">
                                  <div className="flex items-center">
                                    <lucide_react_1.Lock className="h-5 w-5 text-[#EB6C33] mr-2"/>
                                    <span className="font-medium text-sm">Change Password</span>
                                  </div>
                                  <lucide_react_1.ChevronRight className="h-4 w-4 text-gray-400"/>
                                </button>
                                
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#EB6C33]/30 bg-gray-50 hover:bg-gray-100 transition-all">
                                  <div className="flex items-center">
                                    <lucide_react_1.Key className="h-5 w-5 text-[#EB6C33] mr-2"/>
                                    <span className="font-medium text-sm">Two-Factor Authentication</span>
                                  </div>
                                  <lucide_react_1.ChevronRight className="h-4 w-4 text-gray-400"/>
                                </button>
                                
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#EB6C33]/30 bg-gray-50 hover:bg-gray-100 transition-all">
                                  <div className="flex items-center">
                                    <lucide_react_1.Settings className="h-5 w-5 text-[#EB6C33] mr-2"/>
                                    <span className="font-medium text-sm">API Key Management</span>
                                  </div>
                                  <lucide_react_1.ChevronRight className="h-4 w-4 text-gray-400"/>
                                </button>
                              </div>
                            </div>
                          </div>
                        </card_1.CardContent>
                      </card_1.Card>
                    </tabs_1.TabsContent>
                  </tabs_1.Tabs>
                </framer_motion_1.motion.div>
              </div>
              
              {/* Features Section */}
              <framer_motion_1.motion.div variants={itemVariants} className="mt-6">
                <card_1.Card className="border-gray-200 shadow-sm overflow-hidden">
                  <card_1.CardHeader className="bg-gradient-to-r from-[#EB6C33]/10 to-transparent">
                    <div className="flex justify-between items-center">
                      <card_1.CardTitle className="text-xl font-bold text-gray-800">Available Features</card_1.CardTitle>
                      <badge_1.Badge className="bg-[#EB6C33]/10 text-[#EB6C33] hover:bg-[#EB6C33]/20 border-none">
                        {user === null || user === void 0 ? void 0 : user.subscriptionLevel} Plan
                      </badge_1.Badge>
                    </div>
                    <card_1.CardDescription>All capabilities for your subscription</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent className="pt-6">
                    <div className="flex flex-wrap">
                      {features.map((feature, index) => (<FeatureBadge key={index} name={feature.name} enabled={feature.enabled} icon={feature.icon}/>))}
                    </div>
                    
                    <button className="mt-6 w-full flex items-center justify-center p-3 rounded-lg border border-[#EB6C33] text-[#EB6C33] hover:bg-[#EB6C33]/5 transition-all font-medium">
                      Upgrade to unlock all features
                    </button>
                  </card_1.CardContent>
                </card_1.Card>
              </framer_motion_1.motion.div>
              
              <framer_motion_1.motion.div variants={itemVariants} className="text-center text-sm text-gray-500 mt-8">
                <p>© 2025 TechInnovate Solutions. All rights reserved.</p>
              </framer_motion_1.motion.div>
            </framer_motion_1.motion.div>
          </framer_motion_1.AnimatePresence>)}
      </div>
    </div>);
}
