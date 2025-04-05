'use client'

import Chart from '@/components/analytics/chart';
import MetricCard from '@/components/analytics/metric-card'
import React from 'react'
import { motion } from 'framer-motion';

type Props = {}

// Demo products data
const purchasedProducts = [
  { name: 'Wireless Mouse', price: '$25.00', date: '2024-11-12' },
  { name: 'Bluetooth Headphones', price: '$75.00', date: '2024-11-10' },
  { name: 'Laptop Stand', price: '$45.00', date: '2024-11-08' },
  { name: 'Portable Charger', price: '$30.00', date: '2024-11-05' },
];

export default function Analyticspage({ }: Props) {
  return (
    <motion.div 
      className='p-8'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.header 
        className="flex justify-between items-center mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Title and Description */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Page</h1>
          <p className="text-base text-gray-600 mt-2">Get an overview of the latest sales, products, and user activity.</p>
        </div>
      </motion.header>

      {/* Main Analytics Section */}
      <motion.section 
        className="grid grid-cols-4 gap-4 mt-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <MetricCard title="Orders" value={201} change="+2.4%" frequency="Monthly" color="#EB5E28" />
        <MetricCard title="Approved" value={36} change="+3.6%" frequency="Monthly" color="#EB5E28" />
        <MetricCard title="Users" value={4890} change="1.2%" frequency="Weekly" color="#EB5E28" />
        <MetricCard title="Subscriptions" value={1201} change="2.5%" frequency="Daily" color="#EB5E28" />
      </motion.section>

      {/* Purchased Products Section */}
      <motion.section 
        className="bg-white shadow-md rounded-lg p-4 mt-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#252422' }}>Products Purchased</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2 font-medium" style={{ color: '#252422' }}>Product</th>
                <th className="py-2 font-medium" style={{ color: '#252422' }}>Price</th>
                <th className="py-2 font-medium" style={{ color: '#252422' }}>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {purchasedProducts.map((product, index) => (
                <motion.tr 
                  key={index} 
                  className="border-t"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                >
                  <td className="py-1" style={{ color: '#403D39' }}>{product.name}</td>
                  <td className="py-1" style={{ color: '#403D39' }}>{product.price}</td>
                  <td className="py-1" style={{ color: '#403D39' }}>{product.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Charts and Detailed Information Section */}
      <motion.section 
        className="grid grid-cols-3 gap-4 mt-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {/* Sales Dynamics Chart */}
        <motion.div 
          className="col-span-2" 
          style={{ backgroundColor: '#FFF', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '16px' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#252422' }}>Sales Dynamics</h2>
          <Chart />
        </motion.div>

        {/* Overall User Activity Chart */}
        <motion.div 
          style={{ backgroundColor: '#FFF', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '16px' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#252422' }}>Overall User Activity</h2>
          <Chart />
        </motion.div>
      </motion.section>

      {/* Financial Overview and Customer Order Section */}
      <motion.section 
        className="grid grid-cols-3 gap-4 mt-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        {/* Paid Invoices and Funds Received */}
        <motion.div 
          className="col-span-1 flex flex-col space-y-4" 
          style={{ backgroundColor: '#FFF', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '16px' }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#252422' }}>Paid Invoices</h3>
            <p className="text-2xl font-bold" style={{ color: '#EB5E28' }}>$30,256.23</p>
            <p className="text-sm" style={{ color: '#CCC589' }}>Current Fiscal Year</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#252422' }}>Funds Received</h3>
            <p className="text-2xl font-bold" style={{ color: '#EB5E28' }}>$150,256.23</p>
            <p className="text-sm" style={{ color: '#CCC589' }}>Current Fiscal Year</p>
          </div>
        </motion.div>

        {/* Customer Order Table */}
        <motion.div 
          className="col-span-2" 
          style={{ backgroundColor: '#FFF', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '16px' }}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#252422' }}>Customer Order</h2>
          <div className="overflow-y-auto max-h-48">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="py-2 font-medium" style={{ color: '#252422' }}>Name</th>
                  <th className="py-2 font-medium" style={{ color: '#252422' }}>Address</th>
                  <th className="py-2 font-medium" style={{ color: '#252422' }}>Status</th>
                  <th className="py-2 font-medium" style={{ color: '#252422' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-1" style={{ color: '#403D39' }}>Prexa</td>
                  <td className="py-1" style={{ color: '#403D39' }}>California</td>
                  <td className="py-1" style={{ color: '#403D39' }}>Processed</td>
                  <td className="py-1" style={{ color: '#403D39' }}>$230</td>
                </tr>
                <tr className="border-t">
                  <td className="py-1" style={{ color: '#403D39' }}>Marina</td>
                  <td className="py-1" style={{ color: '#403D39' }}>Texas</td>
                  <td className="py-1" style={{ color: '#403D39' }}>Processed</td>
                  <td className="py-1" style={{ color: '#403D39' }}>$450</td>
                </tr>
                <tr className="border-t">
                  <td className="py-1" style={{ color: '#403D39' }}>Alex</td>
                  <td className="py-1" style={{ color: '#403D39' }}>New York</td>
                  <td className="py-1" style={{ color: '#403D39' }}>Cancelled</td>
                  <td className="py-1" style={{ color: '#403D39' }}>$150</td>
                </tr>
                <tr className="border-t">
                  <td className="py-1" style={{ color: '#403D39' }}>Robert</td>
                  <td className="py-1" style={{ color: '#403D39' }}>London</td>
                  <td className="py-1" style={{ color: '#403D39' }}>Delivered</td>
                  <td className="py-1" style={{ color: '#403D39' }}>$900</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}