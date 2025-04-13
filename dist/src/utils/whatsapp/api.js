"use strict";
// src/utils/api.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.updateResponseMode = void 0;
// Update response mode (manual or auto)
const updateResponseMode = async (mode, waId, businessPhoneNumber) => {
    try {
        const response = await fetch('/api/update-response-mode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                waId,
                responseMode: mode,
                businessPhoneNumber,
            }),
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error updating response mode:', errorDetails);
            return;
        }
        // Send a predefined agent message based on the mode
        const agentMessage = mode === 'manual' ? 'Agent at your service....' : 'Continue with our AI';
        await (0, exports.sendMessage)(agentMessage, waId, businessPhoneNumber);
        console.log(`Response mode updated to ${mode} for user ${waId}`);
    }
    catch (error) {
        console.error('Error updating response mode:', error);
    }
};
exports.updateResponseMode = updateResponseMode;
// Function to send a message
const sendMessage = async (message, waId, businessPhoneNumber) => {
    try {
        const phoneNumberId = '415502118314042'; // Hardcoded phone number ID for now
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                waId,
                phoneNumberId,
                businessPhoneNumber,
                message,
            }),
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error sending message:', errorDetails);
            return;
        }
        const data = await response.json();
        console.log('Message sent successfully:', data);
    }
    catch (error) {
        console.error('Error sending message:', error);
    }
};
exports.sendMessage = sendMessage;
