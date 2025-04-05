"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the allowed product types using a union type
type ProductType = 'Whatsapp-bot' | 'WebBot' | 'WebCallBot';

// Define the type for the context's state
interface UserContextType {
  productType: ProductType;
  setProductType: (productType: ProductType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with an undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the props for the provider component
interface UserProviderProps {
  children: ReactNode;
}

// Create the provider component
export const UserProvider = ({ children }: UserProviderProps) => {
  // State to hold the product type, with a default value
  const [productType, setProductType] = useState<ProductType>('Whatsapp-bot');
  
  // State to handle dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <UserContext.Provider value={{ 
      productType, 
      setProductType, 
      isDarkMode, 
      toggleDarkMode 
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};