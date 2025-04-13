"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TenantPage;
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const uuid_1 = require("uuid"); // Import the UUID library
function TenantPage() {
    const pathname = (0, navigation_1.usePathname)(); // Get the current path
    (0, react_1.useEffect)(() => {
        if (!pathname)
            return; // Ensure pathname is available
        const tenantId = pathname.split("/")[1]; // Extract tenantId from the path (assuming /1818 format)
        if (tenantId) {
            let uuid = sessionStorage.getItem("uuid"); // Try to get UUID from sessionStorage
            // Validate the UUID format if it exists
            if (!uuid || !isValidUUID(uuid)) {
                uuid = (0, uuid_1.v4)(); // Generate a new UUID if it doesn't exist or is invalid
                sessionStorage.setItem("uuid", uuid); // Store the new UUID in sessionStorage
            }
            // Redirect to the index.html page with tenantId and uuid as query parameters
            const url = new URL("/index.html", window.location.origin);
            url.searchParams.append("tenantId", tenantId);
            url.searchParams.append("uuid", uuid);
            window.location.href = url.toString();
        }
    }, [pathname]);
    return null; // Nothing to render, redirect happens immediately
}
// Function to validate UUID format
function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}
