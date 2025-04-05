export async function sendMessageToAPI(baseUrl, tenantId, uuid, message) {
    try {
        const response = await fetch(`${baseUrl}/api/conversation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenantId, uuid, message }),
        });

        if (!response.ok) throw new Error(`API responded with status ${response.status}`);
        const data = await response.json();
        return data.aiResponse || 'No response available.';
    } catch (error) {
        console.error('Error communicating with the API:', error);
        return 'Error communicating with the server.';
    }
}