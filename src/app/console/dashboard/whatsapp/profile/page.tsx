"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inter, Raleway } from 'next/font/google';
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Building, 
  Globe, 
  CreditCard, 
  Calendar, 
  Lock, 
  Phone, 
  Key, 
  MessageSquare, 
  Headphones, 
  Image, 
  File, 
  Video, 
  Sticker, 
  MessageCircle, 
  Database,
  BarChart,
  Settings,
  Info,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';



// User data interface
interface UserProfile {
  // General Info
  _id: string;
  clerkId: string;
  businessName: string;
  selectOption: string;
  country: string;
  currency: string;
  subscriptionLevel: string;
  price: number;
  subscriptionExpiry: Date;
  
  // WhatsApp API Info
  waba_id: string;
  displayPhoneNumber: string;
  phoneNumberId: string;
  accessToken: string;
  appId: string;
  appSecret: string;
  
  // Features
  text: boolean;
  tts: boolean;
  aiResponse: boolean;
  image: boolean;
  audio: boolean;
  document: boolean;
  video: boolean;
  sticker: boolean;
  interactive: boolean;
  retrieval: boolean;
  
  // Limits
  messagesCount: number;
  ttsCount: number;
  imagesCount: number;
  audiosCount: number;
  documentsCount: number;
  videosCount: number;
}

// Sample user data
const userData: UserProfile = {
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
const SecureField = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => {
  const [revealed, setRevealed] = useState(false);
  const displayValue = revealed ? value : value.substring(0, 5) + "•".repeat(10);
  
  return (
    <motion.div 
      className="mb-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-[#41b658]/30 shadow-sm hover:shadow transition-all" 
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center mb-2">
        <div className="text-[#41b658] mr-2">{icon}</div>
        <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-base font-medium overflow-hidden text-ellipsis">{displayValue}</div>
        <button 
          onClick={() => setRevealed(!revealed)} 
          className="text-xs px-3 py-1 rounded-full bg-[#41b658]/10 text-[#41b658] hover:bg-[#41b658]/20 transition-colors"
        >
          {revealed ? "Hide" : "Show"}
        </button>
      </div>
    </motion.div>
  );
};

// Field display component with icon
const Field = ({ label, value, icon }: { label: string; value: string | number | boolean | Date; icon: React.ReactNode }) => {
  let displayValue = value;
  
  if (value instanceof Date) {
    displayValue = value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else if (typeof value === 'boolean') {
    return (
      <motion.div 
        className="mb-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-[#41b658]/30 shadow-sm hover:shadow transition-all"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center mb-2">
          <div className="text-[#41b658] mr-2">{icon}</div>
          <Label className="text-sm font-semibold text-gray-700">{label}</Label>
        </div>
        <div className="flex items-center">
          {value ? (
            <div className="flex items-center bg-[#41b658]/10 text-[#41b658] px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="font-medium text-sm">Enabled</span>
            </div>
          ) : (
            <div className="flex items-center bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              <XCircle className="h-4 w-4 mr-1" />
              <span className="font-medium text-sm">Disabled</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  } else if (typeof value === 'number' && label.includes('price')) {
    displayValue = `$${value.toFixed(2)}`;
  }

  return (
    <motion.div 
      className="mb-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-[#41b658]/30 shadow-sm hover:shadow transition-all"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center mb-2">
        <div className="text-[#41b658] mr-2">{icon}</div>
        <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      </div>
      <div className="text-base font-medium text-gray-800">{displayValue as string}</div>
    </motion.div>
  );
};

// Skeleton loader for fields
const FieldSkeleton = () => (
  <div className="mb-4 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
    <div className="flex items-center mb-2">
      <Skeleton className="h-5 w-5 rounded-full mr-2" />
      <Skeleton className="h-4 w-28" />
    </div>
    <Skeleton className="h-6 w-full max-w-xs mt-2" />
  </div>
);

// Feature badge component with tooltip
const FeatureBadge = ({ name, enabled, icon }: { name: string; enabled: boolean; icon: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Badge className={`mr-2 mb-2 py-2 px-3 rounded-full ${
            enabled 
              ? 'bg-[#41b658] hover:bg-[#41b658]/90 text-white' 
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}>
            <div className="flex items-center">
              <span className="mr-1.5">{icon}</span>
              {name}
            </div>
          </Badge>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-800 text-white">
        <p>{enabled ? `${name} is enabled` : `${name} is disabled`}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Usage progress component
const UsageProgress = ({ label, used, total, icon }: { label: string; used: number; total: number; icon: React.ReactNode }) => {
  const percentage = Math.min(100, Math.round((used / total) * 100)) || 0;
  const isHigh = percentage > 80;
  
  return (
    <motion.div 
      className="mb-6 p-4 rounded-xl border border-gray-100 hover:border-[#41b658]/30 shadow-sm hover:shadow bg-white transition-all"
      whileHover={{ y: -2 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className={`mr-2 ${isHigh ? 'text-amber-500' : 'text-[#41b658]'}`}>{icon}</span>
          <Label className={`text-sm font-semibold ${isHigh ? 'text-amber-500' : 'text-gray-700'}`}>{label}</Label>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">
            {used.toLocaleString()} / {total.toLocaleString()}
          </span>
          {isHigh && (
            <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
          )}
        </div>
      </div>
      <Progress 
        value={percentage} 
        className="h-2.5 rounded-full" 
        style={{
          backgroundColor: isHigh ? '#FEF3C7' : '#E5E7EB',
          
        }} 
      />
      <div className="mt-2 text-xs font-medium flex justify-between items-center">
        <span className={isHigh ? 'text-amber-500' : 'text-gray-500'}>
          {percentage}% used
        </span>
        <span className="text-gray-500">
          {(total - used).toLocaleString()} remaining
        </span>
      </div>
    </motion.div>
  );
};

// Subscription status component
const SubscriptionStatus = ({ expiryDate, level, price }: { expiryDate: Date, level: string, price: number }) => {
  const currentDate = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  const isLow = daysUntilExpiry < 30;
  
  return (
    <motion.div 
      className={`p-4 rounded-xl shadow-sm border ${
        isLow ? 'bg-amber-50 border-amber-200' : 'bg-[#41b658]/5 border-[#41b658]/20'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-bold ${isLow ? 'text-amber-600' : 'text-[#41b658]'}`}>
            {level} Plan
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            ${price.toFixed(2)}/month
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isLow ? 'bg-amber-100 text-amber-600' : 'bg-[#41b658]/10 text-[#41b658]'
        }`}>
          {daysUntilExpiry} days left
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${isLow ? 'bg-amber-500' : 'bg-[#41b658]'}`}
            style={{ width: `${Math.min(100, (daysUntilExpiry / 365) * 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Today</span>
          <span>{expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <button className={`w-full py-2 rounded-lg text-white font-medium text-sm ${
          isLow ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#41b658] hover:bg-[#41b658]/90'
        } transition-colors`}>
          Renew Subscription
        </button>
      </div>
    </motion.div>
  );
};

// Icon mapping for feature types
const featureIcons = {
  text: <MessageSquare size={16} />,
  tts: <Headphones size={16} />,
  aiResponse: <MessageCircle size={16} />,
  image: <Image size={16} />,
  audio: <Headphones size={16} />,
  document: <File size={16} />,
  video: <Video size={16} />,
  sticker: <Sticker size={16} />,
  interactive: <MessageCircle size={16} />,
  retrieval: <Database size={16} />
};

// Main component
export default function ProfilePage() {

  const { tenantConfig } = useTenantConfig();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(userData);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  console.log("Tenant Config in profile page is",tenantConfig)

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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 `}>
      <div className="max-w-6xl mx-auto">
        {loading ? (
          // Skeleton loader when loading
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl mt-6" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-12 w-full rounded-lg mb-4" />
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ) : (
          // Actual content when loaded
          <AnimatePresence>
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Profile Header with User Info */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center mb-4 sm:mb-0">
                  <Avatar className="h-16 w-16 mr-4 border-2 border-[#41b658] shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.businessName}`} alt={user?.businessName} />
                    <AvatarFallback className="bg-[#41b658] text-white text-xl">
                      {user?.businessName?.split(' ').map(word => word[0]).join('') || 'TS'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{tenantConfig?.businessName|| ''}</h1>
                    <div className="flex items-center mt-1">
                      <Badge className="bg-[#41b658]/10 text-[#41b658] hover:bg-[#41b658]/20 border-none">
                        {user?.selectOption}
                      </Badge>
                      <Separator className="mx-2 h-4 w-px bg-gray-300" orientation="vertical" />
                      <span className="text-sm text-gray-500">{tenantConfig?.country}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Badge className="bg-[#41b658] text-white hover:bg-[#41b658]/90">
                      {tenantConfig?.subscription?.subscriptionLevel}
                    </Badge>
                    <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                      ID: {tenantConfig?.clerkId?.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
                  {/* Subscription Card */}
                  <motion.div variants={cardVariants}>
                    {user && (
                      <SubscriptionStatus 
                        expiryDate={user.subscriptionExpiry} 
                        level={user.subscriptionLevel} 
                        price={user.price} 
                      />
                    )}
                  </motion.div>
                  
                  {/* WhatsApp API Information */}
                  <motion.div variants={cardVariants}>
                    <Card className="border-gray-200 shadow-sm overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-[#41b658]/10 to-transparent pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg font-bold text-gray-800">API Credentials</CardTitle>
                          <Lock className="h-5 w-5 text-[#41b658]" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <SecureField label="WABA ID" value={tenantConfig?.waba_id || ''} icon={<Key size={18} />} />
                        <Field label="Phone Number" value={tenantConfig?.displayPhoneNumber || ''} icon={<Phone size={18} />} />
                        <SecureField label="Phone ID" value={tenantConfig?.phoneNumberId || ''} icon={<Key size={18} />} />
                        
                        <Separator className="my-4" />
                      
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  {/* Features Overview Card */}
                  <motion.div variants={cardVariants}>
                    <Card className="border-gray-200 shadow-sm overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-[#41b658]/10 to-transparent pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg font-bold text-gray-800">Features Overview</CardTitle>
                          <div className="flex items-center bg-[#41b658]/10 text-[#41b658] px-2 py-1 rounded-full text-xs font-semibold">
                            {enabledFeaturesCount}/{features.length} enabled
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                          {features.map((feature, index) => (
                            <div key={index} className={`flex items-center p-2 rounded-lg ${
                              feature.enabled 
                                ? 'bg-[#41b658]/5 border border-[#41b658]/10' 
                                : 'bg-gray-50 border border-gray-100'
                            }`}>
                              {feature.enabled ? (
                                <CheckCircle className="h-4 w-4 text-[#41b658] mr-2 flex-shrink-0" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              )}
                              <span className="flex items-center">
                                <span className={feature.enabled ? 'text-[#41b658] mr-2' : 'text-gray-400 mr-2'}>
                                  {feature.icon}
                                </span>
                                <span className={`font-medium text-sm ${
                                  feature.enabled ? 'text-gray-800' : 'text-gray-500'
                                }`}>
                                  {feature.name}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
                
                {/* Main Content Area */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <Tabs defaultValue="usage" className="w-full">
                    <TabsList className="w-full bg-white p-1 rounded-xl mb-6 border border-gray-200">
                      <TabsTrigger value="usage" className="flex-1 rounded-lg data-[state=active]:bg-[#41b658] data-[state=active]:text-white">
                        <BarChart className="h-4 w-4 mr-2" />
                        Usage
                      </TabsTrigger>
                      <TabsTrigger value="account" className="flex-1 rounded-lg data-[state=active]:bg-[#41b658] data-[state=active]:text-white">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="flex-1 rounded-lg data-[state=active]:bg-[#41b658] data-[state=active]:text-white">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="usage" className="mt-0">
                      <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="bg-gradient-to-r from-[#41b658]/10 to-transparent">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold text-gray-800">Usage & Limits</CardTitle>
                            <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                              {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </Badge>
                          </div>
                          <CardDescription>Current usage against your plan limits</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <UsageProgress 
                              label="Messages" 
                              used={user?.messagesCount || 0} 
                              total={10000} 
                              icon={<MessageSquare size={18} />} 
                            />
                            <UsageProgress 
                              label="Text-to-Speech" 
                              used={user?.ttsCount || 0} 
                              total={5000} 
                              icon={<Headphones size={18} />} 
                            />
                            <UsageProgress 
                              label="Images" 
                              used={user?.imagesCount || 0} 
                              total={3000} 
                              icon={<Image size={18} />} 
                            />
                            <UsageProgress 
                              label="Audio" 
                              used={user?.audiosCount || 0} 
                              total={2000} 
                              icon={<Headphones size={18} />} 
                            />
                            <UsageProgress 
                              label="Documents" 
                              used={user?.documentsCount || 0} 
                              total={1000} 
                              icon={<File size={18} />} 
                            />
                            <UsageProgress 
                              label="Videos" 
                              used={user?.videosCount || 0} 
                              total={500} 
                              icon={<Video size={18} />} 
                            />
                          </div>
                          
                          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-[#41b658] mr-3 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-semibold text-gray-800">Usage Information</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Usage counters reset on the first day of each month. Upgrade your plan to increase limits.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="account" className="mt-0">
                      <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="bg-gradient-to-r from-[#41b658]/10 to-transparent">
                          <CardTitle className="text-xl font-bold text-gray-800">Account Information</CardTitle>
                          <CardDescription>Your business and subscription details</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Business Name" value={tenantConfig?.businessName || ''} icon={<Building size={18} />} />
                            <Field label="Country" value={tenantConfig?.country || ''} icon={<Globe size={18} />} />
                            <Field label="Currency"  value={tenantConfig?.currency || ''} icon={<CreditCard size={18} />} />
                            
                            <Field label="Subscription Level" value={tenantConfig?.subscription?.subscriptionLevel || ''} icon={<Database size={18} />} />
                          </div>
                          
                          <Separator className="my-6" />
                          
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">API Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <SecureField label="App ID" value={user?.appId || ''} icon={<Key size={18} />} />
                              <SecureField label="App Secret" value={user?.appSecret || ''} icon={<Lock size={18} />} />
                              <SecureField label="Access Token" value={user?.accessToken || ''} icon={<Lock size={18} />} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="settings" className="mt-0">
                      <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="bg-gradient-to-r from-[#41b658]/10 to-transparent">
                          <CardTitle className="text-xl font-bold text-gray-800">Account Settings</CardTitle>
                          <CardDescription>Manage your account preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-6">
                            <div className="p-4 rounded-xl border border-gray-200 bg-white">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Features Management</h3>
                              <p className="text-sm text-gray-600 mb-4">Enable or disable features for your account</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((feature, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                                    <div className="flex items-center">
                                      <span className="text-[#41b658] mr-2">{feature.icon}</span>
                                      <span className="font-medium text-sm">{feature.name}</span>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative ${feature.enabled ? 'bg-[#41b658]' : 'bg-gray-300'}`}>
                                      <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${feature.enabled ? 'left-[22px]' : 'left-0.5'}`}></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-xl border border-gray-200 bg-white">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Subscription Management</h3>
                              <p className="text-sm text-gray-600 mb-4">Update or change your subscription plan</p>
                              
                              <div className="flex items-center justify-between p-4 rounded-lg border border-[#41b658]/20 bg-[#41b658]/5">
                                <div>
                                  <p className="font-semibold text-gray-800">Current Plan: <span className="text-[#41b658]">{user?.subscriptionLevel}</span></p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Renews on {user?.subscriptionExpiry.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-[#41b658] text-white text-sm font-medium hover:bg-[#41b658]/90 transition-colors">
                                  Change Plan
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-xl border border-gray-200 bg-white">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Security</h3>
                              <p className="text-sm text-gray-600 mb-4">Manage your account security settings</p>
                              
                              <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#41b658]/30 bg-gray-50 hover:bg-gray-100 transition-all">
                                  <div className="flex items-center">
                                    <Lock className="h-5 w-5 text-[#41b658] mr-2" />
                                    <span className="font-medium text-sm">Change Password</span>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </button>
                                
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#41b658]/30 bg-gray-50 hover:bg-gray-100 transition-all">
                                  <div className="flex items-center">
                                    <Key className="h-5 w-5 text-[#41b658] mr-2" />
                                    <span className="font-medium text-sm">Two-Factor Authentication</span>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </button>
                                
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#41b658]/30 bg-gray-50 hover:bg-gray-100 transition-all">
                                  <div className="flex items-center">
                                    <Settings className="h-5 w-5 text-[#41b658] mr-2" />
                                    <span className="font-medium text-sm">API Key Management</span>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              </div>
              
              {/* Features Section */}
              <motion.div variants={itemVariants} className="mt-6">
                <Card className="border-gray-200 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#41b658]/10 to-transparent">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold text-gray-800">Available Features</CardTitle>
                      <Badge className="bg-[#41b658]/10 text-[#41b658] hover:bg-[#41b658]/20 border-none">
                        {user?.subscriptionLevel} Plan
                      </Badge>
                    </div>
                    <CardDescription>All capabilities for your subscription</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap">
                      {features.map((feature, index) => (
                        <FeatureBadge 
                          key={index} 
                          name={feature.name} 
                          enabled={feature.enabled} 
                          icon={feature.icon}
                        />
                      ))}
                    </div>
                    
                    <button className="mt-6 w-full flex items-center justify-center p-3 rounded-lg border border-[#41b658] text-[#41b658] hover:bg-[#41b658]/5 transition-all font-medium">
                      Upgrade to unlock all features
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center text-sm text-gray-500 mt-8">
                <p>© 2025 Sucetas Technologies pvt ltd. All rights reserved.</p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}