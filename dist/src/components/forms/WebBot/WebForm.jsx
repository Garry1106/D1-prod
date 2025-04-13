"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebForm = void 0;
const react_1 = __importDefault(require("react"));
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const lucide_react_1 = require("lucide-react");
const FormContext_1 = require("@/context/webbot/FormContext");
const use_user_1 = require("@/hooks/user/use-user");
const react_toastify_1 = require("react-toastify");
const axios_1 = __importDefault(require("axios"));
const WebForm = ({ onNext }) => {
    const { formData, setFormData } = (0, FormContext_1.useWebFormContext)();
    const { userDetails } = (0, use_user_1.useUserDetails)();
    const [isUploading, setIsUploading] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        if (userDetails === null || userDetails === void 0 ? void 0 : userDetails.clerkId) {
            setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webForm: Object.assign(Object.assign({}, prevData.webForm), { clerkId: userDetails.clerkId }) })));
        }
    }, [userDetails, setFormData]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onNext();
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webForm: Object.assign(Object.assign({}, prevData.webForm), { orgFile: e.target.files[0] }) })));
        }
    };
    const handleUpload = async () => {
        var _a, _b;
        if (!formData.webForm.orgFile && !formData.webForm.websiteUrl) {
            react_toastify_1.toast.error("Please select a file to upload or enter a website URL.");
            return;
        }
        if (!formData.webForm.clerkId && !(userDetails === null || userDetails === void 0 ? void 0 : userDetails.clerkId)) {
            react_toastify_1.toast.error("User details are missing. Please log in again.");
            return;
        }
        setIsUploading(true);
        const apiFormData = new FormData();
        const clerkId = formData.webForm.clerkId || (userDetails === null || userDetails === void 0 ? void 0 : userDetails.clerkId);
        apiFormData.append("clerkId", clerkId);
        if (formData.webForm.orgFile) {
            apiFormData.append("document", formData.webForm.orgFile);
        }
        if (formData.webForm.websiteUrl) {
            apiFormData.append("url", formData.webForm.websiteUrl);
        }
        const newFormData = [...apiFormData.entries()];
        console.log("New Form Data", newFormData);
        // Log FormData for debugging
        try {
            react_toastify_1.toast.info("Uploading document...");
            const result = await axios_1.default.post('/api/webbot/upload', newFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Hello World");
            console.log("API Response:", result);
            react_toastify_1.toast.success("Document uploaded and processed successfully!");
            setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webForm: Object.assign(Object.assign({}, prevData.webForm), { embedUrl: result.data.embedUrl, s3Url: result.data.url || "" }) })));
            await onNext();
        }
        catch (error) {
            console.error("Upload error:", error);
            react_toastify_1.toast.error(`Upload failed: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Please try again"}`);
        }
        finally {
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
    return (<div className="bg-white space-y-6 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label_1.Label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            <lucide_react_1.Building className="inline-block mr-2 h-4 w-4"/>
            Business Name
          </label_1.Label>
          <input_1.Input id="businessName" type="text" value={formData.webForm.businessName} onChange={(e) => setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webForm: Object.assign(Object.assign({}, prevData.webForm), { businessName: e.target.value }) })))} placeholder="Enter your business name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-flame-500 focus:ring-flame-500 sm:text-sm" required/>
        </div>

        <div>
          <label_1.Label htmlFor="country" className="block text-sm font-medium text-gray-700">
            <lucide_react_1.Flag className="inline-block mr-2 h-4 w-4 mb-1"/>
            Country
          </label_1.Label>
          <select_1.Select value={formData.webForm.country} onValueChange={(value) => setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webForm: Object.assign(Object.assign({}, prevData.webForm), { country: value }) })))}>
            <select_1.SelectTrigger className="w-full">
              <select_1.SelectValue placeholder="Select your country"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {countries.map((country, index) => (<select_1.SelectItem key={index} value={country}>
                  {country}
                </select_1.SelectItem>))}
            </select_1.SelectContent>
          </select_1.Select>
        </div>

        <div>
          <label_1.Label htmlFor="botName" className="block text-sm font-medium text-gray-700">
            <lucide_react_1.Bot className="inline-block mr-2 h-4 w-4"/>
            Bot Name
          </label_1.Label>
          <input_1.Input id="botName" type="text" value={formData.webForm.botName} onChange={(e) => setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webForm: Object.assign(Object.assign({}, prevData.webForm), { botName: e.target.value }) })))} placeholder="Enter your bot name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-flame-500 focus:ring-flame-500 sm:text-sm" required/>
        </div>

        <div>
          <label_1.Label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
            <lucide_react_1.Globe className="inline-block mr-2 h-4 w-4"/>
            Website URL
          </label_1.Label>
          <input_1.Input id="websiteUrl" type="url" value={formData.webForm.websiteUrl} onChange={(e) => setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webForm: Object.assign(Object.assign({}, prevData.webForm), { websiteUrl: e.target.value }) })))} placeholder="https://example.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-flame-500 focus:ring-flame-500 sm:text-sm"/>
          <p className="mt-1 text-xs text-gray-500">
            Enter your website URL to extract business information
          </p>
        </div>

        <div>
          <label_1.Label htmlFor="orgFile" className="block text-sm font-medium text-gray-700">
            <lucide_react_1.Upload className="inline-block mr-2 h-4 w-4"/>
            Organization Info File
          </label_1.Label>
          <input_1.Input id="orgFile" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="mt-1 block w-full"/>
          <p className="mt-1 text-xs text-gray-500">
            Upload a PDF file containing your organization's detailed information
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button_1.Button type="button" onClick={handleUpload} disabled={isUploading} className="bg-[#EB6C33] hover:bg-[#D45A2A] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {isUploading ? (<>
              <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Uploading...
            </>) : (<>
              <lucide_react_1.Upload className="inline-block mr-2 h-4 w-4"/>
              Upload
            </>)}
        </button_1.Button>

        <button_1.Button type="submit" className="bg-[#EB6C33] hover:bg-[#D45A2A] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleSubmit} disabled={!formData.webForm.embeddedUrl}>
          Next
        </button_1.Button>
      </div>
    </div>);
};
exports.WebForm = WebForm;
