'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, MessageCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';


import { useRouter } from 'next/navigation';
import {  getTenantConfigByClerk } from '@/lib/mongodb';
import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';
import { useUserDetails } from '@/hooks/user/use-user';

type Props = {};

// Demo WhatsApp data
const messages = [
  { sender: 'John Doe', message: 'Hey, how are you?', timestamp: '2024-11-12 10:00 AM' },
  { sender: 'Jane Smith', message: 'Can we reschedule the meeting?', timestamp: '2024-11-12 09:30 AM' },
  { sender: 'Alice Johnson', message: 'Here are the documents you requested.', timestamp: '2024-11-12 09:00 AM' },
  { sender: 'Bob Brown', message: 'Thanks for the update!', timestamp: '2024-11-12 08:45 AM' },
];

export default function WhatsAppDashboard({ }: Props) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasProduct, setHasProduct] = useState<boolean | null>(null);
  const { hasPurchasedProduct, userDetails } = useUserDetails();
  const { tenantConfig, setTenantConfig } = useTenantConfig(); // Using context for tenantConfig

  useEffect(() => {
    const fetchTenantConfig = async () => {
      if (userDetails?.userId) {
        const productStatus = await hasPurchasedProduct(userDetails.userId);
        setHasProduct(productStatus?.name === "Whatsapp-bot");
        setIsLoaded(true);
      }

      if (!tenantConfig && userDetails?.clerkId) { // Avoid re-fetching if config is already set
        const fetchedConfig = await getTenantConfigByClerk(userDetails.clerkId);
        console.log("Fetched Config is", fetchedConfig);
        const completeConfig = {
          ...fetchedConfig,
        };
        console.log("Complete Config is", completeConfig)
        setTenantConfig(completeConfig)

        
      }
    };

    fetchTenantConfig();
    setIsClient(true);
  }, [userDetails, tenantConfig, setTenantConfig]);

  console.log("Tenant Config in Context is",tenantConfig)

  if (hasProduct === false) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
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
            <MessageCircle className="w-6 h-6 text-[#41b658]" />
            <h1 className="text-3xl font-semibold text-[#41b658]">WhatsApp Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600 mt-2 font-bold">Welcome back, {tenantConfig?.businessName || 'User'}</p>
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
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#252422' }}>Recent Messages</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message, index) => (
                  <TableRow key={index} className="border-t">
                    <TableCell>{message.sender}</TableCell>
                    <TableCell>{message.message}</TableCell>
                    <TableCell>{message.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.section>
      )}


      {/* Financial Overview and Customer Order Section */}
      {isClient && ( // Render only on the client
        <motion.section
          className="grid grid-cols-3 gap-4 mt-3"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          {/* Paid Invoices and Funds Received */}
          <motion.div
            className="col-span-1 flex flex-col space-y-4 bg-white shadow-md rounded-lg p-6" // Added shadow and white background
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
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
          </motion.div>

          {/* Customer Order Table */}
          <motion.div
            className="col-span-2 bg-white shadow-md rounded-lg p-6" // Added shadow and white background
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#252422' }}>Recent Campaigns</h2>
            <div className="overflow-y-auto max-h-48">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ color: '#252422' }}>Campaign</TableHead>
                    <TableHead style={{ color: '#252422' }}>Status</TableHead>
                    <TableHead style={{ color: '#252422' }}>Engagement</TableHead>
                    <TableHead style={{ color: '#252422' }}>Messages Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ color: '#403D39' }}>Summer Sale</TableCell>
                    <TableCell style={{ color: '#403D39' }}>Active</TableCell>
                    <TableCell style={{ color: '#403D39' }}>72%</TableCell>
                    <TableCell style={{ color: '#403D39' }}>1,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: '#403D39' }}>New Year Offer</TableCell>
                    <TableCell style={{ color: '#403D39' }}>Completed</TableCell>
                    <TableCell style={{ color: '#403D39' }}>85%</TableCell>
                    <TableCell style={{ color: '#403D39' }}>2,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: '#403D39' }}>Product Launch</TableCell>
                    <TableCell style={{ color: '#403D39' }}>Pending</TableCell>
                    <TableCell style={{ color: '#403D39' }}>45%</TableCell>
                    <TableCell style={{ color: '#403D39' }}>800</TableCell>
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
