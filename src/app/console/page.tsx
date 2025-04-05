'use client';

import { useUserDetails } from '@/hooks/user/use-user'; // Custom hook for fetching user details
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BarChart, Activity, ShoppingCart, Users, CreditCard, Bell, Search, Moon, Sun, ChevronLeft, ChevronRight, Loader2, Plus, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useUserContext } from '@/context/user/UserContext'; // Import the UserContext hook
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button'; // Import shadcn button component
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const DashboardPage = () => {
  const { userDetails, loading } = useUserDetails(); // Fetch user details
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [isOnboarded, setIsOnboarded] = useState(true); // Onboarding state
  const itemsPerPage = 5; // Items per page for pagination
  const router = useRouter(); // Initialize useRouter

  console.log("UserDetails in Console page",userDetails)
  
  
  // Use the UserContext for dark mode
  const { isDarkMode, toggleDarkMode } = useUserContext();

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
        <div className="p-6 bg-gray-100">
          {/* Category Selection Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-[180px] animate-pulse" />
          </motion.div>

          {/* Analytics Section Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((_, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* User Activity Chart Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <Card className="shadow-lg">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Purchased Services Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <Card className="shadow-lg">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Onboarding Component
  const OnboardingComponent = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-[70vh]"
      >
        <Card className="shadow-md hover:shadow-md transition-shadow dark:bg-gray-800 w-full max-w-2xl p-8">
          <CardHeader className="text-center">
            {/* Icon and Heading */}
            <div className="flex justify-center mb-6">
              <Activity className="w-16 h-16 text-[#EB6C33] animate-bounce" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Welcome to <span className="text-[#EB6C33]">DuneFox Console</span>!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
              Your one-stop solution for managing bots, analytics, and services. Let's get started!
            </CardDescription>
          </CardHeader>
  
          {/* Get Started Button */}
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => router.push('/console/services')}
              className="bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white py-6 px-8 text-lg font-semibold rounded-full transition-transform transform hover:scale-105"
            >
              <span className="mr-2">Get Started</span>
              <ChevronRight className="w-6 h-6" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen font-raleway ${isDarkMode ? 'dark bg-[#252422] text-white' : 'bg-white text-black'}`}>
      {/* Navbar */}
      <nav className="border-b-2 py-4 px-6 flex justify-between items-center">
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {isOnboarded ? (
          <>
            {/* Analytics Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Analytics Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-200">Active Users</CardTitle>
                    <CardDescription>+15% from last month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Users className="text-[#EB6C33]" />
                      <span className="text-xl font-bold">1,250</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-200">Total Sales</CardTitle>
                    <CardDescription>+20% from last month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="text-[#EB6C33]" />
                      <span className="text-xl font-bold">$56,120</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-200">Transactions</CardTitle>
                    <CardDescription>+12% from last month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="text-[#EB6C33]" />
                      <span className="text-xl font-bold">2,480</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-200">Messages Sent</CardTitle>
                    <CardDescription>+18% from last month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Activity className="text-[#EB6C33]" />
                      <span className="text-xl font-bold">56,342</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Recent Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Activity</h2>
              <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700 dark:text-gray-200">Activity Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="text-green-500" />
                      <div>
                        <p className="text-sm">New bot created: WhatsApp Bot</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <AlertCircle className="text-yellow-500" />
                      <div>
                        <p className="text-sm">User John Doe added</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Bars Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Progress Overview</h2>
              <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <CardHeader>
                  <CardTitle className="text-gray-700 dark:text-gray-200">Task Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Bot Development</span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                        <div className="bg-[#EB6C33] h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">User Onboarding</span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                        <div className="bg-[#EB6C33] h-2.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Events Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Upcoming Events</h2>
              <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <CardHeader>
                  <CardTitle className="text-gray-700 dark:text-gray-200">Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Calendar className="text-[#EB6C33]" />
                      <div>
                        <p className="text-sm">Monthly Review Meeting</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">October 25, 2023</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Calendar className="text-[#EB6C33]" />
                      <div>
                        <p className="text-sm">Product Launch</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">November 10, 2023</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Activity Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">User Activity</h2>
              <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <CardHeader>
                  <CardTitle className="text-gray-700 dark:text-gray-200">Activity Overview</CardTitle>
                  <CardDescription>Visual representation of user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <BarChart className="text-[#EB6C33]" />
                    <span className="text-gray-500 dark:text-gray-300 ml-2">Chart Placeholder</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Purchased Services Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Purchased Services</h2>
              <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <CardHeader>
                  <CardTitle className="text-gray-700 dark:text-gray-200">Service List</CardTitle>
                  <CardDescription>Details of all purchased services</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Whatsapp Bot</TableCell>
                        <TableCell>Standard</TableCell>
                        <TableCell>$25</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>WebChatbot</TableCell>
                        <TableCell>Premium</TableCell>
                        <TableCell>$50</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <ChevronLeft className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage}</span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage * itemsPerPage >= 10} // Replace 10 with total items
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <ChevronRight className="text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <OnboardingComponent />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;