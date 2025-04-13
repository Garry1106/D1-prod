"use strict";
// src/hooks/useUserDetails.ts
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserDetails = void 0;
const react_1 = require("react");
const nextjs_1 = require("@clerk/nextjs");
const index_1 = require("@/actions/user/index"); // Import the new service function
const index_2 = require("@/actions/user/index"); // Import the update service function
const useUserDetails = () => {
    const { user } = (0, nextjs_1.useUser)(); // Clerk hook to get authenticated user data
    const [userDetails, setUserDetails] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    // States for update operation
    const [isUpdating, setIsUpdating] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [successMessage, setSuccessMessage] = (0, react_1.useState)(null);
    // Fetch user details on component mount
    (0, react_1.useEffect)(() => {
        if (user === null || user === void 0 ? void 0 : user.id) {
            const fetchUserDetails = async () => {
                try {
                    const data = await (0, index_1.getUserDetails)(user.id);
                    console.log("User Data is: ", data);
                    setUserDetails(data); // Use the new service
                }
                catch (error) {
                    console.error("Error fetching user details:", error);
                }
                finally {
                    setLoading(false);
                }
            };
            fetchUserDetails();
        }
    }, [user]);
    // Function to handle updating user and products
    const updateUserAndProduct = async (formData, productType, clerkId) => {
        setIsUpdating(true);
        setError(null);
        setSuccessMessage(null);
        try {
            // Directly call the service function to update user and products
            const result = await (0, index_2.createProductForUser)(formData, productType, clerkId);
            console.log(result.message);
        }
        catch (err) {
            setError(err.message || "An unknown error occurred");
        }
        finally {
            setIsUpdating(false);
        }
    };
    // Function to check if the user has purchased a product
    const hasPurchasedProduct = async (userId) => {
        try {
            // Call the service function to check for the user's products in the database
            const result = await (0, index_1.checkUserProduct)(userId);
            // If products exist for the user, return true, otherwise false
            return result;
        }
        catch (error) {
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
        hasPurchasedProduct, // Expose the function to check if the user has purchased the product
    };
};
exports.useUserDetails = useUserDetails;
