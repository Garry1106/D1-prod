'use client'

import { useClerk } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUserContext } from '@/context/user/UserContext'; // Import UserContext
import {
  LayoutDashboard,
  Package,
  BarChart2,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageCircle,
  Laptop,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserProducts } from "@/actions/user";
import { motion } from 'framer-motion';
import Image from "next/image";

// Nav items with updated href for all items except Dashboard
const navItems = [
  { icon: LayoutDashboard, label: 'Console', href: '/console' },
  { icon: Package, label: 'Services', href: '/console/services' },
  { icon: BarChart2, label: 'Analytics', href: '/console/analytics' },
  { icon: HelpCircle, label: 'Support', href: '/console/support' },
  { icon: User, label: 'Profile', href: '/console/profile' },
];

export function Sidebar() {
  const { signOut, user } = useClerk(); // Use Clerk to get current user's clerkId
  const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // State to hold products
  const [loading, setLoading] = useState(true); // State to manage loading status
  const pathname = usePathname();

  // Use dark mode context
  const { isDarkMode, toggleDarkMode } = useUserContext();

  // Fetch products for the user when the component mounts
  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        try {
          const userProducts = await getUserProducts(user.id); // Use the user's clerkId
          setProducts(userProducts); // Set the products in state
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };

      fetchProducts(); // Call the function to fetch the products
    }
  }, [user]); // Only run effect when user data is available

  // Skeleton Loader for Sidebar Items
  const SkeletonSidebarItem = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-2 p-2 rounded-lg"
    >
      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
      {!collapsed && <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />}
    </motion.div>
  );

  // Skeleton Loader for Products
  const SkeletonProductItem = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-2 p-2 rounded-lg"
    >
      {!collapsed && <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />}
    </motion.div>
  );

  return (
    <div
      className={cn(
        'flex flex-col h-screen transition-all duration-300 border-r',
        isDarkMode 
          ? 'bg-[#252422] text-white border-gray-500' 
          : 'bg-white text-black border-gray-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <Image
          src="/images/logo.png"
          alt="Dunefox Logo"
          width={110}
          height={100}
          className="" 
        />}
        <div className="flex items-center space-x-2">
          
          
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hover:bg-[#EB6C33] hover:text-white",
              isDarkMode ? 'text-white' : 'text-black'
            )}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {loading ? (
            // Render skeleton items while loading
            Array.from({ length: navItems.length }).map((_, index) => (
              <li key={index}>
                <SkeletonSidebarItem />
              </li>
            ))
          ) : (
            // Render actual nav items once loaded
            navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.href === '/console' && pathname === '/console') ||
                pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 p-2 rounded-lg transition-colors',
                      'hover:bg-[#EB6C33] hover:text-white',
                      isActive ? 'bg-[#EB6C33] text-white' : (
                        isDarkMode 
                          ? 'text-gray-300 hover:text-white' 
                          : 'text-black-300'
                      )
                    )}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })
          )}

          {/* Horizontal Line Above Services Section */}
          <hr className={cn(
            "border-gray-300 my-4",
            isDarkMode && "border-gray-500"
          )} />

          {/* Services Icon (Always Visible) */}
          <li>
            <div className={cn(
              'flex items-center p-2 rounded-lg',
              collapsed ? 'justify-center' : 'space-x-2',
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            )}>
              <Package size={20} className="flex-shrink-0" />
              {!collapsed && <h3 className="text-lg font-semibold">Services</h3>}
            </div>
          </li>

          {/* Render skeleton products while loading */}
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <li key={index}>
                <SkeletonProductItem />
              </li>
            ))
          ) : (
            // Render actual products once loaded
            products.map((product) => {
              const ProductIcon = product.name.toLowerCase() === 'whatsapp' ? MessageCircle : Laptop;

              return (
                <li key={product.id}>
                  <Link
                    href={`/console/dashboard/${product.name.toLowerCase()}`} // Link to the product-specific page
                    className={cn(
                      'flex items-center space-x-2 p-2 rounded-lg transition-colors',
                      'hover:bg-[#EB6C33] hover:text-white',
                      pathname === `/console/services/${product.name}` 
                        ? 'bg-[#EB6C33] text-white' 
                        : (isDarkMode ? 'text-gray-300' : 'text-black-300')
                    )}
                  >
                    <ProductIcon size={20} className="flex-shrink-0" />
                    {!collapsed && <span>{product.name}</span>} {/* Display product name */}
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className={cn(
            "flex justify-start items-center space-x-2 w-full p-2 rounded-lg hover:bg-[#EB6C33] hover:text-white",
            isDarkMode 
              ? 'text-gray-300 hover:text-white' 
              : 'text-black-300'
          )}
          onClick={() => signOut()}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}