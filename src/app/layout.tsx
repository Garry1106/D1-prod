
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "@/context/user/UserContext";
import { Raleway } from "next/font/google";
import Watermark from "@/components/watermark";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dunefox - Intelligent Business Solutions",
  description: "Empower your business with intelligent automation solutions",
  keywords: ["AI", "chatbot", "business automation", "customer service"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Add favicon link here */}
          <link rel="icon" href="/window.svg" />
        </head>
        <body className={raleway.className}>
          <UserProvider>
            {/* <Watermark /> */}
            
            {children}
            
          </UserProvider>
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  );
}