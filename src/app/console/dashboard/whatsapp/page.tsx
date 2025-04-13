'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ExternalLink, 
  MessageCircle, 
  ShieldAlert, 
  BarChart3, 
  Phone, 
  Globe, 
  CreditCard, 
  Users, 
  Bell,
  ArrowUpRight,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Sticker,
  MessageSquareText,
  Brain
} from 'lucide-react';
// Import Raleway font
import { Raleway } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

import { useRouter } from 'next/navigation';
import { getTenantConfigByClerk } from '@/lib/mongodb';
import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';
import { useUserDetails } from '@/hooks/user/use-user';

type Props = {};

// Demo WhatsApp data
const messages = [
  { sender: 'John Doe', message: 'Hey, how are you?', timestamp: '2024-11-12 10:00 AM', avatar: 'JD' },
  { sender: 'Jane Smith', message: 'Can we reschedule the meeting?', timestamp: '2024-11-12 09:30 AM', avatar: 'JS' },
  { sender: 'Alice Johnson', message: 'Here are the documents you requested.', timestamp: '2024-11-12 09:00 AM', avatar: 'AJ' },
  { sender: 'Bob Brown', message: 'Thanks for the update!', timestamp: '2024-11-12 08:45 AM', avatar: 'BB' },
];

// Demo data for visualizations
const messageTypeData = [
  { name: 'Text', value: 450 },
  { name: 'Images', value: 120 },
  { name: 'Audio', value: 75 },
  { name: 'Video', value: 30 },
  { name: 'Documents', value: 40 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const weeklyStats = [
  { name: 'Mon', messages: 145 },
  { name: 'Tue', messages: 232 },
  { name: 'Wed', messages: 186 },
  { name: 'Thu', messages: 304 },
  { name: 'Fri', messages: 247 },
  { name: 'Sat', messages: 98 },
  { name: 'Sun', messages: 134 },
];

const responseTimeData = [
  { name: '1h', avgTime: 2.3 },
  { name: '2h', avgTime: 3.1 },
  { name: '3h', avgTime: 1.8 },
  { name: '4h', avgTime: 2.5 },
  { name: '5h', avgTime: 1.2 },
  { name: '6h', avgTime: 4.0 },
  { name: '7h', avgTime: 3.3 },
];

// Initialize Raleway font
const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

// Campaign data
const campaigns = [
  { 
    name: 'Summer Sale', 
    status: 'Active', 
    engagement: 72, 
    messagesSent: 1200,
    startDate: '2024-11-01',
    endDate: '2024-11-30'
  },
  { 
    name: 'New Year Offer', 
    status: 'Completed', 
    engagement: 85, 
    messagesSent: 2500,
    startDate: '2024-10-15', 
    endDate: '2024-10-30' 
  },
  { 
    name: 'Product Launch', 
    status: 'Pending', 
    engagement: 45, 
    messagesSent: 800,
    startDate: '2024-11-20', 
    endDate: '2024-12-05' 
  },
  { 
    name: 'Holiday Special', 
    status: 'Draft', 
    engagement: 0, 
    messagesSent: 0,
    startDate: '2024-12-10', 
    endDate: '2024-12-24' 
  },
];

export default function WhatsAppDashboard({ }: Props) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasProduct, setHasProduct] = useState<boolean | null>(null);
  const { hasPurchasedProduct, userDetails } = useUserDetails();
  const { tenantConfig, setTenantConfig } = useTenantConfig(); // Using context for tenantConfig

  

  // Progress calculation for resource usage
  const getUsagePercentage = (used:any, total:any) => {
    return Math.min(Math.round((used / total) * 100), 100);
  };

  // Calculate remaining days of subscription
  const getSubscriptionRemainingDays = (expiryDate:any) => {
    if (!expiryDate) return "N/A";
    const expiry = new Date(expiryDate);
    const today = new Date();
    const differenceMs = expiry.getTime() - today.getTime();
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    return differenceDays > 0 ? differenceDays : 0;
  };
  
  // Get formatted expiry date
  const getFormattedExpiryDate = (expiryDate:any) => {
    if (!expiryDate) return "N/A";
    const date = new Date(expiryDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Demo usage data (replace with actual data from tenantConfig when available)
  const usageData = {
    messages: { used: tenantConfig?.subscription?.limits?.messagesCount, total: tenantConfig?.subscription?.limits?.messagesCount},
    tts: { used: tenantConfig?.subscription?.limits?.ttsCount, total: tenantConfig?.subscription?.limits?.ttsCount },
    images: { used: tenantConfig?.subscription?.limits?.imagesCount, total: tenantConfig?.subscription?.limits?.imagesCount},
    audio: { used: tenantConfig?.subscription?.limits?.audiosCount, total: tenantConfig?.subscription?.limits?.audiosCount },
    documents: { used:tenantConfig?.subscription?.limits?.documentsCount, total: tenantConfig?.subscription?.limits?.documentsCount },
    video: { used:tenantConfig?.subscription?.limits?.videosCount, total: tenantConfig?.subscription?.limits?.videosCount}
  };

  useEffect(() => {
    const fetchTenantConfig = async () => {
      if (userDetails?.userId) {
        const productStatus = await hasPurchasedProduct(userDetails.userId);
        setHasProduct(productStatus?.name === "Whatsapp-bot");
        setIsLoaded(true);
      }

      if (!tenantConfig && userDetails?.clerkId) { // Avoid re-fetching if config is already set
        try {
          const fetchedConfig = await getTenantConfigByClerk(userDetails.clerkId);
          console.log("Fetched Config is", fetchedConfig);
          
          // If no config is fetched, use the default data
          const completeConfig = fetchedConfig 
          
          console.log("Complete Config is", completeConfig);
          setTenantConfig(completeConfig);
        } catch (error) {
          console.error("Error fetching tenant config:", error);
          
        }
      }
    };

    fetchTenantConfig();
    setIsClient(true);
  }, [userDetails, tenantConfig, setTenantConfig]);

  console.log("Tenant Config in Context is", tenantConfig);

  if (hasProduct === false) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center bg-background p-4 ${raleway.variable} font-raleway`}>
        <Card className="max-w-md w-full p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <ShieldAlert className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Restricted Access
            </h1>

            <p className="text-muted-foreground">
              You need to purchase WhatsApp-Bot to access this dashboard. Unlock all features and take your experience to the next level.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full font-medium"
              size="lg"
              onClick={() => router.push('/console/services/whatsapp')}
              aria-label="Purchase WhatsAppBot"
            >
              Purchase Now
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
              aria-label="Go back to previous page"
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Use tenantConfig or defaultTenantData as a fallback
  const currentConfig = tenantConfig ;

  return (
    <motion.div
      className={`p-6 min-h-screen bg-gray-50 ${raleway.variable} font-raleway`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section with Business Info */}
      <motion.header
        className="flex justify-between items-start mb-6 bg-white shadow-sm rounded-lg p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#41b658]" />
            <h1 className="text-3xl font-semibold text-[#41b658]">WhatsApp Dashboard</h1>
          </div>
          <p className="text-xl text-gray-600 mt-2 font-bold">Welcome back, {tenantConfig?.businessName}</p>
          <p className="text-base text-gray-500 mt-1">Get an overview of your WhatsApp activity and engagement</p>
        </div>
        
        {currentConfig && (
          <div className="flex flex-col items-end">
            <Badge className="mb-2 bg-[#41b658]">{currentConfig.subscription.subscriptionLevel} Plan</Badge>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{currentConfig.displayPhoneNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Globe className="w-4 h-4" />
              <span>{currentConfig.country}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <CreditCard className="w-4 h-4" />
              <span>{currentConfig.subscription.price}</span>
            </div>
          </div>
        )}
      </motion.header>

      {/* Dashboard Overview */}
      {isClient && (
        <motion.section
          className="grid grid-cols-4 gap-4 mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData?.messages.used?.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">out of {usageData?.messages?.total?.toLocaleString()}</p>
              <Progress 
                value={getUsagePercentage(usageData.messages.used, usageData.messages.total)} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,024</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-500">↑ 12%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Response Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.3%</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-500">↑ 3.2%</span> from last week
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Avg. Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 min</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-500">↓ 30s</span> from last week
              </p>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Main Dashboard Content */}
      {isClient && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            
            <TabsTrigger value="account">Account Info</TabsTrigger>
          </TabsList>
          
          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <div className="grid grid-cols-3 gap-4">
              {/* Weekly Message Activity */}
              <Card className="col-span-2 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Weekly Message Activity</CardTitle>
                  <CardDescription>Message volume over the past 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="messages" fill="#41b658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Message Types Distribution */}
              <Card className="col-span-1 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Message Types</CardTitle>
                  <CardDescription>Distribution by content type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={messageTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {messageTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {messageTypeData.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center text-xs">
                        <div 
                          className="w-3 h-3 mr-1 rounded-sm" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="col-span-2 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Latest conversations with customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`/api/placeholder/40/40`} alt={message.sender} />
                          <AvatarFallback>{message.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{message.sender}</h4>
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600">{message.message}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageSquareText className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    View All Messages
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Resource Usage */}
              <Card className="col-span-1 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>Monthly allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" /> Messages
                        </span>
                        <span className="text-xs text-gray-500">
                          {usageData.messages.used}/{usageData.messages.total}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usageData.messages.used, usageData.messages.total)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium flex items-center">
                          <Bell className="h-3 w-3 mr-1" /> TTS Messages
                        </span>
                        <span className="text-xs text-gray-500">
                          {usageData.tts.used}/{usageData.tts.total}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usageData.tts.used, usageData.tts.total)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium flex items-center">
                          <ImageIcon className="h-3 w-3 mr-1" /> Images
                        </span>
                        <span className="text-xs text-gray-500">
                          {usageData.images.used}/{usageData.images.total}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usageData.images.used, usageData.images.total)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium flex items-center">
                          <Music className="h-3 w-3 mr-1" /> Audio
                        </span>
                        <span className="text-xs text-gray-500">
                          {usageData.audio.used}/{usageData.audio.total}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usageData.audio.used, usageData.audio.total)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium flex items-center">
                          <FileText className="h-3 w-3 mr-1" /> Documents
                        </span>
                        <span className="text-xs text-gray-500">
                          {usageData.documents.used}/{usageData.documents.total}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usageData.documents.used, usageData.documents.total)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium flex items-center">
                          <Video className="h-3 w-3 mr-1" /> Videos
                        </span>
                        <span className="text-xs text-gray-500">
                          {usageData.video.used}/{usageData.video.total}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usageData.video.used, usageData.video.total)} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    Upgrade Plan
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* MESSAGES TAB */}
          <TabsContent value="messages">
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>All Messages</CardTitle>
                  <CardDescription>View and manage all your WhatsApp conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sender</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((message, index) => (
                          <TableRow key={index} className="border-t">
                            <TableCell className="font-medium">{message.sender}</TableCell>
                            <TableCell>{message.message}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Text</Badge>
                            </TableCell>
                            <TableCell>{message.timestamp}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Read</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">Reply</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* CAMPAIGNS TAB */}
          <TabsContent value="campaigns">
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Marketing Campaigns</CardTitle>
                    <CardDescription>Manage your automated campaign messages</CardDescription>
                  </div>
                  <Button>
                    New Campaign
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Campaign</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Engagement</TableHead>
                          <TableHead>Messages Sent</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {campaigns.map((campaign, index) => (
                          <TableRow key={index} className="border-t">
                            <TableCell className="font-medium">{campaign.name}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  campaign.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                  campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                  campaign.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                  'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                }
                              >
                                {campaign.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{campaign.startDate}</TableCell>
                            <TableCell>{campaign.endDate}</TableCell>
                            <TableCell>{campaign.engagement}%</TableCell>
                            <TableCell>{campaign.messagesSent.toLocaleString()}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* ANALYTICS TAB */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Response Time Trends</CardTitle>
                  <CardDescription>Average response time in minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={responseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avgTime" stroke="#41b658" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Customer Engagement</CardTitle>
                  <CardDescription>User activity breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { category: 'New Users', value: 230 },
                          { category: 'Active Users', value: 428 },
                          { category: 'Returning Users', value: 352 },
                          { category: 'Inactive Users', value: 145 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                  <CardDescription>Feedback analysis from conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-3xl font-bold text-green-500">92%</div>
                      <div className="text-sm text-gray-500">Positive</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-3xl font-bold text-yellow-500">5%</div>
                      <div className="text-sm text-gray-500">Neutral</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-3xl font-bold text-red-500">3%</div>
                      <div className="text-sm text-gray-500">Negative</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-3xl font-bold">4.8/5</div>
                      <div className="text-sm text-gray-500">Average Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* ACCOUNT INFO TAB */}
          <TabsContent value="account">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Information */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Your WhatsApp Business account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-medium text-sm">Business Name</div>
                      <div className="col-span-2 text-sm">{tenantConfig?.businessName}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-medium text-sm">Phone Number</div>
                      <div className="col-span-2 text-sm">{tenantConfig?.displayPhoneNumber}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-medium text-sm">WABA ID</div>
                      <div className="col-span-2 text-sm">{tenantConfig?.waba_id}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-medium text-sm">Phone ID</div>
                      <div className="col-span-2 text-sm">{tenantConfig?.phoneNumberId}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-medium text-sm">Country</div>
                      <div className="col-span-2 text-sm">{tenantConfig?.country}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-medium text-sm">Currency</div>
                      <div className="col-span-2 text-sm">{tenantConfig?.currency}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-medium text-sm">TTS Gender</div>
                      <div className="col-span-2 text-sm capitalize">{tenantConfig?.ttsGender}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-medium text-sm">Bot Name</div>
                      <div className="col-span-2 text-sm">{tenantConfig?.botName}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm">
                    Edit Information
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Subscription Details */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>Your current plan and billing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{tenantConfig?.subscription.subscriptionLevel} Plan</h3>
                        <p className="text-sm text-gray-500">{tenantConfig?.subscription.price}</p>
                      </div>
                      <Badge className="bg-[#41b658]">Active</Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Subscription expires on</h4>
                      <p className="text-sm">{getFormattedExpiryDate(tenantConfig?.subscription.subscriptionExpiry)}</p>
                      <p className="text-xs text-gray-500">({getSubscriptionRemainingDays(tenantConfig?.subscription.subscriptionExpiry)} days remaining)</p>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Payment method</h4>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <p className="text-sm">•••• •••• •••• 4242</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    Manage Billing
                  </Button>
                  <Button variant="default" size="sm">
                    Upgrade Plan
                  </Button>
                </CardFooter>
              </Card>
              
              {/* API Information */}
              <Card className="col-span-1 md:col-span-2 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>API Information</CardTitle>
                  <CardDescription>Your WhatsApp API credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">App ID</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 font-mono text-sm bg-gray-50 p-2 rounded-md truncate">
                            {tenantConfig?.appId}
                          </div>
                          <Button size="icon" variant="ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">App Secret</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 font-mono text-sm bg-gray-50 p-2 rounded-md truncate">
                            {tenantConfig?.appSecret.substring(0, 3)}••••••••••••••••••••{tenantConfig?.appSecret.slice(-3)}
                          </div>
                          <Button size="icon" variant="ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Access Token</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 font-mono text-sm bg-gray-50 p-2 rounded-md truncate">
                            {tenantConfig?.accessToken.substring(0, 8)}••••••••••••••••••••{tenantConfig?.accessToken.slice(-8)}
                          </div>
                          <Button size="icon" variant="ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Webhook URL</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 font-mono text-sm bg-gray-50 p-2 rounded-md truncate">
                            https://api.yourservice.com/webhook/whatsapp
                          </div>
                          <Button size="icon" variant="ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm">
                    Rotate API Keys
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Enabled Features */}
              <Card className="col-span-1 md:col-span-2 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Active Features</CardTitle>
                  <CardDescription>Features available on your current plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`flex flex-col items-center p-4 rounded-lg border ${tenantConfig?.subscription.features.text ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                      <MessageCircle className={`h-8 w-8 ${tenantConfig?.subscription.features.text ? 'text-[#41b658]' : 'text-gray-400'} mb-2`} />
                      <span className="text-sm font-medium">Text Messages</span>
                      {!tenantConfig?.subscription.features.text && <Badge variant="outline" className="mt-2 text-xs">Inactive</Badge>}
                    </div>
                    
                    <div className={`flex flex-col items-center p-4 rounded-lg border ${tenantConfig?.subscription.features.tts ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                      <Bell className={`h-8 w-8 ${tenantConfig?.subscription.features.tts ? 'text-[#41b658]' : 'text-gray-400'} mb-2`} />
                      <span className="text-sm font-medium">Text-to-Speech</span>
                      {!tenantConfig?.subscription.features.tts && <Badge variant="outline" className="mt-2 text-xs">Inactive</Badge>}
                    </div>
                    
                    <div className={`flex flex-col items-center p-4 rounded-lg border ${tenantConfig?.subscription.features.aiResponse ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                      <Brain className={`h-8 w-8 ${tenantConfig?.subscription.features.aiResponse ? 'text-[#41b658]' : 'text-gray-400'} mb-2`} />
                      <span className="text-sm font-medium">AI Responses</span>
                      {!tenantConfig?.subscription.features.aiResponse && <Badge variant="outline" className="mt-2 text-xs">Inactive</Badge>}
                    </div>
                    
                    <div className={`flex flex-col items-center p-4 rounded-lg border ${tenantConfig?.subscription.features.image ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                      <ImageIcon className={`h-8 w-8 ${tenantConfig?.subscription.features.image ? 'text-[#41b658]' : 'text-gray-400'} mb-2`} />
                      <span className="text-sm font-medium">Image Sharing</span>
                      {!tenantConfig?.subscription.features.image && <Badge variant="outline" className="mt-2 text-xs">Inactive</Badge>}
                    </div>
                    
                    <div className={`flex flex-col items-center p-4 rounded-lg border ${tenantConfig?.subscription.features.audio ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                      <Music className={`h-8 w-8 ${tenantConfig?.subscription.features.audio ? 'text-[#41b658]' : 'text-gray-400'} mb-2`} />
                      <span className="text-sm font-medium">Audio Messages</span>
                      {!tenantConfig?.subscription.features.audio && <Badge variant="outline" className="mt-2 text-xs">Inactive</Badge>}
                    </div>
                    
                    <div className={`flex flex-col items-center p-4 rounded-lg border ${tenantConfig?.subscription.features.document ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                      <FileText className={`h-8 w-8 ${tenantConfig?.subscription.features.document ? 'text-[#41b658]' : 'text-gray-400'} mb-2`} />
                      <span className="text-sm font-medium">Document Sharing</span>
                      {!tenantConfig?.subscription.features.document && <Badge variant="outline" className="mt-2 text-xs">Inactive</Badge>}
                    </div>
                    
                    <div className={`flex flex-col items-center p-4 rounded-lg border ${tenantConfig?.subscription.features.video ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                      <Video className={`h-8 w-8 ${tenantConfig?.subscription.features.video ? 'text-[#41b658]' : 'text-gray-400'} mb-2`} />
                      <span className="text-sm font-medium">Video Messages</span>
                      {!tenantConfig?.subscription.features.video && <Badge variant="outline" className="mt-2 text-xs">Inactive</Badge>}
                    </div>
                    
                    <div className={`flex flex-col items-center p-4 rounded-lg border ${tenantConfig?.subscription.features.sticker ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                      <Sticker className={`h-8 w-8 ${tenantConfig?.subscription.features.sticker ? 'text-[#41b658]' : 'text-gray-400'} mb-2`} />
                      <span className="text-sm font-medium">Sticker Support</span>
                      {!tenantConfig?.subscription.features.sticker && <Badge variant="outline" className="mt-2 text-xs">Inactive</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

    </motion.div>
  );
}