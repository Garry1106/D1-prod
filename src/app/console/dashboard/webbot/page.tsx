'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, LaptopMinimal, MessageCircle, ShieldAlert } from 'lucide-react';
import { useUserDetails } from '@/hooks/user/use-user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { getWebUser } from '@/actions/user';

type Props = {};



const messages = [
  { sender: 'John Doe', message: 'Hey, how are you?', timestamp: '2024-11-12 10:00 AM' },
  { sender: 'Jane Smith', message: 'Can we reschedule the meeting?', timestamp: '2024-11-12 09:30 AM' },
  { sender: 'Alice Johnson', message: 'Here are the documents you requested.', timestamp: '2024-11-12 09:00 AM' },
  { sender: 'Bob Brown', message: 'Thanks for the update!', timestamp: '2024-11-12 08:45 AM' },
];

export default function WhatsAppDashboard({ }: Props) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(true);
  const [hasProduct, setHasProduct] = useState<boolean | null>(true);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasPurchasedProduct, userDetails } = useUserDetails();

  useEffect(() => {
    // Set isClient to true when component mounts (client-side)
    setIsClient(true);
    
    // Get the clerkId from your user context or authentication system
    const fetchUserData = async () => {
      try {
        // Get clerkId from userDetails if available, otherwise use a default or handle appropriately
        const clerkId = userDetails?.clerkId;
        
        if (!clerkId) {
          setError('No user ID available');
          setLoading(false);
          return;
        }
        
        const response = await getWebUser(clerkId)

        console.log("Response in Webbot",response)

       

        // setUserData(response);
        // console.log(userData)
       
        
        // Check if user has purchased the WhatsApp product
        // This could be determined from the userData or from the useUserDetails hook
        
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userDetails, hasPurchasedProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  

  if (!isClient) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
        <Card className="max-w-md w-full p-6 space-y-6 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-blue-600/10 rounded-full">
              <ShieldAlert className="h-8 w-8 text-blue-600" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-blue-600">
              Restricted Access
            </h1>

            <p className="text-gray-600">
              You need to purchase WhatsApp-Bot to access this dashboard. Unlock all features and take your experience to the next level.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full font-medium bg-blue-600 hover:bg-blue-600/90 text-white"
              size="lg"
              onClick={() => router.push('/console/services/whatsapp')}
              aria-label="Purchase WhatsAppBot"
            >
              Purchase Now
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>

            <Button
              variant="outline"
              className="w-full border-blue-600/20 text-blue-600 hover:bg-blue-600/5"
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

  return (
    <motion.div
      className="p-4 min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.header
        className="flex justify-between items-center mb-4 bg-white shadow-sm rounded-lg p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <div className="flex items-center gap-2">
            <LaptopMinimal className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-semibold text-blue-600">WebChatbot Dashboard</h1>
          </div>
          <p className="text-lg text-gray-700 mt-2 font-bold">
            Welcome back, {userData?.name || 'User'}
          </p>
          <p className="text-base text-gray-600 mt-2">Get an overview of your WhatsApp activity, messages, and user engagement.</p>
        </div>
      </motion.header>

      {/* Recent Messages Section */}
      {isClient && (
        <motion.section
          className="bg-white shadow-sm rounded-lg p-4 mt-3"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Recent Messages</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-600/5">
                  <TableHead className="text-blue-600">Sender</TableHead>
                  <TableHead className="text-blue-600">Message</TableHead>
                  <TableHead className="text-blue-600">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message, index) => (
                  <TableRow key={index} className="border-t hover:bg-blue-600/5">
                    <TableCell className="text-gray-700">{message.sender}</TableCell>
                    <TableCell className="text-gray-700">{message.message}</TableCell>
                    <TableCell className="text-gray-700">{message.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.section>
      )}

      {/* Financial Overview and Customer Order Section */}
      {isClient && (
        <motion.section
          className="grid grid-cols-3 gap-4 mt-3"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          {/* Stats Cards */}
          <motion.div
            className="col-span-1 flex flex-col space-y-4 bg-white shadow-md rounded-lg p-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
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
          </motion.div>

          {/* Campaigns Table */}
          <motion.div
            className="col-span-2 bg-white shadow-md rounded-lg p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <h2 className="text-lg font-semibold mb-2 text-blue-600">Recent Campaigns</h2>
            <div className="overflow-y-auto max-h-48">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-600/5">
                    <TableHead className="text-blue-600">Campaign</TableHead>
                    <TableHead className="text-blue-600">Status</TableHead>
                    <TableHead className="text-blue-600">Engagement</TableHead>
                    <TableHead className="text-blue-600">Messages Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-blue-600/5">
                    <TableCell className="text-gray-700">Summer Sale</TableCell>
                    <TableCell className="text-blue-600">Active</TableCell>
                    <TableCell className="text-gray-700">72%</TableCell>
                    <TableCell className="text-gray-700">1,200</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-blue-600/5">
                    <TableCell className="text-gray-700">New Year Offer</TableCell>
                    <TableCell className="text-blue-600">Completed</TableCell>
                    <TableCell className="text-gray-700">85%</TableCell>
                    <TableCell className="text-gray-700">2,500</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-blue-600/5">
                    <TableCell className="text-gray-700">Product Launch</TableCell>
                    <TableCell className="text-blue-600">Pending</TableCell>
                    <TableCell className="text-gray-700">45%</TableCell>
                    <TableCell className="text-gray-700">800</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </motion.section>
      )}
    </motion.div>
  );
}