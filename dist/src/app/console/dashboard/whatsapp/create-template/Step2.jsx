"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const MediaTabs_1 = __importDefault(require("@/components/whatsapp/components/template/MediaTabs"));
const HeaderInput_1 = __importDefault(require("@/components/whatsapp/components/template/HeaderInput"));
const MediaUpload_1 = __importDefault(require("@/components/whatsapp/components/template/MediaUpload"));
const BodyText_1 = __importDefault(require("@/components/whatsapp/components/template/BodyText"));
const ButtonsSection_1 = __importDefault(require("@/components/whatsapp/components/template/ButtonsSection"));
const FooterInput_1 = __importDefault(require("@/components/whatsapp/components/template/FooterInput"));
const PreviewPane_1 = __importDefault(require("@/components/whatsapp/components/template/PreviewPane"));
const Step2 = ({ onNext, onPrevious, activeMediaTab, setActiveMediaTab, headerText, setHeaderText, bodyText, setBodyText, footerText, setFooterText, mediaFile, setMediaFile, buttons, setButtons, templateName, setTemplateName, }) => {
    return (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Left Pane - Form */}
      <div className="form-pane">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          Edit Template
        </h2>

        <MediaTabs_1.default activeMediaTab={activeMediaTab} setActiveMediaTab={setActiveMediaTab}/>

        {activeMediaTab === "text" && (<HeaderInput_1.default headerText={headerText} setHeaderText={setHeaderText}/>)}

        {activeMediaTab !== "text" && (<MediaUpload_1.default activeMediaTab={activeMediaTab} mediaFile={mediaFile} setMediaFile={setMediaFile}/>)}

        <BodyText_1.default bodyText={bodyText} setBodyText={setBodyText} activeMediaTab={activeMediaTab} headerText={headerText} mediaFile={mediaFile} footerText={footerText} buttons={buttons} templateName={templateName}/>

        <ButtonsSection_1.default buttons={buttons} setButtons={setButtons}/>

        <FooterInput_1.default footerText={footerText} setFooterText={setFooterText}/>

        <div className="flex justify-between mt-6">
          <button onClick={onPrevious} className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm">
            Previous
          </button>
          <button onClick={onNext} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Next
          </button>
        </div>
      </div>

      {/* Right Pane - Preview */}
      <div className="preview-pane">
        <PreviewPane_1.default activeMediaTab={activeMediaTab} headerText={headerText} bodyText={bodyText} mediaFile={mediaFile} footerText={footerText} buttons={buttons} templateName={templateName}/>
      </div>
    </div>);
};
exports.default = Step2;
