"use client";
import React from "react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row gap-2 bg-[#ffffff] p-4">
      {/* Form Section on the Right */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center bg-[#ffffff]">
        {children}
      </div>

      {/* Image Section on the Left */}
      <div
        className="w-full lg:w-1/2 relative flex flex-col justify-center items-center rounded-lg overflow-hidden bg-cover bg-center p-8 shadow-lg"
        style={{
          backgroundImage: "url('/images/register-img.jpg')", // Replace with your actual image path
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Optional: Adds a color overlay
          backgroundBlendMode: "overlay", // Ensures overlay effect with opacity
          backgroundPosition: "center",
          backgroundSize: "cover", // Ensures image covers the space
        }}
      >
        {/* Centered Text */}
        <div className="flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-2xl sm:text-4xl md:text-2xl lg:text-3xl font-semibold mb-4">
          Simplify Complexity,<br></br> Amplify Results
          </h1>
          <p className="text-lg sm:text-xl md:text-lg lg:text-xl max-w-2xl">
            Join a platform designed to empower your workflow with cutting-edge tools and seamless collaboration. Whether you're signing up or signing in, take the next step toward achieving your goals faster and smarter.
          </p>
        </div>
      </div>
    </div>
  );
}