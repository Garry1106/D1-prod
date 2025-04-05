import { addMessage } from './script.js';

// Define handleAdminMessage in the global scope
async function handleAdminMessage(message, uuid) {
    console.log('Admin message received:', message); // Debugging

    // Check if the message is a URL
    if (isValidUrl(message)) {
        // Treat it as a file and render it
        addMessage(message, 'admin', 'file');
        saveMessageToLocalStorage(uuid, { sender: 'admin', message: message, type: 'file' });
    } else {
        // Treat it as plain text
        addMessage(message, 'admin', 'text');
        saveMessageToLocalStorage(uuid, { sender: 'admin', message: message, type: 'text' });
    }
}

// Helper function to check if a string is a valid URL
function isValidUrl(string) {
    try {
        new URL(string); // This will throw an error if the string is not a valid URL
        return true;
    } catch (_) {
        return false;
    }
}

export function setupSocketIO(baseUrl, tenantId, uuid, toggleRealtimeModeCallback) {
    if (!tenantId || !uuid) {
        console.error('Missing tenantId or uuid for Socket.IO connection');
        return null;
    }

    // Log the connection setup details for debugging
    console.log('Setting up Socket.IO with the following parameters:', {
        baseUrl,
        tenantId,
        uuid,
    });

    const socket = io(baseUrl, {
        query: { tenantId, uuid },
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        const serverStatusElement = document.getElementById('server-status');
        if (serverStatusElement) {
            serverStatusElement.innerHTML = '<i class="fas fa-info-circle"></i> Connected to server';

            // Remove the "disconnected" class and add the "connected" class
            serverStatusElement.classList.remove('disconnected');
            serverStatusElement.classList.add('connected');
        }

        const joinPayload = { room: uuid, username: tenantId, role: "user" };
        console.log('Emitting join-room with payload:', joinPayload);

        // Emit the join-room event with the payload
        socket.emit('join-room', joinPayload);
    });

    socket.on('disconnect', () => {
        const serverStatusElement = document.getElementById('server-status');
        if (serverStatusElement) {
            serverStatusElement.innerHTML = '<i class="fas fa-info-circle"></i> Disconnected from server';

            // Remove the "connected" class and add the "disconnected" class
            serverStatusElement.classList.remove('connected');
            serverStatusElement.classList.add('disconnected');
        }
    });


    // Add listener for adminMessage
    socket.on('adminMessage', (message) => {
        console.log('Admin message event received:', message); // Debugging
        // Call handleAdminMessage when an admin message is received
        handleAdminMessage(message, uuid);
    });

    socket.on('message', (data) => {
        addMessage(data.message, 'bot');
        saveMessageToLocalStorage(uuid, { sender: 'bot', message: data.message });

        // Log the received message for debugging
        console.log('Received message from server:', data);

        // Toggle real-time mode based on received message
        if (data.message === 'Talking with Human') {
            toggleRealtimeModeCallback(true);
        } else if (data.message === 'Talking with AI') {
            toggleRealtimeModeCallback(false);
        }
    });

    // Emit messages to the server with a specific structure
    socket.on('send-message', (message) => {
        const messagePayload = {
            room: uuid,
            username: tenantId,
            role: "user",
            message: message,
        };
        console.log('Sending message:', messagePayload);
        socket.emit('message', messagePayload);
    });

    return socket;
}

// Save message to local storage
function saveMessageToLocalStorage(uuid, message) {
    const conversation = loadConversationFromLocalStorage(uuid);
    conversation.push(message);
    localStorage.setItem(`chat_${uuid}`, JSON.stringify(conversation));
}

// Load conversation from local storage
function loadConversationFromLocalStorage(uuid) {
    const conversation = localStorage.getItem(`chat_${uuid}`);
    return conversation ? JSON.parse(conversation) : [];
}