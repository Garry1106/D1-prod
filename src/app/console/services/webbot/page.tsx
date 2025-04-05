'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { MessageCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WebbotForm from '@/components/forms/WebBot';



const ProductPage = () => {
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
    }
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


  const [isProcced, setIsProcced] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handlePricingClick = (id: number) => {
    setSelectedPlan(id);
  };

  return (
    <div className="bg-white text-black p-0 min-h-screen">
      {!isProcced ? (
        <div className='p-8'>
          <header className="flex justify-between items-center mb-6">
            {/* Title and Description */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2"><MessageSquare className='w-8 h-8 text-[#EB6C33]'/>Website AI Chatbot</h1>
              <p className="text-base text-gray-600 mt-2">Get an overview of the latest sales, products, and user activity.</p>
            </div>
          </header>

          {/* YouTube Video Section */}
          <div className="mt-6 w-full">
            <h2 className="text-2xl font-bold mb-4">How to Get Started: Tutorial</h2> {/* Add a label */}
            <iframe
              width="100%"
              height="550"
              src="https://www.youtube.com/embed/zAfLcKrbSps" // Replace with the actual video URL
              title="YouTube video"
              frameBorder="0"
              allowFullScreen
              className="rounded-2xl shadow-xl"
            ></iframe>
          </div>

         

          {/* Heading for Proceed Button */}
          <div className="mt-6 mb-4">
            <h3 className="text-xl font-semibold ">Next Step: Setup Form</h3>
            <p className="text-sm text-gray-600">Fill out the form to proceed with the next steps in setting up your Website AI Chatbot.</p>
            {/* Proceed Button */}
            <Button
              className="mt-2 bg-[#EB6C33] text-white"
              onClick={() => setIsProcced(true)}
            >
              Click here to Proceed 
            </Button>
          </div>
        </div>
      ) : (
        // Embed the BusinessForm component here
        <div>
          <WebbotForm/>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
