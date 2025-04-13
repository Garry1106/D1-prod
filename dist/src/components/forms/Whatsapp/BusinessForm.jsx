"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BusinessForm;
const react_1 = require("react"); // Import useState to manage button click state
const FormContext_1 = require("@/context/whatsapp/FormContext"); // Import the context hook
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const form_1 = require("@/components/forms/Whatsapp/ui/form");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const react_toastify_1 = require("react-toastify");
// Country data with phone codes
const countries = [
    { code: "US", name: "United States", phoneCode: "+1", currency: "USD" },
    { code: "IN", name: "India", phoneCode: "+91", currency: "INR" },
    { code: "GB", name: "United Kingdom", phoneCode: "+44", currency: "GBP" },
    { code: "CA", name: "Canada", phoneCode: "+1", currency: "CAD" },
    { code: "AU", name: "Australia", phoneCode: "+61", currency: "AUD" },
    // Add more countries as needed
];
// Language options
const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    // Add more languages as needed
];
// Gender options
const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];
function BusinessForm({ form }) {
    const { formData, setFormData } = (0, FormContext_1.useFormContext)(); // Get form data and setter from context
    const [isButtonClicked, setIsButtonClicked] = (0, react_1.useState)(false); // Track if the button was clicked
    const [phoneCode, setPhoneCode] = (0, react_1.useState)(""); // Track the selected country's phone code
    // Handle button click to enable inputs and make API call
    const handleCreateWebhook = async (e) => {
        e.preventDefault(); // Prevent page refresh
        setIsButtonClicked(true); // Enable the inputs when the button is clicked
        // Extract the required fields from formData
        const { phoneNumberId, appId, appSecret, accessToken } = formData.business;
        console.log(phoneNumberId);
        console.log(appId);
        console.log(appSecret);
        try {
            // Make the API call
            const response = await fetch("/api/Whatsapp/webhook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumberId,
                    appId,
                    appSecret,
                    accessToken,
                }),
            });
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to configure webhook");
            }
            const data = await response.json();
            console.log("Webhook Created:", data);
            react_toastify_1.toast.success("Webhook Created Successfully");
        }
        catch (error) {
            console.error("Error creating webhook:", error);
            react_toastify_1.toast.error("Failed to create webhook");
        }
    };
    // Handle country selection
    const handleCountryChange = (value) => {
        const selectedCountry = countries.find((country) => country.code === value);
        if (selectedCountry) {
            setPhoneCode(selectedCountry.phoneCode);
            form.setValue("displayPhoneNumber", selectedCountry.phoneCode); // Prefill phone number with country code
            form.setValue("currency", selectedCountry.currency); // Update the currency field in the form
            setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { country: selectedCountry.code, currency: selectedCountry.currency }) })));
        }
    };
    return (<form_1.Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Business Name Field */}
          <form_1.FormField control={form.control} name="businessName" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel className="flex items-center gap-2">
                  <lucide_react_1.Building2 className="h-4 w-4"/>
                  Business Name
                </form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder="Enter business name" {...field} onChange={(e) => {
                field.onChange(e);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { businessName: e.target.value }) })));
            }} className="px-3 py-2 border border-gray-300 rounded-md w-full"/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* Bot Name Field */}
          <form_1.FormField control={form.control} name="botName" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>Bot Name</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder="Enter bot name" {...field} onChange={(e) => {
                field.onChange(e);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { botName: e.target.value }) })));
            }} className="px-3 py-2 border border-gray-300 rounded-md w-full"/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* Country Select Field */}
          <form_1.FormField control={form.control} name="country" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>Country</form_1.FormLabel>
                <select_1.Select onValueChange={(value) => {
                field.onChange(value);
                handleCountryChange(value); // Call the updated handler
            }} defaultValue={field.value}>
                  <form_1.FormControl>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Select a country"/>
                    </select_1.SelectTrigger>
                  </form_1.FormControl>
                  <select_1.SelectContent>
                    {countries.map((country) => (<select_1.SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.phoneCode})
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* Phone Number Field */}
          <form_1.FormField control={form.control} name="displayPhoneNumber" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel className="flex items-center gap-2">
                  <lucide_react_1.Phone className="h-4 w-4"/>
                  Phone Number
                </form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder="eg: +919999999999" {...field} value={field.value || phoneCode} // Prefill with phone code
         onChange={(e) => {
                const value = e.target.value;
                // Ensure the phone number starts with the selected country code
                if (value.startsWith(phoneCode)) {
                    field.onChange(value);
                    setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { phoneNumber: value }) })));
                }
            }} className="px-3 py-2 border border-gray-300 rounded-md w-full"/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* Gender Select Field */}
          <form_1.FormField control={form.control} name="ttsGender" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>Bot's Gender</form_1.FormLabel>
                <select_1.Select onValueChange={(value) => {
                field.onChange(value);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { ttsGender: value }) })));
            }} defaultValue={field.value}>
                  <form_1.FormControl>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Select a gender"/>
                    </select_1.SelectTrigger>
                  </form_1.FormControl>
                  <select_1.SelectContent>
                    {genders.map((gender) => (<select_1.SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* Language Select Field */}
          <form_1.FormField control={form.control} name="language" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>Language</form_1.FormLabel>
                <select_1.Select onValueChange={(value) => {
                field.onChange(value);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { language: value }) })));
            }} defaultValue={field.value}>
                  <form_1.FormControl>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Select a language"/>
                    </select_1.SelectTrigger>
                  </form_1.FormControl>
                  <select_1.SelectContent>
                    {languages.map((language) => (<select_1.SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* Phone Number ID Field */}
          <form_1.FormField control={form.control} name="phoneNumberId" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>Phone Number ID</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder="Enter phone number ID" {...field} onChange={(e) => {
                field.onChange(e);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { phoneNumberId: e.target.value }) })));
            }} className="px-3 py-2 border border-gray-300 rounded-md w-full"/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* Access Token Field */}
          <form_1.FormField control={form.control} name="accessToken" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel className="flex items-center gap-2">
                  <lucide_react_1.Key className="h-4 w-4"/>
                  Access Token
                </form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder="Enter access token" type="password" {...field} onChange={(e) => {
                field.onChange(e);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { accessToken: e.target.value }) })));
            }} className="px-3 py-2 border border-gray-300 rounded-md w-full"/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* App Secret Field */}
          <form_1.FormField control={form.control} name="appSecret" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>App Secret</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder="Enter App secret" type="password" {...field} onChange={(e) => {
                field.onChange(e);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { appSecret: e.target.value }) })));
            }} className="px-3 py-2 border border-gray-300 rounded-md w-full"/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* App ID Field */}
          <form_1.FormField control={form.control} name="appId" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>App ID</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder="Enter app ID" {...field} onChange={(e) => {
                field.onChange(e);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { appId: e.target.value }) })));
            }} className="px-3 py-2 border border-gray-300 rounded-md w-full"/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* WABA ID Field */}
          <form_1.FormField control={form.control} name="waba_id" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>WaBa ID</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder="Enter WaBa ID" {...field} onChange={(e) => {
                field.onChange(e);
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { waba_id: e.target.value }) })));
            }} className="px-3 py-2 border border-gray-300 rounded-md w-full"/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          {/* Button to Create Webhook */}
          <button_1.Button type="button" onClick={handleCreateWebhook} // Handle button click
     className="bg-[#EB6C33] hover:bg-[#d55b2a] text-white rounded-md">
            Create Webhook
          </button_1.Button>

          {/* Select Option Field (Disabled until button is clicked) */}
          <form_1.FormField control={form.control} name="role" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>Role of Bot</form_1.FormLabel>
                <select_1.Select onValueChange={(value) => {
                field.onChange(value); // Update the form control
                setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, prev.business), { role: value }) })));
            }} defaultValue={field.value}>
                  <form_1.FormControl>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Select an option"/>
                    </select_1.SelectTrigger>
                  </form_1.FormControl>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Customer Support">Customer Support</select_1.SelectItem>
                    <select_1.SelectItem value="Assitant">Assitant</select_1.SelectItem>
                    <select_1.SelectItem value="Marketing">Marketing</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>
        </div>
      </form>
    </form_1.Form>);
}
