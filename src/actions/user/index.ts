'use server';

import { client1 } from "@/lib/prisma/prisma1";

// Fetch user details by clerkId
export const getUserDetails = async (clerkId: string) => {
  try {
    const user = await client1.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Extract fields explicitly from the user object and return
    const nameParts = user.name ? user.name.split(" ") : [];
    return {
      userId: user.userId,
      clerkId: user.clerkId,  // Include clerkId in the return data
      emailId: user.emailId,
      isSubscribed: user.isSubscribed,
      firstName: nameParts[0] || "", // First part of the name
      lastName: nameParts[1] || "",  // Second part of the name (if available)
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
};

// Create product and mark the user as subscribed
export const createProductForUser = async (formData: any, productType: string, clerkId: string) => {
  try {
    console.log("Hello world in Product creation");

    // Fetch the user details by clerkId
    const userDetails = await getUserDetails(clerkId); // Get the user details using the clerkId

    console.log("Hello world in Product creation2");

    // Update the user data (to mark subscription as true)
    const updatedUser = await client1.user.update({
      where: { clerkId: clerkId }, // Assuming clerkId is the identifier
      data: {
        isSubscribed: true, // Toggle isSubscribed to true
      },
    });

    console.log("Updated User: ", updatedUser); // Log updated user

    console.log("Product Type:", productType);
    console.log("Form Data:", formData);
    console.log("Updated User ID:", updatedUser.userId);
    console.log("Current Clerk ID:", userDetails.clerkId); // Log the clerkId of the user

    // Sanitize the price string by removing the currency symbol and "/month"
    const priceString = formData.subscription.price;
    const sanitizedPriceString = priceString
      .replace(/[^0-9.]/g, "") // Remove all non-numeric characters except "."
      .replace(/\.(?=.*\.)/g, ""); // Remove extra decimal points (if any)
    const price = parseFloat(sanitizedPriceString);

    if (isNaN(price)) {
      throw new Error(`Invalid price: ${formData.subscription.price}`);
    }

    // Construct the payload for the new product
    const payload = {
      name: productType,
      price: price, // Now price is a number
      userId: updatedUser.userId, // Use userId instead of clerkId
      clerkId: userDetails.clerkId,
      currency:formData.business.currency // Add the current user's clerkId here
    };

    console.log("Payload is:", payload);

    // Create a new product for the specific user
    const newProduct = await client1.product.create({
      data: payload,
    });

    console.log("Created Product: ", newProduct); // Log the newly created product

    return { message: "User and new Product created successfully" };

  } catch (error) {
    console.error("Error creating user and product:", error);
    throw new Error(`Internal Server Error`);
  }
};

// Function to check if the user has any associated products
export const checkUserProduct = async (userId: string | undefined) => {
  try {
    if (!userId) {
      throw new Error("User ID is undefined");
    }

    // Fetch a single product associated with the userId, or return null if no product exists
    const product = await client1.product.findFirst({
      where: {
        userId: userId, // Check for the first product associated with the given userId
      },
    });

    console.log("User product:", product);

    return product; // Return the single product or null if no product exists
  } catch (error) {
    console.error("Error fetching user product:", error);
    throw new Error("Failed to fetch product for the user");
  }
};



// Function to get all products associated with the user using clerkId
export const getUserProducts = async (clerkId: string) => {
  try {
    if (!clerkId) {
      throw new Error("Clerk ID is undefined");
    }

    // Fetch the user by their clerkId
    const user = await client1.user.findUnique({
      where: {
        clerkId: clerkId, // Use clerkId to find the user
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch all products associated with the found userId
    const products = await client1.product.findMany({
      where: {
        userId: user.userId, // Use the userId fetched from the user record
      },
    });

    console.log("User products:", products);

    return products; // Return the list of products for the user
  } catch (error) {
    console.error("Error fetching user products:", error);
    throw new Error("Failed to fetch products for the user");
  }
};