import React, { useState } from 'react';

interface UrlRendererProps {
  url: string;
}

const UrlRenderer: React.FC<UrlRendererProps> = ({ url }) => {
  const fileExtension = url.split('.').pop()?.toLowerCase();
  const fileName = url.split('/').pop() || 'Document';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
  const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension || '');
  const isDocument = ['pdf', 'doc', 'docx', 'txt'].includes(fileExtension || '');

  // State to control the image pop-out modal
  const [isImageOpen, setIsImageOpen] = useState(false);

  const openImage = () => setIsImageOpen(true);
  const closeImage = () => setIsImageOpen(false);

  if (isImage) {
    return (
      <>
        {/* Clickable image thumbnail */}
        <div className="my-2 cursor-pointer" onClick={openImage}>
          <img
            src={url}
            alt="Uploaded content"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Full-screen image modal */}
        {isImageOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={closeImage}
          >
            <div className="relative max-w-full max-h-full p-4">
              <img
                src={url}
                alt="Uploaded content"
                className="max-w-full max-h-[90vh] rounded-lg shadow-md"
              />
              {/* Close button */}
              <button
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                onClick={closeImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (isVideo) {
    return (
      <div className="my-2">
        <video controls className="max-w-full h-auto rounded-lg shadow-md">
          <source src={url} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (isDocument) {
    return (
      <div className="my-2 p-2 bg-gray-100 rounded-lg shadow-md max-w-[240px]">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            {/* Document icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            {/* Document name */}
            <p className="text-xs font-medium text-gray-800 truncate">{fileName}</p>
            {/* View Document button */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-700 underline"
            >
              View Document
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        {url}
      </a>
    </div>
  );
};

export default UrlRenderer;