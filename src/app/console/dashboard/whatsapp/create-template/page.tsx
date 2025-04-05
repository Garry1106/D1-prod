"use client";
import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { FaCheck, FaCog, FaEdit, FaFileAlt } from "react-icons/fa";
import { Cog, Edit, FileText } from 'lucide-react';
const CreateTemplatePage = () => {
  const [step, setStep] = useState(1);

  // State for Step 1
  const [selectedCategory, setSelectedCategory] = useState("Marketing");
  const [templateLanguage, setTemplateLanguage] = useState("en_US");
  const [templateName, setTemplateName] = useState("");

  // State for Step 2
  const [activeMediaTab, setActiveMediaTab] = useState<
    "text" | "image" | "video" | "document" // Removed "none"
  >("text"); // Updated initial state to "text" (or another valid value)
  const [headerText, setHeaderText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [buttons, setButtons] = useState<
    { type: string; text: string; url?: string; phone_number?: string }[] // Removed offerCode, added phone_number
  >([]);

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= step) setStep(stepNumber);
  };

  // Steps definition
  const steps = [
    { title: "Setup", icon: <Cog /> },
    { title: "Content", icon: <Edit /> },
    { title: "Review", icon: <FileText /> },
  ];

  return (
    <div className="p-6 bg-white min-h-screen w-full ">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          WhatsApp Template Builder
        </h1>
        <p className="text-sm text-gray-600">
          Create & customize your template
        </p>
      </div>

      {/* Timeline */}
      <div className="relative flex items-center justify-between w-full md:w-[30%] mx-auto mb-6">
        {steps.map((stepItem, index) => (
          <React.Fragment key={index}>
            {/* Step Icon */}
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleStepClick(index + 1)}
            >
              <div
                className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 md:p-1 rounded-full transition-all duration-300
            ${
              step > index + 1
                ? "bg-green-500 text-white"
                : step === index + 1
                ? "bg-[#41b658] text-white shadow-md"
                : "bg-gray-300 text-black"
            }`}
              >
                {step > index + 1 ? <FaCheck size={14} /> : stepItem.icon}
              </div>
              <span
                className={`mt-1 text-xs md:text-sm font-medium ${
                  step >= index + 1 ? "text-[#41b658]" : "text-black"
                }`}
              >
                {stepItem.title}
              </span>
            </div>

            {/* Progress Bar */}
            {index < steps.length - 1 && (
              <div className="relative flex-1 mx-2 pb-4">
                <div className="w-full h-[3px] bg-gray-300 relative">
                  <div
                    className={`absolute top-0 left-0 h-[3px] bg-[#41b658] rounded-full transition-all duration-500 ease-in-out ${
                      step > index + 1
                        ? "w-full"
                        : step === index + 1
                        ? "w-1/8"
                        : "w-0"
                    }`}
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-md shadow-sm w-full">
        {step === 1 && (
          <Step1
            onNext={() => setStep(2)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            templateLanguage={templateLanguage}
            setTemplateLanguage={setTemplateLanguage}
            templateName={templateName}
            setTemplateName={setTemplateName}
          />
        )}
        {step === 2 && (
          <Step2
            onNext={() => setStep(3)}
            onPrevious={() => setStep(1)}
            activeMediaTab={activeMediaTab}
            setActiveMediaTab={setActiveMediaTab}
            headerText={headerText}
            setHeaderText={setHeaderText}
            bodyText={bodyText}
            setBodyText={setBodyText}
            footerText={footerText}
            setFooterText={setFooterText}
            mediaFile={mediaFile}
            setMediaFile={setMediaFile}
            buttons={buttons}
            setButtons={setButtons}
            templateName={templateName}
            setTemplateName={setTemplateName}
          />
        )}
        {step === 3 && (
          <Step3
            onPrevious={() => setStep(2)}
            selectedCategory={selectedCategory}
            templateLanguage={templateLanguage}
            headerText={headerText}
            bodyText={bodyText}
            footerText={footerText}
            mediaFile={mediaFile}
            buttons={buttons}
            activeMediaTab={activeMediaTab}
            templateName={templateName}
          />
        )}
      </div>
    </div>
  );
};

export default CreateTemplatePage;
