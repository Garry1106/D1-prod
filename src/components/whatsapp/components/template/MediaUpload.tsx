import React from "react";
import { FaTrash, FaExchangeAlt } from "react-icons/fa";

interface MediaUploadProps {
  activeMediaTab: "text" | "image" | "video" | "document"; // Removed "none"
  mediaFile: File | null;
  setMediaFile: (file: File | null) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  activeMediaTab,
  mediaFile,
  setMediaFile,
}) => {
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
  };

  const handleReplaceMedia = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      activeMediaTab === "image"
        ? "image/*"
        : activeMediaTab === "video"
        ? "video/*"
        : activeMediaTab === "document"
        ? ".pdf,.doc,.docx"
        : "";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleMediaUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };
    input.click();
  };

  return (
    <div className="mb-6">
      {mediaFile ? (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-sm text-gray-700 break-all">
            {mediaFile.name}
          </span>
          <div className="flex gap-2">
            <button
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={handleRemoveMedia}
            >
              <FaTrash className="text-sm text-red-500" />
            </button>
            <button
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={handleReplaceMedia}
            >
              <FaExchangeAlt className="text-sm text-blue-500" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
          <input
            type="file"
            accept={
              activeMediaTab === "image"
                ? "image/*"
                : activeMediaTab === "video"
                ? "video/*"
                : activeMediaTab === "document"
                ? ".pdf,.doc,.docx"
                : ""
            }
            onChange={handleMediaUpload}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className="text-sm text-gray-700 cursor-pointer text-center"
          >
            Click to upload or drag and drop
          </label>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
