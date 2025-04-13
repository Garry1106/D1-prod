// pages/profile.tsx
"use client"
import React from 'react';
import Head from 'next/head';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Mail, User, Edit3, Shield, Activity, Info } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUserDetails } from '@/hooks/user/use-user';
import { Skeleton } from "@/components/ui/skeleton";

// Define user data interface
interface UserData {
  clerkId: string;
  createdAt: {
    date: string;
    time: string;
    timezone: string;
  };
  emailId: string;
  firstName: string;
  lastName: string;
  isSubscribed: boolean;
  updatedAt: {
    date: string;
    time: string;
    timezone: string;
  };
  userId: string;
}

export default function ProfilePage() {
  const { userDetails, loading } = useUserDetails();

  // Prepare date objects from userData if available
  const getAccountAge = () => {
    if (!userDetails) return { days: 0, months: 0 };
    
    const createdDate = new Date(userDetails.createdAt);
    const currentDate = new Date();
    const accountAgeInDays = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const accountAgeInMonths = Math.floor(accountAgeInDays / 30);
    
    return { days: accountAgeInDays, months: accountAgeInMonths };
  };

  // Format date objects
  const formatDateTime = (dateTimeStr: any) => {
    if (!dateTimeStr) return { date: '', time: '', timezone: '' };
    
    const dateObj = new Date(dateTimeStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    };
    
    return {
      date: dateObj.toLocaleDateString('en-US', options),
      time: dateObj.toLocaleTimeString('en-US', timeOptions),
      timezone: 'GMT+0530 (India Standard Time)'
    };
  };

  const accountAge = getAccountAge();
  const createdAtFormatted = userDetails ? formatDateTime(userDetails.createdAt) : null;
  const updatedAtFormatted = userDetails ? formatDateTime(userDetails.updatedAt) : null;

  return (
    <>
      <Head>
        <title>{userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'Loading...'} | Profile</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap" />
      </Head>
      
      <div className="min-h-screen bg-white font-['Raleway'] text-base">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Top Navigation Bar */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#EB6C33] rounded-md flex items-center justify-center text-white text-lg font-bold">
                {!loading && userDetails ? 
                  `${userDetails.firstName.charAt(0)}${userDetails.lastName.charAt(0)}` : 
                  <Skeleton className="w-6 h-6 bg-orange-300/50" />
                }
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            </div>
            <Button variant="outline" className="text-[#EB6C33] border-[#EB6C33] hover:bg-[#EB6C33]/5">
              Edit Profile
            </Button>
          </div>

          {/* Main Content */}
          {loading ? (
            // Loading state
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="shadow-md overflow-hidden border-0">
                  <div className="h-32 bg-[#EB6C33]"></div>
                  <div className="px-6 pb-6 -mt-16 text-center">
                    <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                    <Skeleton className="h-8 w-40 mx-auto mt-4" />
                    <Skeleton className="h-4 w-60 mx-auto mt-2" />
                    <Skeleton className="h-6 w-32 mx-auto mt-4" />
                    <Separator className="my-6" />
                    <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <Skeleton className="h-12 w-full mb-6" />
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          ) : (
            // Content when data is loaded
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Overview */}
              <div className="lg:col-span-1">
                <Card className="shadow-md overflow-hidden border-0">
                  <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500"></div>
                  <div className="px-6 pb-6 -mt-16 text-center">
                    <Avatar className="h-32 w-32 mx-auto ring-4 ring-white bg-[#EB6C33]">
                      <AvatarFallback className="text-3xl font-bold text-white">
                        {userDetails?.firstName.charAt(0)}{userDetails?.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">{userDetails?.firstName} {userDetails?.lastName}</h1>
                    <div className="flex items-center justify-center mt-2">
                      <Mail className="h-4 w-4 text-[#EB6C33] mr-2" />
                      <p className="text-gray-600 text-base">{userDetails?.emailId}</p>
                    </div>
                    <div className="mt-4">
                      {userDetails?.isSubscribed ? (
                        <Badge className="bg-[#EB6C33] hover:bg-[#EB6C33]/90 px-3 py-1">Premium Subscriber</Badge>
                      ) : (
                        <Badge variant="outline" className="px-3 py-1">Free Tier</Badge>
                      )}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-[#EB6C33]">{accountAge.months}</p>
                        <p className="text-xs text-gray-500">Months</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#EB6C33]">{accountAge.days}</p>
                        <p className="text-xs text-gray-500">Days</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#EB6C33]">
                          <Shield className="h-6 w-6 mx-auto text-[#EB6C33]" />
                        </p>
                        <p className="text-xs text-gray-500">Premium</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Technical Details Card */}
                <Card className="shadow-md mt-6 border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-gray-800 flex items-center text-xl">
                      <Info className="mr-2 h-5 w-5 text-[#EB6C33]" />
                      Technical Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-base text-gray-500">Clerk ID</p>
                        <div className="flex items-center mt-1">
                          <p className="font-medium text-gray-800 text-base break-all">{userDetails?.clerkId}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-base text-gray-500">User ID</p>
                        <div className="flex items-center mt-1">
                          <p className="font-medium text-gray-800 text-base break-all">{userDetails?.userId}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Details Tabs */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
                    <TabsTrigger value="settings" className="text-base">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    {/* Account Status Card */}
                    <Card className="shadow-sm mb-6 border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-gray-800 flex items-center text-lg">
                          <User className="mr-2 h-5 w-5 text-[#EB6C33]" />
                          Account Status
                        </CardTitle>
                        <CardDescription className="text-base">
                          Summary of your account status and subscription
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#EB6C33]/5 p-4 rounded-lg">
                            <p className="text-base font-medium text-[#EB6C33]">Subscription Status</p>
                            <div className="mt-2 flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${userDetails?.isSubscribed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <p className="font-medium text-gray-800 text-base">
                                {userDetails?.isSubscribed ? "Active Premium Plan" : "Free Tier"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-[#EB6C33]/5 p-4 rounded-lg">
                            <p className="text-base font-medium text-[#EB6C33]">Account Age</p>
                            <div className="mt-2">
                              <p className="font-medium text-gray-800 text-base">{accountAge.months} months ({accountAge.days} days)</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Timeline Card */}
                    <Card className="shadow-sm border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-gray-800 flex items-center text-lg">
                          <Clock className="mr-2 h-5 w-5 text-[#EB6C33]" />
                          Account Timeline
                        </CardTitle>
                        <CardDescription className="text-base">
                          History of account creation and updates
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="relative pl-8 border-l-2 border-[#EB6C33]/20 pb-6">
                            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#EB6C33]"></div>
                            <div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-[#EB6C33] mr-2" />
                                <p className="text-base font-semibold text-gray-800">Account Created</p>
                              </div>
                              <p className="mt-1 font-medium text-gray-700">{createdAtFormatted?.date}</p>
                              <p className="text-sm text-gray-600">{createdAtFormatted?.time}</p>
                              <p className="text-xs text-gray-500">{createdAtFormatted?.timezone}</p>
                            </div>
                          </div>
                          
                          <div className="relative pl-8 border-l-2 border-[#EB6C33]/20">
                            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#EB6C33]"></div>
                            <div>
                              <div className="flex items-center">
                                <Edit3 className="h-4 w-4 text-[#EB6C33] mr-2" />
                                <p className="text-base font-semibold text-gray-800">Last Updated</p>
                              </div>
                              <p className="mt-1 font-medium text-gray-700">{updatedAtFormatted?.date}</p>
                              <p className="text-sm text-gray-600">{updatedAtFormatted?.time}</p>
                              <p className="text-xs text-gray-500">{updatedAtFormatted?.timezone}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <Card className="shadow-sm border-0">
                      <CardHeader>
                        <CardTitle className="text-gray-800 flex items-center text-lg">
                          <User className="mr-2 h-5 w-5 text-[#EB6C33]" />
                          Account Settings
                        </CardTitle>
                        <CardDescription className="text-base">
                          Manage your account preferences and details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">Profile Information</p>
                              <p className="text-base text-gray-600">Update your account details</p>
                            </div>
                            <Button variant="outline" className="text-[#EB6C33] border-[#EB6C33] hover:bg-[#EB6C33]/5">
                              Edit
                            </Button>
                          </div>
                          
                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">Subscription Plan</p>
                              <p className="text-base text-gray-600">
                                {userDetails?.isSubscribed ? "Premium Plan - Active" : "Free Tier"}
                              </p>
                            </div>
                            <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                              {userDetails?.isSubscribed ? "Manage" : "Upgrade"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}