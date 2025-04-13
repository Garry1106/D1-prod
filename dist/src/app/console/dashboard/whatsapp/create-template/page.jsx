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
const react_1 = __importStar(require("react"));
const Step1_1 = __importDefault(require("./Step1"));
const Step2_1 = __importDefault(require("./Step2"));
const Step3_1 = __importDefault(require("./Step3"));
const fa_1 = require("react-icons/fa");
const lucide_react_1 = require("lucide-react");
const CreateTemplatePage = () => {
    const [step, setStep] = (0, react_1.useState)(1);
    // State for Step 1
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)("Marketing");
    const [templateLanguage, setTemplateLanguage] = (0, react_1.useState)("en_US");
    const [templateName, setTemplateName] = (0, react_1.useState)("");
    // State for Step 2
    const [activeMediaTab, setActiveMediaTab] = (0, react_1.useState)("text"); // Updated initial state to "text" (or another valid value)
    const [headerText, setHeaderText] = (0, react_1.useState)("");
    const [bodyText, setBodyText] = (0, react_1.useState)("");
    const [footerText, setFooterText] = (0, react_1.useState)("");
    const [mediaFile, setMediaFile] = (0, react_1.useState)(null);
    const [buttons, setButtons] = (0, react_1.useState)([]);
    const handleStepClick = (stepNumber) => {
        if (stepNumber <= step)
            setStep(stepNumber);
    };
    // Steps definition
    const steps = [
        { title: "Setup", icon: <lucide_react_1.Cog /> },
        { title: "Content", icon: <lucide_react_1.Edit /> },
        { title: "Review", icon: <lucide_react_1.FileText /> },
    ];
    return (<div className="p-6 bg-white min-h-screen w-full ">
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
        {steps.map((stepItem, index) => (<react_1.default.Fragment key={index}>
            {/* Step Icon */}
            <div className="flex flex-col items-center cursor-pointer" onClick={() => handleStepClick(index + 1)}>
              <div className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 md:p-1 rounded-full transition-all duration-300
            ${step > index + 1
                ? "bg-green-500 text-white"
                : step === index + 1
                    ? "bg-[#41b658] text-white shadow-md"
                    : "bg-gray-300 text-black"}`}>
                {step > index + 1 ? <fa_1.FaCheck size={14}/> : stepItem.icon}
              </div>
              <span className={`mt-1 text-xs md:text-sm font-medium ${step >= index + 1 ? "text-[#41b658]" : "text-black"}`}>
                {stepItem.title}
              </span>
            </div>

            {/* Progress Bar */}
            {index < steps.length - 1 && (<div className="relative flex-1 mx-2 pb-4">
                <div className="w-full h-[3px] bg-gray-300 relative">
                  <div className={`absolute top-0 left-0 h-[3px] bg-[#41b658] rounded-full transition-all duration-500 ease-in-out ${step > index + 1
                    ? "w-full"
                    : step === index + 1
                        ? "w-1/8"
                        : "w-0"}`} style={{ top: "50%", transform: "translateY(-50%)" }}/>
                </div>
              </div>)}
          </react_1.default.Fragment>))}
      </div>

      {/* Step Content */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-md shadow-sm w-full">
        {step === 1 && (<Step1_1.default onNext={() => setStep(2)} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} templateLanguage={templateLanguage} setTemplateLanguage={setTemplateLanguage} templateName={templateName} setTemplateName={setTemplateName}/>)}
        {step === 2 && (<Step2_1.default onNext={() => setStep(3)} onPrevious={() => setStep(1)} activeMediaTab={activeMediaTab} setActiveMediaTab={setActiveMediaTab} headerText={headerText} setHeaderText={setHeaderText} bodyText={bodyText} setBodyText={setBodyText} footerText={footerText} setFooterText={setFooterText} mediaFile={mediaFile} setMediaFile={setMediaFile} buttons={buttons} setButtons={setButtons} templateName={templateName} setTemplateName={setTemplateName}/>)}
        {step === 3 && (<Step3_1.default onPrevious={() => setStep(2)} selectedCategory={selectedCategory} templateLanguage={templateLanguage} headerText={headerText} bodyText={bodyText} footerText={footerText} mediaFile={mediaFile} buttons={buttons} activeMediaTab={activeMediaTab} templateName={templateName}/>)}
      </div>
    </div>);
};
exports.default = CreateTemplatePage;
