"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("./globals.css");
const nextjs_1 = require("@clerk/nextjs");
const react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
const UserContext_1 = require("@/context/user/UserContext");
const google_1 = require("next/font/google");
const raleway = (0, google_1.Raleway)({ subsets: ["latin"] });
exports.metadata = {
    title: "Dunefox - Intelligent Business Solutions",
    description: "Empower your business with intelligent automation solutions",
    keywords: ["AI", "chatbot", "business automation", "customer service"],
};
function RootLayout({ children, }) {
    return (<nextjs_1.ClerkProvider>
      <html lang="en">
        <head>
          {/* Add favicon link here */}
          <link rel="icon" href="/window.svg"/>
        </head>
        <body className={raleway.className}>
          <UserContext_1.UserProvider>
            {/* <Watermark /> */}
            
            {children}
            
          </UserContext_1.UserProvider>
          <react_toastify_1.ToastContainer />
        </body>
      </html>
    </nextjs_1.ClerkProvider>);
}
