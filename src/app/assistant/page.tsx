"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Sidebar from "./Sidebar"; // Import the Sidebar component

export default function Home() {
    const [tenantId, setTenantId] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string>("");
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [chatbotVisible, setChatbotVisible] = useState<boolean>(false);
    const [baseUrl, setBaseUrl] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || window.location.origin;
        setBaseUrl(hostUrl);
    }, []);

    const handleTenantChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTenantId(e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!tenantId || (!file && !url)) {
            setUploadStatus("Please provide a tenant ID and either a file or a URL.");
            return;
        }

        const formData = new FormData();
        formData.append("tenantId", tenantId);

        if (file) {
            formData.append("document", file);
        } else if (url) {
            formData.append("url", url);
        }

        try {
            setUploadStatus("Uploading and processing document...");
            const response = await axios.post(
                `${baseUrl}/api/upload-document`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setUploadStatus("Document uploaded and processed successfully!");
            localStorage.setItem("tenantId", tenantId);
            setChatbotVisible(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setUploadStatus(`Upload failed: ${error.response?.data?.message || "An error occurred"}`);
            } else {
                setUploadStatus("An unexpected error occurred.");
            }
        }
    };

    const handleChatsClick = () => {
        if (tenantId) {
            router.push(`/chats/${tenantId}`);
        } else {
            alert("Please upload a document or enter a URL first.");
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#121212] text-[#e0e0e0]">
            {/* Sidebar */}
            <Sidebar tenantId={tenantId} onChatsClick={handleChatsClick} />

            {/* Main Content */}
            <div className="flex flex-col items-center p-8 space-y-6 ml-64 w-full">
                <h1 className="text-3xl font-bold mb-4">Tenant Chatbot Document Upload</h1>

                <form onSubmit={handleUpload} className="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-xl">
                    <div className="flex flex-col mb-6">
                        <label htmlFor="tenantId" className="text-lg font-medium mb-2">Tenant ID:</label>
                        <input
                            type="text"
                            id="tenantId"
                            value={tenantId}
                            onChange={handleTenantChange}
                            className="p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Enter Tenant ID"
                            required
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <label htmlFor="document" className="text-lg font-medium mb-2">Upload Document:</label>
                        <input
                            type="file"
                            id="document"
                            onChange={handleFileChange}
                            className="p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <label htmlFor="url" className="text-lg font-medium mb-2">Or Enter Website URL:</label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={handleUrlChange}
                            className="p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Enter Website URL"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white font-medium rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                    >
                        Upload Document or Scrape Website
                    </button>
                </form>

                {uploadStatus && (
                    <p className="mt-6 text-center text-lg font-medium">
                        {uploadStatus}
                    </p>
                )}



                {chatbotVisible && tenantId && (
                    <div className="mt-12 w-full max-w-3xl">
                        <h2 className="text-xl font-bold mb-4">Chatbot Embed Code</h2>
                        <pre className="bg-gray-900 p-6 rounded-lg shadow-lg overflow-x-auto text-white">
                            <code>
                                {`<style>
#chatbot-iframe {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 200px;
    height: 500px;
    border: none;
    z-index: 1000;
}
</style>
<iframe 
  id="chatbot-iframe" 
  src="${baseUrl}/${tenantId}" 
  frameborder="0">
</iframe>`}
                            </code>
                        </pre>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    `<style>
#chatbot-iframe {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 200px;
    height: 800px;
    border: none;
    z-index: 1000;
}
</style>
<iframe 
  id="chatbot-iframe" 
  src="${baseUrl}/${tenantId}" 
  frameborder="0">
</iframe>`
                                );
                                alert("Code copied to clipboard!");
                            }}
                            className="mt-4 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Copy Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}