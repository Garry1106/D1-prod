"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSOCallback;
const nextjs_1 = require("@clerk/nextjs");
function SSOCallback() {
    // Handle the redirect flow by rendering the
    // prebuilt AuthenticateWithRedirectCallback component.
    // This is the final step in the custom OAuth flow.
    return <nextjs_1.AuthenticateWithRedirectCallback />;
}
