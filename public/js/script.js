import { sendMessageToAPI } from './api.js';
import { setupSocketIO } from './socket.js';

document.addEventListener('DOMContentLoaded', () => {
    const chatIcon = document.getElementById('chat-icon');
    const chatContainer = document.getElementById('chat-container');
    const closeChatButton = document.getElementById('closeChat');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const realtimeSwitch = document.getElementById('realtimeSwitch');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');

    const tenantId = getUrlParam('tenantId');
    let uuid = getUrlParam('uuid'); // Get UUID from URL or generate one
    const baseUrl = window.location.origin;

    let isRealtimeMode = false;
    let fileToSend = null;

    // Initialize UUID and conversation history
    initializeUUIDAndConversation();

    const saveContactBtn = document.getElementById('saveContactBtn');
    const emailForm = document.querySelector('.email-form');
    const emailSuccess = document.getElementById('emailSuccess');

    saveContactBtn.addEventListener('click', async () => {
        const userName = document.getElementById('userName').value.trim();
        const userEmail = document.getElementById('userEmail').value.trim();

        if (!validateEmail(userEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch('/api/saveLead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tenantId, uuid, name: userName, email: userEmail }),
            });

            if (response.ok) {
                emailForm.classList.add('hide');
                setTimeout(() => {
                    emailForm.style.display = 'none';
                }, 700);
                emailSuccess.style.display = 'block';
            } else {
                alert('Failed to save your email. Please try again.');
            }
        } catch (error) {
            console.error('Error saving lead:', error);
            alert('An error occurred. Please try again.');
        }
    });

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function getUrlParam(param) {
        return new URLSearchParams(window.location.search).get(param);
    }

    function toggleRealtimeMode(state) {
        if (state !== undefined) {
            isRealtimeMode = state;
        } else {
            isRealtimeMode = !isRealtimeMode;
        }
        realtimeSwitch.textContent = isRealtimeMode ? 'AI Mode' : 'Realtime';
    }

    const socket = setupSocketIO(baseUrl, tenantId, uuid, toggleRealtimeMode);

    chatIcon.addEventListener('click', () => toggleChat(chatContainer, true, chatIcon));
    closeChatButton.addEventListener('click', () => toggleChat(chatContainer, false, chatIcon));
    sendButton.addEventListener('click', () => handleUserMessage(baseUrl, tenantId, uuid, userInput, socket, isRealtimeMode));
    realtimeSwitch.addEventListener('click', () => toggleRealtimeMode());

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage(baseUrl, tenantId, uuid, userInput, socket, isRealtimeMode);
        }
    });

    uploadButton.addEventListener('click', () => fileInput.click());

    document.getElementById("fileInput").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            fileToSend = file;
            showFilePreview(file);
        }
    });

    async function handleUserMessage(baseUrl, tenantId, uuid, userInput, socket, isRealtimeMode) {
        const userMessage = userInput.value.trim();

        if (userMessage) {
            addMessage(userMessage, 'user');
            saveMessageToLocalStorage(uuid, { sender: 'user', message: userMessage });
            userInput.value = '';

            // Always send the message in real-time via WebSocket
            if (socket) {
                socket.emit('message', {
                    room: uuid,
                    message: userMessage,
                    sender: tenantId,
                    role: "user"
                });
            }

            // If in AI mode, also send the message to the API and broadcast the response
            if (!isRealtimeMode) {
                const botMessage = await sendMessageToAPI(baseUrl, tenantId, uuid, userMessage);
                addMessage(botMessage, 'bot');
                saveMessageToLocalStorage(uuid, { sender: 'bot', message: botMessage });

                // Broadcast the API response via WebSocket with role as "admin"
                if (socket) {
                    socket.emit('message', {
                        room: uuid,
                        message: botMessage,
                        sender: tenantId,
                        role: "admin" // Set role to "admin"
                    });
                }
            }
        }

        if (fileToSend) {
            const formData = new FormData();
            formData.append('file', fileToSend);
            formData.append('tenantId', tenantId);
            formData.append('uuid', uuid);

            try {
                const response = await fetch(`${baseUrl}/api/sendfile`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    const fileUrl = result.fileUrl;

                    addMessage(fileUrl, 'user', 'file');
                    saveMessageToLocalStorage(uuid, { sender: 'user', message: fileUrl, type: 'file' });

                    // Always send the file URL in real-time via WebSocket
                    if (socket) {
                        socket.emit('message', {
                            room: uuid,
                            message: fileUrl,
                            sender: tenantId,
                            role: "user",
                            type: "file"
                        });
                    }

                    // If in AI mode, also send the file URL to the API and broadcast the response
                    if (!isRealtimeMode) {
                        const botMessage = await sendMessageToAPI(baseUrl, tenantId, uuid, fileUrl);
                        addMessage(botMessage, 'bot');
                        saveMessageToLocalStorage(uuid, { sender: 'bot', message: botMessage });

                        // Broadcast the API response via WebSocket with role as "admin"
                        if (socket) {
                            socket.emit('message', {
                                room: uuid,
                                message: botMessage,
                                sender: tenantId,
                                role: "admin" // Set role to "admin"
                            });
                        }
                    }
                } else {
                    addMessage('File upload failed', 'user');
                }
            } catch (error) {
                addMessage('File upload failed', 'user');
            }

            fileToSend = null;
            clearFilePreview();
        }
    }

    function initializeUUIDAndConversation() {
        // Check if UUID exists in the URL
        if (!uuid) {
            uuid = getCookie('uuid'); // Try to get UUID from cookie
            if (!uuid) {
                uuid = generateUUID(); // Generate a new UUID if it doesn't exist
                setCookie('uuid', uuid, 7); // Set UUID in cookie for 7 days
            }
        }

        // Validate the UUID format
        if (!isValidUUID(uuid)) {
            uuid = generateUUID(); // Generate a new UUID if the existing one is invalid
            setCookie('uuid', uuid, 7); // Set the new UUID in cookie for 7 days
        }

        // Load conversation history from local storage
        const conversation = loadConversationFromLocalStorage(uuid);
        conversation.forEach(msg => {
            addMessage(msg.message, msg.sender, msg.type);
        });
    }

    // Validate UUID format
    function isValidUUID(uuid) {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
    }

    // Generate a UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    // Set a cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    // Get a cookie by name
    function getCookie(name) {
        const cookieName = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName)) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
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
});

/**
 * Adds a message to the chat window.
 * @param {string} message - The message content.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} type - The type of message ('text' or 'file').
 */
export function addMessage(message, sender, type = 'text') {
    const messagesDiv = document.getElementById('messages');
    if (!messagesDiv) {
        console.error('Messages div not found!');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    if (type === 'file' || isValidUrl(message)) { // Check if the message is a URL
        // Determine the file type based on the URL extension
        const fileExtension = message.split('.').pop().toLowerCase();
        console.log('File extension:', fileExtension); // Debugging

        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            console.log('Rendering image:', message); // Debugging
            // Render image with click-to-pop-out functionality
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            imageContainer.style.cursor = 'pointer';

            const image = document.createElement('img');
            image.src = message;
            image.alt = 'Uploaded Image';
            image.style.maxWidth = '100%';
            image.style.borderRadius = '10px';
            imageContainer.appendChild(image);

            // Add click event to open image in full screen
            imageContainer.addEventListener('click', () => {
                openImagePopup(message);
            });

            messageDiv.appendChild(imageContainer);
        } else if (['pdf', 'doc', 'docx', 'txt'].includes(fileExtension)) {
            console.log('Rendering document:', message); // Debugging
            // Render document preview (similar to WhatsApp)
            const docPreview = document.createElement('div');
            docPreview.classList.add('doc-preview');
            docPreview.style.display = 'flex';
            docPreview.style.alignItems = 'center';
            docPreview.style.backgroundColor = '#f0f4f8';
            docPreview.style.borderRadius = '10px';
            docPreview.style.padding = '10px';
            docPreview.style.maxWidth = '240px';
            docPreview.style.width = '100%';

            // Document icon
            const docIcon = document.createElement('div');
            docIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#4a5568">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            `;
            docIcon.style.marginRight = '10px';
            docIcon.style.flexShrink = '0';

            // Document details
            const docDetails = document.createElement('div');
            docDetails.style.flex = '1';
            docDetails.style.minWidth = '0'; // Ensure text truncation works

            const docName = document.createElement('div');
            docName.textContent = message.split('/').pop() || 'Document';
            docName.style.fontSize = '14px';
            docName.style.fontWeight = '500';
            docName.style.color = '#2d3748';
            docName.style.whiteSpace = 'nowrap';
            docName.style.overflow = 'hidden';
            docName.style.textOverflow = 'ellipsis'; // Truncate long file names

            const docLink = document.createElement('a');
            docLink.href = message;
            docLink.textContent = 'View Document';
            docLink.target = '_blank';
            docLink.style.fontSize = '12px';
            docLink.style.color = '#4299e1';
            docLink.style.textDecoration = 'none';
            docLink.style.marginTop = '4px';
            docLink.style.display = 'block';

            docDetails.appendChild(docName);
            docDetails.appendChild(docLink);
            docPreview.appendChild(docIcon);
            docPreview.appendChild(docDetails);
            messageDiv.appendChild(docPreview);
        } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
            // Render video player
            const video = document.createElement('video');
            video.src = message;
            video.controls = true;
            video.style.maxWidth = '100%';
            video.style.borderRadius = '10px';
            messageDiv.appendChild(video);
        } else {
            console.log('Unsupported file type:', fileExtension); // Debugging
            // Default to a download link for unknown file types
            const fileLink = document.createElement('a');
            fileLink.href = message;
            fileLink.textContent = 'Download File';
            fileLink.target = '_blank';
            fileLink.style.color = '#5a99f7';
            fileLink.style.textDecoration = 'none';
            fileLink.style.fontWeight = 'bold';
            messageDiv.appendChild(fileLink);
        }
    } else {
        // Render text message
        messageDiv.textContent = message;
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the latest message
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

/**
 * Opens an image in a full-screen popup.
 * @param {string} imageUrl - The URL of the image to display.
 */
function openImagePopup(imageUrl) {
    const popup = document.createElement('div');
    popup.classList.add('image-popup');
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.display = 'flex';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.zIndex = '1000';

    const image = document.createElement('img');
    image.src = imageUrl;
    image.style.maxWidth = '90%';
    image.style.maxHeight = '90%';
    image.style.borderRadius = '10px';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '40px';
    closeButton.style.height = '40px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.style.display = 'flex';
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    popup.appendChild(image);
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
}

/**
 * Toggles the chat container visibility.
 * @param {HTMLElement} chatContainer - The chat container element.
 * @param {boolean} open - Whether to open or close the chat.
 * @param {HTMLElement} chatIcon - The chat icon element.
 */
export function toggleChat(chatContainer, open, chatIcon) {
    chatContainer.classList.toggle('open', open);
    chatIcon.style.display = open ? 'none' : 'flex';
}

/**
 * Shows a preview of the selected file above the input box.
 * @param {File} file - The file to preview.
 */
export function showFilePreview(file) {
    const filePreview = document.getElementById('file-preview');
    filePreview.innerHTML = '';

    const previewContainer = document.createElement('div');
    previewContainer.classList.add('file-preview-container');

    const fileName = document.createElement('span');
    fileName.textContent = file.name;
    previewContainer.appendChild(fileName);

    const removeButton = document.createElement('button');
    removeButton.textContent = '✖';
    removeButton.onclick = () => {
        filePreview.innerHTML = ''; // Clear the preview
        document.getElementById('fileInput').value = ''; // Clear the file input
        filePreview.style.display = 'none'; // Hide preview section
    };
    previewContainer.appendChild(removeButton);

    filePreview.appendChild(previewContainer);
    filePreview.style.display = 'flex'; // Show preview section
}

/**
 * Clears the file preview section.
 */
export function clearFilePreview() {
    const filePreview = document.getElementById('file-preview');
    filePreview.innerHTML = '';
    filePreview.style.display = 'none';
}

/**
 * Switches between chat and contact tabs.
 * @param {string} tab - The tab to switch to ('chat' or 'contact').
 */
export function switchTab(tab) {
    const chatTab = document.getElementById('chat-tab');
    const contactTab = document.getElementById('contact-tab');
    const tabIndicator = document.getElementById('tab-indicator');
    const chatbox = document.getElementById('chatbox');
    const contactUs = document.getElementById('contact-us');
    const chatInputSection = document.getElementById('chat-input-section');

    const isChatTab = tab === 'chat';
    chatTab.classList.toggle('active', isChatTab);
    contactTab.classList.toggle('active', !isChatTab);
    tabIndicator.style.left = isChatTab ? '0' : '50%';
    chatbox.style.display = isChatTab ? 'flex' : 'none';
    contactUs.style.display = isChatTab ? 'none' : 'flex';
    chatInputSection.style.display = isChatTab ? 'flex' : 'none';
}

/**
 * Sends a quick prompt as a message.
 * @param {string} prompt - The prompt to send.
 */
export function sendQuickPrompt(prompt) {
    const userInput = document.getElementById('userInput');
    userInput.value = prompt;
    document.getElementById('sendButton').click();
}