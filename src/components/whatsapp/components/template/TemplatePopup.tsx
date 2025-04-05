import React, { useEffect, useState } from "react";
import { FaTimes, FaSpinner, FaFile, FaFilePdf } from "react-icons/fa";
import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';

interface TemplateButton {
  type: string;
  text: string;
  url?: string;
  phone_number?: string;
}

interface TemplateComponent {
  type: string;
  format?: string;
  text?: string;
  example?: {
    header_handle?: string[];
  };
  buttons?: TemplateButton[];
}

interface TemplateDetails {
  name: string;
  category: string;
  language: string;
  status: string;
  components?: TemplateComponent[];
}

const TemplatePopup = ({
  templateName,
  onClose,
}: {
  templateName: string;
  onClose: () => void;
}) => {
  const [templateDetails, setTemplateDetails] = useState<TemplateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tenantConfig } = useTenantConfig();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTemplateDetails = async () => {
      try {
        if (!tenantConfig || !tenantConfig.waba_id || !tenantConfig.accessToken) {
          throw new Error("Tenant configuration is missing");
        }

        // Create headers with authentication credentials
        const headers = new Headers({
          'x-waba-id': tenantConfig.waba_id,
          'x-access-token': tenantConfig.accessToken,
          'Content-Type': 'application/json'
        });

        const response = await fetch(
          `/api/Whatsapp/templates/${encodeURIComponent(templateName)}?t=${Date.now()}`,
          { 
            signal: abortController.signal,
            headers: headers
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch template details");
        }

        const { data } = await response.json();
        
        if (!data?.name || data.name !== templateName) {
          throw new Error("Template not found or name mismatch");
        }

        setTemplateDetails(data);
        setError(null);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load template details");
          setTemplateDetails(null);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (tenantConfig) {
      fetchTemplateDetails();
    } else {
      setError("Tenant configuration is missing");
      setLoading(false);
    }

    return () => abortController.abort();
  }, [templateName, tenantConfig]);

  const renderMediaContent = (comp: TemplateComponent) => {
    const mediaUrl = comp.example?.header_handle?.[0];
    if (!mediaUrl) return null;

    switch (comp.format) {
      case "IMAGE":
        return (
          <img
            src={mediaUrl}
            alt="Header content"
            className="max-w-full h-40 object-contain rounded-lg border border-gray-200"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
        );
      case "VIDEO":
        return (
          <video
            controls
            className="max-w-full h-40 object-contain rounded-lg border border-gray-200"
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "DOCUMENT":
        return (
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
          >
            {mediaUrl.includes('.pdf') ? (
              <FaFilePdf className="mr-2" />
            ) : (
              <FaFile className="mr-2" />
            )}
            View Document
          </a>
        );
      default:
        return null;
    }
  };

  const renderComponent = (comp: TemplateComponent, index: number) => {
    if (comp.type === "HEADER") {
      const content = comp.format === "TEXT" && comp.text ? (
        <p className="bg-white p-2 rounded border border-gray-200">{comp.text}</p>
      ) : renderMediaContent(comp);

      if (!content) return null;

      return (
        <div key={`header-${index}`} className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2">Header ({comp.format}):</p>
          {content}
        </div>
      );
    }

    if (comp.type === "BUTTONS") {
      return (
        <div key={`buttons-${index}`} className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2">Buttons:</p>
          <div className="space-y-2">
            {comp.buttons?.map((btn, btnIndex) => (
              <div 
                key={`btn-${btnIndex}`} 
                className="bg-blue-50 p-2 rounded border border-blue-200"
              >
                <p className="font-medium">{btn.type.replace(/_/g, ' ')}:</p>
                <p className="mt-1">{btn.text}</p>
                {btn.url && (
                  <p className="mt-1">
                    URL:{" "}
                    <a 
                      href={btn.url} 
                      className="text-blue-600 underline break-all"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {btn.url}
                    </a>
                  </p>
                )}
                {btn.phone_number && (
                  <p className="mt-1">Phone: {btn.phone_number}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={`${comp.type}-${index}`} className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="font-medium">{comp.type}:</p>
        <p className="mt-1 bg-white p-2 rounded border border-gray-200">
          {comp.text || "N/A"}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-2">
          <FaSpinner className="animate-spin text-blue-500" />
          <span>Loading template details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!templateDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative max-h-[90vh] flex flex-col">
        {/* Fixed close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors z-10"
          aria-label="Close"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 space-y-3 text-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 sticky top-0 bg-white pb-4">
            {templateDetails.name}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <p><strong>Category:</strong> {templateDetails.category}</p>
            <p><strong>Language:</strong> {templateDetails.language}</p>
          </div>
          
          <p>
            <strong>Status:</strong>{" "}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              {
                APPROVED: "bg-green-100 text-green-800",
                PENDING: "bg-yellow-100 text-yellow-800",
                REJECTED: "bg-red-100 text-red-800",
              }[templateDetails.status] || "bg-gray-100 text-gray-800"
            }`}>
              {templateDetails.status}
            </span>
          </p>

          {templateDetails.components?.length ? (
            <div className="pr-2"> {/* Padding for scrollbar */}
              <strong>Components:</strong>
              {templateDetails.components.map(renderComponent)}
            </div>
          ) : (
            <p className="text-gray-500">No components available</p>
          )}
        </div>

        {/* Sticky footer button */}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors sticky bottom-0"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TemplatePopup;