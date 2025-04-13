"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WhatsappForm;
const StepForm_1 = __importDefault(require("@/components/forms/Whatsapp/StepForm"));
const FormContext_1 = require("@/context/whatsapp/FormContext");
function WhatsappForm() {
    return (<FormContext_1.FormProvider>
      <StepForm_1.default /> {/* Your form component */}
    </FormContext_1.FormProvider>);
}
