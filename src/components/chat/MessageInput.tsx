import React, { useState } from "react";

interface MessageInputProps {
  selectedUuid: string | null;
  tenantId: string | null;
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  selectedUuid,
  tenantId,
  onSendMessage,
}) => {
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);

  const handleSendMessage = async () => {
    if ((!message.trim() && !file) || !selectedUuid || !tenantId) {
      console.warn("Cannot send message. Missing required fields.");
      return;
    }

    setIsUploading(true);

    try {
      let fileUrl = "";

      // Upload file if it exists
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/sendfile", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const result = await response.json();
        fileUrl = result.fileUrl;
      }

      // Send the message (text or file URL)
      onSendMessage(fileUrl || message);

      // Clear inputs
      setMessage("");
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Set file preview details
    setFile(selectedFile);
    setFilePreview({
      name: selectedFile.name,
      size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
      type: selectedFile.type,
    });
  };

  const handleCancelUpload = () => {
    setFile(null);
    setFilePreview(null);
  };

  return (
    <div className="flex flex-col mt-4">
      {/* File Preview Section */}
      {filePreview && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{filePreview.name}</p>
              <p className="text-xs text-gray-500">
                {filePreview.size} - {filePreview.type}
              </p>
            </div>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              onClick={handleCancelUpload}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="flex">
        {/* File Upload Button */}
        <label className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          📁
        </label>

        {/* Message Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 ml-2"
        />

        {/* Send Button */}
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSendMessage}
          disabled={!selectedUuid || !tenantId || (!message.trim() && !file) || isUploading}
        >
          {isUploading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;