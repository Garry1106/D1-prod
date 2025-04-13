"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WebbotForm;
const FormContext_1 = require("@/context/webbot/FormContext");
const StepWiseForm_1 = require("./StepWiseForm");
function WebbotForm() {
    return (<FormContext_1.FormProvider>
      <StepWiseForm_1.StepwiseForm /> {/* Your form component */}
    </FormContext_1.FormProvider>);
}
