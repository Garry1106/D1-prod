"use strict";
'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignForm = CampaignForm;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const date_fns_1 = require("date-fns");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const z = __importStar(require("zod"));
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
const calendar_1 = require("@/components/ui/calendar");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const popover_1 = require("@/components/ui/popover");
const select_1 = require("@/components/ui/select");
const react_toastify_1 = require("react-toastify");
const TenantConfigContext_1 = require("@/context/whatsapp/TenantConfigContext");
const formSchema = z.object({
    name: z.string().min(1, 'Campaign name is required'),
    templateId: z.string().min(1, 'Template is required'),
    groupId: z.string().min(1, 'Group is required'),
    scheduledFor: z.date().optional(),
});
function CampaignForm({ onSubmit }) {
    const [templates, setTemplates] = (0, react_1.useState)([]);
    const [groups, setGroups] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isFetching, setIsFetching] = (0, react_1.useState)(false);
    // Get tenant config from context
    const { tenantConfig } = (0, TenantConfigContext_1.useTenantConfig)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            name: '',
            templateId: '',
            groupId: '',
            scheduledFor: undefined,
        },
    });
    // Fetch templates and groups on component mount
    (0, react_1.useEffect)(() => {
        const fetchTemplatesAndGroups = async () => {
            setIsFetching(true);
            try {
                if (!tenantConfig || !tenantConfig.waba_id || !tenantConfig.accessToken) {
                    throw new Error("Tenant configuration is missing");
                }
                const headers = new Headers({
                    'x-waba-id': tenantConfig.waba_id,
                    'x-access-token': tenantConfig.accessToken,
                    'Content-Type': 'application/json'
                });
                const [templatesResponse, groupsResponse] = await Promise.all([
                    fetch('/api/Whatsapp/templates', {
                        cache: "no-store",
                        headers: headers,
                    }),
                    fetch('/api/Whatsapp/groups', {
                        cache: "no-store",
                        headers: headers,
                    }),
                ]);
                if (!templatesResponse.ok) {
                    throw new Error('Failed to fetch templates');
                }
                if (!groupsResponse.ok) {
                    throw new Error('Failed to fetch groups');
                }
                const templatesData = await templatesResponse.json();
                const groupsData = await groupsResponse.json();
                // Ensure templatesData is an array
                const templatesArray = Array.isArray(templatesData) ? templatesData : templatesData.data || [];
                setTemplates(templatesArray);
                // Ensure groupsData is an array
                if (!Array.isArray(groupsData)) {
                    throw new Error('Groups data is not an array');
                }
                setGroups(groupsData);
            }
            catch (error) {
                console.error('Error fetching data:', error);
                react_toastify_1.toast.error('Failed to fetch templates or groups');
            }
            finally {
                setIsFetching(false);
            }
        };
        fetchTemplatesAndGroups();
    }, []);
    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            if (!(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.accessToken) || !(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.phoneNumberId)) {
                react_toastify_1.toast.error('Missing WhatsApp configuration');
                return;
            }
            setIsLoading(true);
            // Pass accessToken and phoneNumberId from context
            await onSubmit(Object.assign(Object.assign({}, values), { accessToken: tenantConfig.accessToken, phoneNumberId: tenantConfig.phoneNumberId }));
            form.reset();
            react_toastify_1.toast.success('Campaign created successfully!');
        }
        catch (error) {
            react_toastify_1.toast.error('Failed to create campaign');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<form_1.Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Campaign Details Section */}
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-start">
                                <span className="pr-4 text-lg font-semibold bg-white text-black">Campaign Details</span>
                            </div>
                        </div>

                        {/* Campaign Name */}
                        <form_1.FormField control={form.control} name="name" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel className="text-black">Campaign Name</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <input_1.Input placeholder="Enter campaign name" {...field} className="bg-white border border-gray-300 text-black focus:border-[#41b658] focus:ring-[#41b658]/20"/>
                                    </form_1.FormControl>
                                    <form_1.FormMessage className="text-red-500"/>
                                </form_1.FormItem>)}/>

                        {/* Template Selection */}
                        <form_1.FormField control={form.control} name="templateId" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel className="text-black">Template</form_1.FormLabel>
                                    <select_1.Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFetching}>
                                        <form_1.FormControl>
                                            <select_1.SelectTrigger className="bg-white border border-gray-300 text-black">
                                                {isFetching ? (<div className="flex items-center gap-2">
                                                        <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/>
                                                        <span>Loading templates...</span>
                                                    </div>) : (<select_1.SelectValue placeholder="Select a template"/>)}
                                            </select_1.SelectTrigger>
                                        </form_1.FormControl>
                                        <select_1.SelectContent className="bg-white border border-gray-300">
                                            {templates.map((template) => (<select_1.SelectItem key={template.id} value={template.id} className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10">
                                                    {template.name}
                                                </select_1.SelectItem>))}
                                        </select_1.SelectContent>
                                    </select_1.Select>
                                    <form_1.FormMessage className="text-red-500"/>
                                </form_1.FormItem>)}/>
                    </div>

                    {/* Audience & Timing Section */}
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-start">
                                <span className="pr-4 text-lg font-semibold bg-white text-black">Audience & Timing</span>
                            </div>
                        </div>

                        {/* Group Selection */}
                        <form_1.FormField control={form.control} name="groupId" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel className="text-black">Group</form_1.FormLabel>
                                    <select_1.Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFetching}>
                                        <form_1.FormControl>
                                            <select_1.SelectTrigger className="bg-white border border-gray-300 text-black">
                                                {isFetching ? (<div className="flex items-center gap-2">
                                                        <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/>
                                                        <span>Loading groups...</span>
                                                    </div>) : (<select_1.SelectValue placeholder="Select a group"/>)}
                                            </select_1.SelectTrigger>
                                        </form_1.FormControl>
                                        <select_1.SelectContent className="bg-white border border-gray-300">
                                            {groups.map((group) => (<select_1.SelectItem key={group.id} value={group.id} className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10">
                                                    {group.name}
                                                </select_1.SelectItem>))}
                                        </select_1.SelectContent>
                                    </select_1.Select>
                                    <form_1.FormMessage className="text-red-500"/>
                                </form_1.FormItem>)}/>

                        {/* Schedule (Optional) */}
                        <form_1.FormField control={form.control} name="scheduledFor" render={({ field }) => (<form_1.FormItem className="flex flex-col">
                                    <form_1.FormLabel className="text-black">Schedule (Optional)</form_1.FormLabel>
                                    <popover_1.Popover>
                                        <popover_1.PopoverTrigger asChild>
                                            <form_1.FormControl>
                                                <button_1.Button variant="outline" className={(0, utils_1.cn)('w-full pl-3 text-left font-normal bg-white border border-gray-300 hover:bg-[#41b658]/10', !field.value && 'text-black/60')}>
                                                    {field.value ? ((0, date_fns_1.format)(field.value, 'PPP HH:mm')) : (<span>Pick a date and time</span>)}
                                                    <lucide_react_1.CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </button_1.Button>
                                            </form_1.FormControl>
                                        </popover_1.PopoverTrigger>
                                        <popover_1.PopoverContent className="bg-white border border-gray-300 p-0" align="start">
                                            <calendar_1.Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date('1900-01-01')} className="bg-white" classNames={{
                day_selected: "bg-[#41b658] text-white hover:bg-[#41b658]/90",
                day_today: "bg-[#41b658]/10 text-black",
            }} initialFocus/>
                                            <div className="p-3 border-t border-gray-200">
                                                <input_1.Input type="time" value={field.value ? (0, date_fns_1.format)(field.value, 'HH:mm') : ''} onChange={(e) => {
                const time = e.target.value;
                if (field.value) {
                    const [hours, minutes] = time.split(':');
                    const newDate = new Date(field.value);
                    newDate.setHours(parseInt(hours, 10));
                    newDate.setMinutes(parseInt(minutes, 10));
                    field.onChange(newDate);
                }
            }} className="bg-white border border-gray-300 text-black"/>
                                            </div>
                                        </popover_1.PopoverContent>
                                    </popover_1.Popover>
                                    <form_1.FormMessage className="text-red-500"/>
                                </form_1.FormItem>)}/>
                    </div>
                </div>

                {/* Show warning if tenant config is missing */}
                {(!(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.accessToken) || !(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.phoneNumberId)) && (<div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        WhatsApp configuration is missing. Please check your tenant settings.
                    </div>)}

                {/* Submit Button */}
                <div className="pt-4">
                    <button_1.Button type="submit" className="w-full bg-[#41b658] hover:bg-[#41b658]/90 text-white gap-2" disabled={isLoading || isFetching || !(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.accessToken) || !(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.phoneNumberId)}>
                        {isLoading ? (<lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/>) : form.watch('scheduledFor') ? (<lucide_react_1.Clock className="h-4 w-4"/>) : (<lucide_react_1.Send className="h-4 w-4"/>)}
                        {form.watch('scheduledFor') ? 'Schedule Campaign' : 'Send Now'}
                    </button_1.Button>
                </div>
            </form>
        </form_1.Form>);
}
