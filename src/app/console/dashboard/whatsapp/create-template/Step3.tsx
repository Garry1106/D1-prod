"use client";
import ButtonsReview from "@/components/whatsapp/components/template/ButtonsReview";
import ContentReview from "@/components/whatsapp/components/template/ContentReview";
import MediaReview from "@/components/whatsapp/components/template/MediaReview";
import PreviewPane from "@/components/whatsapp/components/template/PreviewPane";
import SuccessPopup from "@/components/whatsapp/components/template/SuccessPopup";
import TemplateDetails from "@/components/whatsapp/components/template/TemplateDetails";
import React, { useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';

interface Step3Props {
  onPrevious: () => void;
  selectedCategory: string;
  templateLanguage: string;
  headerText: string;
  bodyText: string;
  footerText: string;
  mediaFile: File | null;
  buttons: {
    type: string;
    text: string;
    url?: string;
    phone_number?: string;
  }[];
  activeMediaTab: "text" | "image" | "video" | "document";
  templateName: string;
}

const Step3: React.FC<Step3Props> = ({
  onPrevious,
  selectedCategory,
  templateLanguage,
  headerText,
  bodyText,
  footerText,
  mediaFile,
  buttons,
  activeMediaTab,
  templateName,
}) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get access token and WAID from the tenant config context
  const { tenantConfig } = useTenantConfig();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    // Validate if we have the necessary credentials
    if (!tenantConfig?.accessToken || !tenantConfig?.waba_id) {
      setError("Missing WhatsApp credentials. Please check your configuration.");
      setIsSubmitting(false);
      return;
    }

    let mediaUrl = null;
    let mediaID = null;

    try {
      // Step 1: Upload media file if present
      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);
        formData.append("fileName", mediaFile.name);
        
        // Pass access token and WAID to the API
        formData.append("accessToken", tenantConfig.accessToken);
        formData.append("waba_id", tenantConfig.waba_id);

        const uploadResponse = await fetch("/api/Whatsapp/drive_me", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Failed to upload media file");
        }

        const { responseData } = await uploadResponse.json();
        if (activeMediaTab) {
          mediaID = responseData;
          console.log("Media uploaded successfully:", mediaID);
        }
      }

      // Step 2: Create the template payload
      const payload = {
        name: templateName,
        language: templateLanguage,
        category: selectedCategory,
        components: [
          {
            type: "HEADER",
            format: activeMediaTab.toLocaleLowerCase(), // "TEXT", "IMAGE", "VIDEO", or "DOCUMENT"
            ...(activeMediaTab.toLocaleLowerCase() === "text"
              ? { text: headerText }
              : {
                example: {
                  header_handle: [mediaID]
                }
              }
            )
          },
          {
            type: "BODY",
            text: bodyText
          },
          ...(footerText ? [{
            type: "FOOTER",
            text: footerText
          }] : []),
          ...(buttons.length > 0
            ? [{
              type: "BUTTONS",
              buttons: buttons.map((button) => {
                const buttonType = button.type.toUpperCase();
                return {
                  type: buttonType,
                  text: button.text,
                  ...(buttonType === "URL" && { url: button.url }),
                  ...(buttonType === "PHONE_NUMBER" && { phone_number: button.phone_number })
                };
              })
            }]
            : [])
        ],
        // Pass credentials for the template API
        accessToken: tenantConfig.accessToken,
        waid: tenantConfig.waba_id
      };

      // Step 3: Submit the payload
      const response = await fetch("/api/Whatsapp/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to submit the template"
        );
      }

      const data = await response.json();
      console.log("Template submitted successfully:", data);

      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error submitting template:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid-container">
      {/* Left Pane - Review Summary */}
      <div className="form-pane">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          Review and Confirm
        </h2>

        {/* Template Details */}
        <TemplateDetails
          selectedCategory={selectedCategory}
          templateLanguage={templateLanguage}
        />

        {/* Content Review */}
        <ContentReview
          headerText={headerText}
          bodyText={bodyText}
          footerText={footerText}
        />

        {/* Media Review */}
        {activeMediaTab !== "text" && (
          <MediaReview activeMediaTab={activeMediaTab} mediaFile={mediaFile} />
        )}

        {/* Buttons Review */}
        {buttons.length > 0 && <ButtonsReview buttons={buttons} />}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onPrevious}
            className="px-5 py-2 text-black bg-white rounded-lg shadow-sm text-sm"
          >
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#41b658] text-white rounded-lg hover:bg[#41b658]/90  text-sm flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Submitting...
              </span>
            ) : (
              <>
                <FaCheck />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Right Pane - Preview */}
      <div className="preview-pane">
        <PreviewPane
          activeMediaTab={activeMediaTab}
          headerText={headerText}
          bodyText={bodyText}
          mediaFile={mediaFile}
          footerText={footerText}
          buttons={buttons}
          templateName={templateName}
        />
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
      )}
    </div>
  );
};

export default Step3;