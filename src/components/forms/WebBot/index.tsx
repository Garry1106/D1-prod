import { FormProvider } from "@/context/webbot/FormContext";
import { StepwiseForm } from "./StepWiseForm";

export default function WebbotForm() {
  return (
    <FormProvider>
      <StepwiseForm /> {/* Your form component */}
    </FormProvider>
  );
}