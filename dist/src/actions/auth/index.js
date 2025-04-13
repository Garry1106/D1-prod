"use strict";
'use server';
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserRegistration = void 0;
exports.onUserVerification = onUserVerification;
const prisma1_1 = require("@/lib/prisma/prisma1"); // Use singleton instance of PrismaClient
const onUserRegistration = async (clerkId, emailId, name) => {
    console.log("onUserRegistration called with:", { clerkId, emailId, name });
    if (!clerkId || !emailId || !name) {
        console.error("Invalid parameters:", { clerkId, emailId, name });
        return { status: 400, error: "Invalid parameters" };
    }
    const payload = {
        clerkId,
        emailId,
        name, // Store username in MongoDB
        isSubscribed: false,
    };
    try {
        const registered = await prisma1_1.client1.user.create({
            data: payload,
        });
        console.log("User created successfully:", registered);
        return { status: 200, user: registered };
    }
    catch (error) {
        console.error("Error during user registration:", error);
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return { status: 409, error: "User with this email or ID already exists" };
        }
        return { status: 500, error: error.message || "Database error" };
    }
};
exports.onUserRegistration = onUserRegistration;
async function onUserVerification(email) {
    if (!email || typeof email !== 'string') {
        console.error("onUserVerification: Invalid email received:", email);
        throw new Error("The email argument must be a valid non-empty string.");
    }
    console.log("Hello world in user Verification");
    try {
        // Attempt to find the user by email
        const user = await prisma1_1.client1.user.findUnique({
            where: { emailId: email },
            select: { emailId: true },
        });
        console.log("Output after verification");
        if (user) {
            console.log("User verified in the database with email:", user.emailId);
            return true;
        }
        else {
            console.log("User not found in the database for email:", email);
            return false;
        }
    }
    catch (error) {
        console.error("Error during user verification for email", email, ":", error);
        return false;
    }
}
