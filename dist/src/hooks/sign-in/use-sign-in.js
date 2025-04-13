"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomSignIn = void 0;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const nextjs_1 = require("@clerk/nextjs");
const react_toastify_1 = require("react-toastify"); // Import toast from React-Toastify
const useCustomSignIn = () => {
    const router = (0, navigation_1.useRouter)();
    const { isLoaded, signIn } = (0, nextjs_1.useSignIn)();
    const { setActive, signOut, user } = (0, nextjs_1.useClerk)();
    const [error, setError] = (0, react_1.useState)(null);
    const handleEmailSignIn = async (email, password) => {
        var _a, _b;
        console.log("Sign-in email:", email);
        console.log("Is sign-in loaded:", isLoaded);
        if (!isLoaded)
            return;
        try {
            // Check if the user exists in your database
            // const userExists = await onUserVerification(email);
            // if (!userExists) {
            //   setError("User does not exist. Please sign up first.");
            //   return;
            // }
            // console.log("User Exists:",userExists)
            // // Sign out any existing session if active
            // if (user) {
            //   await signOut();
            // }
            // Attempt sign-in with email and password
            const signInAttempt = await signIn.create({
                identifier: email,
                password,
                strategy: 'password',
            });
            console.log("SignInAttempt:", signInAttempt.status);
            // Check if sign-in was successful and session was created
            if (signInAttempt.status == 'complete') {
                console.log("hello world");
                await setActive({ session: signInAttempt.createdSessionId });
                react_toastify_1.toast.success("Login Successfully!!");
                router.push("/console");
            }
            else {
                // Instead of using setError, show the toast
                react_toastify_1.toast.error("Invalid credentials. Please check your email and password.");
            }
        }
        catch (err) {
            // Handle Clerk-specific error with a custom message
            if (err.clerkError && err.status === 422 && ((_b = (_a = err.errors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message)) {
                const errorMessage = err.errors[0].message;
                react_toastify_1.toast.error(errorMessage); // Show error using React-Toastify
                console.error(errorMessage);
            }
        }
    };
    const handleGoogleSignIn = async () => {
        if (!isLoaded)
            return;
        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/auth/sso-callback',
                redirectUrlComplete: '/console',
            });
        }
        catch (err) {
            console.error("Google Sign-in error:", err);
            react_toastify_1.toast.error("Failed to sign in with Google. Please try again."); // Show error toast
        }
    };
    return {
        handleEmailSignIn,
        handleGoogleSignIn,
        error,
    };
};
exports.useCustomSignIn = useCustomSignIn;
