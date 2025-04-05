import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Ensure environment variables are defined
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay environment variables are not set");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

// Handle POST requests
export async function POST(request: Request) {
  try {
    const { amount, currency } = await request.json();

    const options = {
      amount: amount, // Amount in paise (e.g., 74900 for ₹749)
      currency: currency || "INR",
      receipt: "order_receipt_" + Math.floor(Math.random() * 1000),
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods (optional)
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}