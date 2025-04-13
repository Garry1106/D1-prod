"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ButtonsReview_1 = __importDefault(require("@/components/whatsapp/components/template/ButtonsReview"));
const ContentReview_1 = __importDefault(require("@/components/whatsapp/components/template/ContentReview"));
const MediaReview_1 = __importDefault(require("@/components/whatsapp/components/template/MediaReview"));
const PreviewPane_1 = __importDefault(require("@/components/whatsapp/components/template/PreviewPane"));
const SuccessPopup_1 = __importDefault(require("@/components/whatsapp/components/template/SuccessPopup"));
const TemplateDetails_1 = __importDefault(require("@/components/whatsapp/components/template/TemplateDetails"));
const react_1 = __importStar(require("react"));
const fa_1 = require("react-icons/fa");
const TenantConfigContext_1 = require("@/context/whatsapp/TenantConfigContext");
const Step3 = ({ onPrevious, selectedCategory, templateLanguage, headerText, bodyText, footerText, mediaFile, buttons, activeMediaTab, templateName, }) => {
    const [showSuccessPopup, setShowSuccessPopup] = (0, react_1.useState)(false);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // Get access token and WAID from the tenant config context
    const { tenantConfig } = (0, TenantConfigContext_1.useTenantConfig)();
    const handleSubmit = async () => {
        var _a;
        setIsSubmitting(true);
        setError(null);
        // Validate if we have the necessary credentials
        if (!(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.accessToken) || !(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.waba_id)) {
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
                    Object.assign({ type: "HEADER", format: activeMediaTab.toLocaleLowerCase() }, (activeMediaTab.toLocaleLowerCase() === "text"
                        ? { text: headerText }
                        : {
                            example: {
                                header_handle: [mediaID]
                            }
                        })),
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
                                    return Object.assign(Object.assign({ type: buttonType, text: button.text }, (buttonType === "URL" && { url: button.url })), (buttonType === "PHONE_NUMBER" && { phone_number: button.phone_number }));
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
                throw new Error(((_a = errorData.error) === null || _a === void 0 ? void 0 : _a.message) || "Failed to submit the template");
            }
            const data = await response.json();
            console.log("Template submitted successfully:", data);
            setShowSuccessPopup(true);
        }
        catch (error) {
            console.error("Error submitting template:", error);
            setError(error instanceof Error ? error.message : "An error occurred");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="grid-container">
      {/* Left Pane - Review Summary */}
      <div className="form-pane">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          Review and Confirm
        </h2>

        {/* Template Details */}
        <TemplateDetails_1.default selectedCategory={selectedCategory} templateLanguage={templateLanguage}/>

        {/* Content Review */}
        <ContentReview_1.default headerText={headerText} bodyText={bodyText} footerText={footerText}/>

        {/* Media Review */}
        {activeMediaTab !== "text" && (<MediaReview_1.default activeMediaTab={activeMediaTab} mediaFile={mediaFile}/>)}

        {/* Buttons Review */}
        {buttons.length > 0 && <ButtonsReview_1.default buttons={buttons}/>}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={onPrevious} className="px-5 py-2 text-black bg-white rounded-lg shadow-sm text-sm">
            Previous
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2 bg-[#41b658] text-white rounded-lg hover:bg[#41b658]/90  text-sm flex items-center gap-2 shadow-sm">
            {isSubmitting ? (<span className="flex items-center gap-2">
                <fa_1.FaSpinner className="animate-spin"/>
                Submitting...
              </span>) : (<>
                <fa_1.FaCheck />
                <span>Submit</span>
              </>)}
          </button>
        </div>

        {/* Error Message */}
        {error && (<div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>)}
      </div>

      {/* Right Pane - Preview */}
      <div className="preview-pane">
        <PreviewPane_1.default activeMediaTab={activeMediaTab} headerText={headerText} bodyText={bodyText} mediaFile={mediaFile} footerText={footerText} buttons={buttons} templateName={templateName}/>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (<SuccessPopup_1.default onClose={() => setShowSuccessPopup(false)}/>)}
    </div>);
};
exports.default = Step3;
