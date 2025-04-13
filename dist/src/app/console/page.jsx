"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const use_user_1 = require("@/hooks/user/use-user"); // Custom hook for fetching user details
const card_1 = require("@/components/ui/card");
const table_1 = require("@/components/ui/table");
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const UserContext_1 = require("@/context/user/UserContext"); // Import the UserContext hook
const tooltip_1 = require("@/components/ui/tooltip");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button"); // Import shadcn button component
const navigation_1 = require("next/navigation"); // Import useRouter for navigation
const DashboardPage = () => {
    var _a;
    const { userDetails, loading } = (0, use_user_1.useUserDetails)(); // Fetch user details
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1); // Pagination state
    const [isOnboarded, setIsOnboarded] = (0, react_1.useState)(true); // Onboarding state
    const itemsPerPage = 5; // Items per page for pagination
    const router = (0, navigation_1.useRouter)(); // Initialize useRouter
    console.log("UserDetails in Console page", userDetails);
    // Use the UserContext for dark mode
    const { isDarkMode, toggleDarkMode } = (0, UserContext_1.useUserContext)();
    if (loading) {
        return (<div className="min-h-screen font-raleway">
        {/* Navbar Skeleton */}
        <nav className="border-b-2 py-4 px-6 flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"/>
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"/>
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"/>
          </div>
        </nav>

        {/* Main Content Skeleton */}
        <div className="p-6 bg-gray-100">
          {/* Category Selection Skeleton */}
          <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"/>
            <div className="h-10 bg-gray-200 rounded w-[180px] animate-pulse"/>
          </framer_motion_1.motion.div>

          {/* Analytics Section Skeleton */}
          <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((_, index) => (<card_1.Card key={index} className="shadow-lg">
                  <card_1.CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"/>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"/>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"/>
                  </card_1.CardContent>
                </card_1.Card>))}
            </div>
          </framer_motion_1.motion.div>

          {/* User Activity Chart Skeleton */}
          <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"/>
            <card_1.Card className="shadow-lg">
              <card_1.CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"/>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse"/>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          {/* Purchased Services Skeleton */}
          <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"/>
            <card_1.Card className="shadow-lg">
              <card_1.CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"/>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse"/>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>
        </div>
      </div>);
    }
    // Onboarding Component
    const OnboardingComponent = () => {
        return (<framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-center min-h-[70vh]">
        <card_1.Card className="shadow-md hover:shadow-md transition-shadow dark:bg-gray-800 w-full max-w-2xl p-8">
          <card_1.CardHeader className="text-center">
            {/* Icon and Heading */}
            <div className="flex justify-center mb-6">
              <lucide_react_1.Activity className="w-16 h-16 text-[#EB6C33] animate-bounce"/>
            </div>
            <card_1.CardTitle className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Welcome to <span className="text-[#EB6C33]">DuneFox Console</span>!
            </card_1.CardTitle>
            <card_1.CardDescription className="text-lg text-gray-600 dark:text-gray-400">
              Your one-stop solution for managing bots, analytics, and services. Let's get started!
            </card_1.CardDescription>
          </card_1.CardHeader>
  
          {/* Get Started Button */}
          <card_1.CardFooter className="flex justify-center">
            <button_1.Button onClick={() => router.push('/console/services')} className="bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white py-6 px-8 text-lg font-semibold rounded-full transition-transform transform hover:scale-105">
              <span className="mr-2">Get Started</span>
              <lucide_react_1.ChevronRight className="w-6 h-6"/>
            </button_1.Button>
          </card_1.CardFooter>
        </card_1.Card>
      </framer_motion_1.motion.div>);
    };
    return (<div className={`min-h-screen font-raleway ${isDarkMode ? 'dark bg-[#252422] text-white' : 'bg-white text-black'}`}>
      {/* Navbar */}
      <nav className="border-b-2 py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#EB6C33]">DuneFox <span className='text-black dark:text-white text-xl'>Console</span></h1>
        <div className="flex items-center space-x-4">
          {/* Notifications Bell */}
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger>
                <lucide_react_1.Bell className="text-gray-700 dark:text-gray-300 cursor-pointer hover:text-[#EB6C33]"/>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent>
                <p>Notifications</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>

          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {isDarkMode ? <lucide_react_1.Moon className="text-gray-300"/> : <lucide_react_1.Sun className="text-gray-700"/>}
          </button>

          {/* User Dropdown Menu */}
          <dropdown_menu_1.DropdownMenu>
            <dropdown_menu_1.DropdownMenuTrigger>
              <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md cursor-pointer">
                <span className="text-[#EB6C33] font-semibold">{((_a = userDetails === null || userDetails === void 0 ? void 0 : userDetails.firstName) === null || _a === void 0 ? void 0 : _a.charAt(0)) || 'U'}</span>
              </div>
            </dropdown_menu_1.DropdownMenuTrigger>
            <dropdown_menu_1.DropdownMenuContent>
              <dropdown_menu_1.DropdownMenuItem>Profile</dropdown_menu_1.DropdownMenuItem>
              <dropdown_menu_1.DropdownMenuItem>Settings</dropdown_menu_1.DropdownMenuItem>
              <dropdown_menu_1.DropdownMenuItem>Logout</dropdown_menu_1.DropdownMenuItem>
            </dropdown_menu_1.DropdownMenuContent>
          </dropdown_menu_1.DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {isOnboarded ? (<>
            {/* Analytics Section */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Analytics Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-lg text-gray-700 dark:text-gray-200">Active Users</card_1.CardTitle>
                    <card_1.CardDescription>+15% from last month</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="flex items-center space-x-2">
                      <lucide_react_1.Users className="text-[#EB6C33]"/>
                      <span className="text-xl font-bold">1,250</span>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
                <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-lg text-gray-700 dark:text-gray-200">Total Sales</card_1.CardTitle>
                    <card_1.CardDescription>+20% from last month</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="flex items-center space-x-2">
                      <lucide_react_1.ShoppingCart className="text-[#EB6C33]"/>
                      <span className="text-xl font-bold">$56,120</span>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
                <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-lg text-gray-700 dark:text-gray-200">Transactions</card_1.CardTitle>
                    <card_1.CardDescription>+12% from last month</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="flex items-center space-x-2">
                      <lucide_react_1.CreditCard className="text-[#EB6C33]"/>
                      <span className="text-xl font-bold">2,480</span>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
                <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-lg text-gray-700 dark:text-gray-200">Messages Sent</card_1.CardTitle>
                    <card_1.CardDescription>+18% from last month</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="flex items-center space-x-2">
                      <lucide_react_1.Activity className="text-[#EB6C33]"/>
                      <span className="text-xl font-bold">56,342</span>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </framer_motion_1.motion.div>

            {/* Recent Activity Feed */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mb-8">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Activity</h2>
              <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-lg text-gray-700 dark:text-gray-200">Activity Feed</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <lucide_react_1.CheckCircle className="text-green-500"/>
                      <div>
                        <p className="text-sm">New bot created: WhatsApp Bot</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <lucide_react_1.AlertCircle className="text-yellow-500"/>
                      <div>
                        <p className="text-sm">User John Doe added</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </framer_motion_1.motion.div>

            {/* Progress Bars Section */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Progress Overview</h2>
              <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-gray-700 dark:text-gray-200">Task Progress</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
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
                </card_1.CardContent>
              </card_1.Card>
            </framer_motion_1.motion.div>

            {/* Upcoming Events Section */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Upcoming Events</h2>
              <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-gray-700 dark:text-gray-200">Events</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <lucide_react_1.Calendar className="text-[#EB6C33]"/>
                      <div>
                        <p className="text-sm">Monthly Review Meeting</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">October 25, 2023</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <lucide_react_1.Calendar className="text-[#EB6C33]"/>
                      <div>
                        <p className="text-sm">Product Launch</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">November 10, 2023</p>
                      </div>
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </framer_motion_1.motion.div>

            {/* User Activity Chart Section */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">User Activity</h2>
              <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-gray-700 dark:text-gray-200">Activity Overview</card_1.CardTitle>
                  <card_1.CardDescription>Visual representation of user activity</card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <lucide_react_1.BarChart className="text-[#EB6C33]"/>
                    <span className="text-gray-500 dark:text-gray-300 ml-2">Chart Placeholder</span>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </framer_motion_1.motion.div>

            {/* Purchased Services Section */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Purchased Services</h2>
              <card_1.Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-[#403D39]">
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-gray-700 dark:text-gray-200">Service List</card_1.CardTitle>
                  <card_1.CardDescription>Details of all purchased services</card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <table_1.Table>
                    <table_1.TableHeader>
                      <table_1.TableRow>
                        <table_1.TableHead>Service Name</table_1.TableHead>
                        <table_1.TableHead>Subscription</table_1.TableHead>
                        <table_1.TableHead>Price</table_1.TableHead>
                      </table_1.TableRow>
                    </table_1.TableHeader>
                    <table_1.TableBody>
                      <table_1.TableRow>
                        <table_1.TableCell>Whatsapp Bot</table_1.TableCell>
                        <table_1.TableCell>Standard</table_1.TableCell>
                        <table_1.TableCell>$25</table_1.TableCell>
                      </table_1.TableRow>
                      <table_1.TableRow>
                        <table_1.TableCell>WebChatbot</table_1.TableCell>
                        <table_1.TableCell>Premium</table_1.TableCell>
                        <table_1.TableCell>$50</table_1.TableCell>
                      </table_1.TableRow>
                    </table_1.TableBody>
                  </table_1.Table>
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                      <lucide_react_1.ChevronLeft className="text-gray-700 dark:text-gray-300"/>
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage}</span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * itemsPerPage >= 10} // Replace 10 with total items
         className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                      <lucide_react_1.ChevronRight className="text-gray-700 dark:text-gray-300"/>
                    </button>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </framer_motion_1.motion.div>
          </>) : (<OnboardingComponent />)}
      </div>
    </div>);
};
exports.default = DashboardPage;
