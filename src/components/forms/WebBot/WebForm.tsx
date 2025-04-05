"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Building,
  Globe,
  Flag,
  Bot,
  Upload,
  Loader2,
} from "lucide-react";
import { useWebFormContext } from "@/context/webbot/FormContext";
import { useUserDetails } from "@/hooks/user/use-user";
import { toast } from "react-toastify";
import axios from "axios";

type BusinessFormProps = {
  onNext: () => void;
};

export const WebForm = ({ onNext }: BusinessFormProps) => {
  const { formData, setFormData } = useWebFormContext();
  const { userDetails } = useUserDetails();
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    if (userDetails?.clerkId) {
      setFormData((prevData) => ({
        ...prevData,
        webForm: {
          ...prevData.webForm,
          clerkId: userDetails.clerkId,
        },
      }));
    }
  }, [userDetails, setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        webForm: {
          ...prevData.webForm,
          orgFile: e.target.files![0],
        },
      }));
    }
  };

  const handleUpload = async () => {
    if (!formData.webForm.orgFile && !formData.webForm.websiteUrl) {
      toast.error("Please select a file to upload or enter a website URL.");
      return;
    }
  
    if (!formData.webForm.clerkId && !userDetails?.clerkId) {
      toast.error("User details are missing. Please log in again.");
      return;
    }

    setIsUploading(true);
  
    const apiFormData = new FormData();
    const clerkId = formData.webForm.clerkId || userDetails?.clerkId;
    apiFormData.append("clerkId", clerkId as string);
  
    if (formData.webForm.orgFile) {
      apiFormData.append("document", formData.webForm.orgFile);
    }
  
    if (formData.webForm.websiteUrl) {
      apiFormData.append("url", formData.webForm.websiteUrl);
    }

    const newFormData = [...apiFormData.entries()]

    console.log("New Form Data", newFormData)
    // Log FormData for debugging
  
    try {
      toast.info("Uploading document...");
      const result = await axios.post('/api/webbot/upload', newFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
     
      console.log("Hello World")
      console.log("API Response:", result)
      toast.success("Document uploaded and processed successfully!");
  
      setFormData((prevData) => ({
        ...prevData,
        webForm: {
          ...prevData.webForm,
          embedUrl: result.data.embedUrl,
          s3Url: result.data.url || "",
        },
      }));
  
      await onNext();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.response?.data?.message || "Please try again"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const countries = [
    "United States",
    "India",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Japan",
    "Australia",
  ];

  return (
    <div className="bg-white space-y-6 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            <Building className="inline-block mr-2 h-4 w-4" />
            Business Name
          </Label>
          <Input
            id="businessName"
            type="text"
            value={formData.webForm.businessName}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                webForm: {
                  ...prevData.webForm,
                  businessName: e.target.value,
                },
              }))
            }
            placeholder="Enter your business name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-flame-500 focus:ring-flame-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <Label htmlFor="country" className="block text-sm font-medium text-gray-700">
            <Flag className="inline-block mr-2 h-4 w-4 mb-1" />
            Country
          </Label>
          <Select
            value={formData.webForm.country}
            onValueChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                webForm: {
                  ...prevData.webForm,
                  country: value,
                },
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country, index) => (
                <SelectItem key={index} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="botName" className="block text-sm font-medium text-gray-700">
            <Bot className="inline-block mr-2 h-4 w-4" />
            Bot Name
          </Label>
          <Input
            id="botName"
            type="text"
            value={formData.webForm.botName}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                webForm: {
                  ...prevData.webForm,
                  botName: e.target.value,
                },
              }))
            }
            placeholder="Enter your bot name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-flame-500 focus:ring-flame-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <Label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
            <Globe className="inline-block mr-2 h-4 w-4" />
            Website URL
          </Label>
          <Input
            id="websiteUrl"
            type="url"
            value={formData.webForm.websiteUrl}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                webForm: {
                  ...prevData.webForm,
                  websiteUrl: e.target.value,
                },
              }))
            }
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-flame-500 focus:ring-flame-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter your website URL to extract business information
          </p>
        </div>

        <div>
          <Label htmlFor="orgFile" className="block text-sm font-medium text-gray-700">
            <Upload className="inline-block mr-2 h-4 w-4" />
            Organization Info File
          </Label>
          <Input
            id="orgFile"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
          <p className="mt-1 text-xs text-gray-500">
            Upload a PDF file containing your organization's detailed information
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-[#EB6C33] hover:bg-[#D45A2A] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="inline-block mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>

        <Button
          type="submit"
          className="bg-[#EB6C33] hover:bg-[#D45A2A] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
          disabled={!formData.webForm.embeddedUrl}
        >
          Next
        </Button>
      </div>
    </div>
  );
};