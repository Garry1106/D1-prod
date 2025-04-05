// src/hooks/useUserDetails.ts
"use client"

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserDetails, checkUserProduct } from "@/actions/user/index"; // Import the new service function
import { createProductForUser } from "@/actions/user/index"; // Import the update service function

interface UserDetails {
  userId: string;
  clerkId: string;
  emailId: string;
  isSubscribed: boolean;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useUserDetails = () => {
  const { user } = useUser(); // Clerk hook to get authenticated user data
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // States for update operation
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user details on component mount
  useEffect(() => {
    if (user?.id) {
      const fetchUserDetails = async () => {
        try {
          const data = await getUserDetails(user.id);
          console.log("User Data is: ", data);
          setUserDetails(data); // Use the new service
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    }
  }, [user]);

  // Function to handle updating user and products
  const updateUserAndProduct = async (formData: any, productType: any, clerkId: any) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Directly call the service function to update user and products
      const result = await createProductForUser(formData, productType, clerkId);
      console.log(result.message);
    } catch (err) {
      setError((err as Error).message || "An unknown error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to check if the user has purchased a product
  const hasPurchasedProduct = async (userId: string |undefined)=> {
    try {
      // Call the service function to check for the user's products in the database
      const result = await checkUserProduct(userId);
      // If products exist for the user, return true, otherwise false
      return result
    } catch (error) {
      console.error("Error checking product purchase:", error);
      return undefined; // In case of an error, assume the user hasn't purchased the product
    }
  };

  return {
    userDetails,
    loading,
    isUpdating,
    error,
    successMessage,
    updateUserAndProduct, // Expose the function to update user and product
    hasPurchasedProduct,  // Expose the function to check if the user has purchased the product
  };
};
