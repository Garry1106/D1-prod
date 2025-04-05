"use client";
import React from "react";
import MediaTabs from "@/components/whatsapp/components/template/MediaTabs";
import HeaderInput from "@/components/whatsapp/components/template/HeaderInput";
import MediaUpload from "@/components/whatsapp/components/template/MediaUpload";
import BodyText from "@/components/whatsapp/components/template/BodyText";
import ButtonsSection from "@/components/whatsapp/components/template/ButtonsSection";
import FooterInput from "@/components/whatsapp/components/template/FooterInput";
import PreviewPane from "@/components/whatsapp/components/template/PreviewPane";

interface Step2Props {
  onNext: () => void;
  onPrevious: () => void;
  activeMediaTab: "text" | "image" | "video" | "document";
  setActiveMediaTab: (tab: "text" | "image" | "video" | "document") => void;
  headerText: string;
  setHeaderText: (text: string) => void;
  bodyText: string;
  setBodyText: (text: string) => void;
  footerText: string;
  setFooterText: (text: string) => void;
  mediaFile: File | null;
  setMediaFile: (file: File | null) => void;
  buttons: {
    type: string;
    text: string;
    url?: string;
    phone_number?: string;
  }[];
  setButtons: (
    buttons: {
      type: string;
      text: string;
      url?: string;
      phone_number?: string;
    }[]
  ) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
}

const Step2: React.FC<Step2Props> = ({
  onNext,
  onPrevious,
  activeMediaTab,
  setActiveMediaTab,
  headerText,
  setHeaderText,
  bodyText,
  setBodyText,
  footerText,
  setFooterText,
  mediaFile,
  setMediaFile,
  buttons,
  setButtons,
  templateName,
  setTemplateName,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Left Pane - Form */}
      <div className="form-pane">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          Edit Template
        </h2>

        <MediaTabs
          activeMediaTab={activeMediaTab}
          setActiveMediaTab={setActiveMediaTab}
        />

        {activeMediaTab === "text" && (
          <HeaderInput headerText={headerText} setHeaderText={setHeaderText} />
        )}

        {activeMediaTab !== "text" && (
          <MediaUpload
            activeMediaTab={activeMediaTab}
            mediaFile={mediaFile}
            setMediaFile={setMediaFile}
          />
        )}

        <BodyText
          bodyText={bodyText}
          setBodyText={setBodyText}
          activeMediaTab={activeMediaTab}
          headerText={headerText}
          mediaFile={mediaFile}
          footerText={footerText}
          buttons={buttons}
          templateName={templateName}
        />

        <ButtonsSection buttons={buttons} setButtons={setButtons} />

        <FooterInput footerText={footerText} setFooterText={setFooterText} />

        <div className="flex justify-between mt-6">
          <button
            onClick={onPrevious}
            className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Next
          </button>
        </div>
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
    </div>
  );
};

export default Step2;