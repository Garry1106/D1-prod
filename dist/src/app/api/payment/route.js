"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const razorpay_1 = __importDefault(require("razorpay"));
// Ensure environment variables are defined
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay environment variables are not set");
}
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});
// Handle POST requests
async function POST(request) {
    try {
        const { amount, currency } = await request.json();
        const options = {
            amount: amount, // Amount in paise (e.g., 74900 for ₹749)
            currency: currency || "INR",
            receipt: "order_receipt_" + Math.floor(Math.random() * 1000),
        };
        const order = await razorpay.orders.create(options);
        return server_1.NextResponse.json(order, { status: 200 });
    }
    catch (error) {
        console.error("Error creating Razorpay order:", error);
        return server_1.NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
    }
}
// Handle other HTTP methods (optional)
async function GET() {
    return server_1.NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
async function PUT() {
    return server_1.NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
async function DELETE() {
    return server_1.NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
