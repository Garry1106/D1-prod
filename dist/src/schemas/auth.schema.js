"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInSchema = exports.otpSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
// Sign-up schema validation
// Sign-up schema validation with username field
exports.signUpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    username: zod_1.z.string().min(3, "Username must be at least 3 characters"), // Added username validation
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// OTP schema validation
exports.otpSchema = zod_1.z.object({
    otpCode: zod_1.z.string().length(6, "OTP code must be 6 characters"),
});
// Sign-in schema validation
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
