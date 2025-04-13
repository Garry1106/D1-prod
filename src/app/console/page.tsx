'use client';

import { useUserDetails } from '@/hooks/user/use-user';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { 
  BarChart as BarChartIcon, 
  Activity, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Plus, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/user/UserContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Mock data for visualizations
const mockConversationData = [
  { name: 'Jan', whatsapp: 400, website: 240 },
  { name: 'Feb', whatsapp: 300, website: 139 },
  { name: 'Mar', whatsapp: 200, website: 380 },
  { name: 'Apr', whatsapp: 278, website: 390 },
  { name: 'May', whatsapp: 189, website: 480 },
  { name: 'Jun', whatsapp: 239, website: 380 },
  { name: 'Jul', whatsapp: 349, website: 430 },
];

const mockBotUsage = [
  { name: 'WhatsApp Bot', value: 65 },
  { name: 'Website Bot', value: 35 },
];

const mockServiceData = [
  { id: 1, name: 'WhatsApp AI Chatbot', status: 'active', usage: 78, lastActivity: '2 hours ago' },
  { id: 2, name: 'Website AI Chatbot', status: 'active', usage: 45, lastActivity: '30 minutes ago' },
  { id: 3, name: 'Custom Bot Template', status: 'inactive', usage: 0, lastActivity: '3 days ago' },
];

const mockRecentActivities = [
  { id: 1, action: 'New conversation started', service: 'WhatsApp Bot', time: '10 minutes ago', status: 'success' },
  { id: 2, action: 'Bot configuration updated', service: 'Website Bot', time: '2 hours ago', status: 'success' },
  { id: 3, action: 'Template customization', service: 'Custom Bot', time: '1 day ago', status: 'pending' },
];

// Colors based on your existing theme
const COLORS = ['#EB6C33', '#4791FF', '#41B883', '#E8EAED'];

const DashboardPage = () => {
  const { signOut } = useClerk();
  const { userDetails, loading } = useUserDetails();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('overview');
  const [timeRange, setTimeRange] = useState('monthly');
  const itemsPerPage = 5;
  const router = useRouter();
  
  const { isDarkMode, toggleDarkMode } = useUserContext();

  // Use isPurchased from userDetails to determine if the user should see onboarding or dashboard
  useEffect(() => {
    // if (userDetails && userDetails.isSubscribed !== undefined) {
    //   setIsOnboarded(userDetails.isSubscribed);
    // }
  }, [userDetails]);

  // Skeleton loader component for loading state
  if (loading) {
    return (
      <div className="min-h-screen font-raleway">
        {/* Navbar Skeleton */}
        <nav className="border-b-2 py-4 px-6 flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </nav>

        {/* Main Content Skeleton */}
        <div className="p-6 bg-gray-100 dark:bg-gray-900">
          {/* Category Selection Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-[180px] animate-pulse" />
          </motion.div>

          {/* Analytics Section Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((_, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Chart Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse" />
            <Card className="shadow-lg">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Enhanced Onboarding Component
  const OnboardingComponent = () => {
    // Features for the onboarding steps
    const features = [
      {
        icon: <MessageSquare className="h-10 w-10 text-[#EB6C33]" />,
        title: "AI-Powered Chatbots",
        description: "Create intelligent chatbots for WhatsApp and your website that understand natural language and deliver exceptional customer experiences."
      },
      {
        icon: <BarChartIcon className="h-10 w-10 text-[#EB6C33]" />,
        title: "Advanced Analytics",
        description: "Gain valuable insights with detailed conversation analytics, user engagement metrics, and performance tracking."
      },
      {
        icon: <Users className="h-10 w-10 text-[#EB6C33]" />,
        title: "Seamless Integration",
        description: "Easily integrate with your existing workflows and platforms to streamline your customer support operations."
      }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 3;

    const nextStep = () => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    };

    const prevStep = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    const goToServices = () => {
      router.push('/console/services');
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[70vh] px-4"
      >
        <Card className="shadow-xl border-none dark:bg-gray-800 w-full max-w-5xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left sidebar with progress */}
            <div className="bg-[#EB6C33]/10 p-8 md:w-1/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-6">
                  <h3 className="text-xl font-bold text-[#EB6C33] ml-3">DuneFox</h3>
                </div>
                
                <h4 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Setup Process</h4>
                
                <div className="space-y-4 mb-8">
                  {[0, 1, 2].map((step) => (
                    <div 
                      key={step} 
                      className={`flex items-center cursor-pointer transition-all ${currentStep === step ? 'opacity-100' : 'opacity-60'}`}
                      onClick={() => setCurrentStep(step)}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentStep === step ? 'bg-[#EB6C33] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {step + 1}
                      </div>
                      <span className={`font-medium ${currentStep === step ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {step === 0 ? 'Welcome' : step === 1 ? 'Features' : 'Get Started'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Main content area */}
            <div className="p-8 md:w-2/3">
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-between"
                >
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                      Welcome to <span className="text-[#EB6C33]">DuneFox Console</span>!
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      Your powerful dashboard for AI-powered chatbots and conversational intelligence.
                    </CardDescription>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
                      <p className="text-blue-700 dark:text-blue-300 flex items-start">
                        <Bell className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Complete your onboarding to unlock all features and start creating your first AI chatbot.</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <div></div> {/* Empty div for spacing */}
                    <Button
                      onClick={nextStep}
                      className="bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white px-6 py-2 text-lg font-semibold rounded-md transition-all"
                    >
                      <span className="mr-2">Continue</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-between"
                >
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                      Powerful Features for Your Business
                    </CardTitle>
                    
                    <div className="space-y-6 mb-6">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="mr-4 bg-[#EB6C33]/10 p-3 rounded-lg flex-shrink-0">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-1">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white px-6 py-2 font-semibold rounded-md transition-all"
                    >
                      <span className="mr-2">Continue</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-between"
                >
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                      Ready to Get Started?
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      You're all set to create your first AI chatbot. Let's begin by exploring available services.
                    </CardDescription>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">Create AI chatbots for WhatsApp</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">Embed chatbots on your website</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">Monitor conversations and analytics</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">Customize bot templates to match your brand</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#EB6C33]/10 p-4 rounded-lg border border-[#EB6C33]/30 flex items-start">
                      <AlertCircle className="h-5 w-5 text-[#EB6C33] mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Our guided setup will help you configure your first bot in less than 5 minutes. No technical knowledge required!
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={goToServices}
                      className="bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white px-8 py-2 text-lg font-semibold rounded-md transition-transform transform hover:scale-105"
                    >
                      <span className="mr-2">Get Started</span>
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Dashboard Content
  const DashboardContent = () => {
    return (
      <>
        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Dashboard Categories</h2>
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="whatsapp">Whatsapp</SelectItem>
              <SelectItem value="webbot">Webbot</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Conversations Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-none">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Conversations</CardTitle>
                  <MessageSquare className="h-5 w-5 text-[#EB6C33]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold dark:text-white">3,248</div>
                  <div className="flex items-center mt-1 text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-sm">+12.5% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Users Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-none">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</CardTitle>
                  <Users className="h-5 w-5 text-[#EB6C33]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold dark:text-white">872</div>
                  <div className="flex items-center mt-1 text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-sm">+5.3% from last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-none">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</CardTitle>
                  <CheckCircle className="h-5 w-5 text-[#EB6C33]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold dark:text-white">92.4%</div>
                  <Progress value={92.4} className="h-2 mt-2 bg-gray-200 dark:bg-gray-700" />
                </div>
              </CardContent>
            </Card>

            {/* Subscription Status Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-none">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription</CardTitle>
                  <CreditCard className="h-5 w-5 text-[#EB6C33]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-lg font-bold dark:text-white">Premium Plan</div>
                  <Badge className="w-fit mt-2 bg-green-500 hover:bg-green-600">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Conversation Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Line Chart for Conversation Trends */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-none lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold dark:text-white">Conversation Trends</CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px] h-8 text-sm bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Total conversations across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockConversationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#eee"} />
                    <XAxis dataKey="name" stroke={isDarkMode ? "#aaa" : "#666"} />
                    <YAxis stroke={isDarkMode ? "#aaa" : "#666"} />
                    <RechartsTooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#555' : '#ddd' }} />
                    <Legend />
                    <Line type="monotone" dataKey="whatsapp" name="WhatsApp" stroke="#EB6C33" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="website" name="Website" stroke="#4791FF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bot Usage Distribution Pie Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold dark:text-white">Bot Usage Distribution</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Platform distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockBotUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockBotUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#555' : '#ddd' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Overview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Overview */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-none">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold dark:text-white">Your Services</CardTitle>
                  
                </div>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Overview of your active services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockServiceData.map((service) => (
                      <TableRow key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <TableCell className="font-medium dark:text-white">{service.name}</TableCell>
                        <TableCell>
                          <Badge className={`${service.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2 dark:text-white">{service.usage}%</span>
                            <Progress value={service.usage} className="h-2 w-20 bg-gray-200 dark:bg-gray-700" />
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">{service.lastActivity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          
        </div>
      </>
    );
  };

  return (
    <div className={`min-h-screen font-raleway ${isDarkMode ? 'dark bg-[#252422] text-white' : 'bg-white text-black'}`}>
      {/* Navbar */}
      <nav className="border-b-2 py-4 px-6 flex justify-between items-center bg-white dark:bg-[#252422] sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#EB6C33]">DuneFox <span className='text-black dark:text-white text-xl'>Console</span></h1>
        <div className="flex items-center space-x-4">
          {/* Notifications Bell */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Bell className="text-gray-700 dark:text-gray-300 cursor-pointer hover:text-[#EB6C33]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Moon className="text-gray-300" /> : <Sun className="text-gray-700" />}
          </button>

          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md cursor-pointer">
                <span className="text-[#EB6C33] font-semibold">{userDetails?.firstName?.charAt(0) || 'U'}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={()=>router.push('/console/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {isOnboarded ? <DashboardContent /> : <OnboardingComponent />}
      </div>
    </div>
  );
};

export default DashboardPage;