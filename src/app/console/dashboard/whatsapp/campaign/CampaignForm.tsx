'use client';

import { useState, useEffect, useContext } from 'react';
import { CalendarIcon, Loader2, Send, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Template, Group } from './types';
import { toast } from 'react-toastify';
import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';


const formSchema = z.object({
    name: z.string().min(1, 'Campaign name is required'),
    templateId: z.string().min(1, 'Template is required'),
    groupId: z.string().min(1, 'Group is required'),
    scheduledFor: z.date().optional(),
});

interface CampaignFormProps {
    onSubmit: (values: z.infer<typeof formSchema> & { accessToken: string, phoneNumberId: string }) => Promise<void>;
}

export function CampaignForm({ onSubmit }: CampaignFormProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // Get tenant config from context
    const { tenantConfig } = useTenantConfig();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            templateId: '',
            groupId: '',
            scheduledFor: undefined,
        },
    });

    // Fetch templates and groups on component mount
    useEffect(() => {
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
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch templates or groups')
            } finally {
                setIsFetching(false);
            }
        };

        fetchTemplatesAndGroups();
    }, []);

    // Handle form submission
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (!tenantConfig?.accessToken || !tenantConfig?.phoneNumberId) {
                toast.error('Missing WhatsApp configuration');
                return;
            }

            setIsLoading(true);
            // Pass accessToken and phoneNumberId from context
            await onSubmit({
                ...values,
                accessToken: tenantConfig.accessToken,
                phoneNumberId: tenantConfig.phoneNumberId
            });
            form.reset();
            toast.success('Campaign created successfully!')
        } catch (error) {
            toast.error('Failed to create campaign')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
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
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Campaign Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter campaign name"
                                            {...field}
                                            className="bg-white border border-gray-300 text-black focus:border-[#41b658] focus:ring-[#41b658]/20"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        {/* Template Selection */}
                        <FormField
                            control={form.control}
                            name="templateId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Template</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFetching}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border border-gray-300 text-black">
                                                {isFetching ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span>Loading templates...</span>
                                                    </div>
                                                ) : (
                                                    <SelectValue placeholder="Select a template" />
                                                )}
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white border border-gray-300">
                                            {templates.map((template) => (
                                                <SelectItem
                                                    key={template.id}
                                                    value={template.id}
                                                    className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10"
                                                >
                                                    {template.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
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
                        <FormField
                            control={form.control}
                            name="groupId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Group</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFetching}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border border-gray-300 text-black">
                                                {isFetching ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span>Loading groups...</span>
                                                    </div>
                                                ) : (
                                                    <SelectValue placeholder="Select a group" />
                                                )}
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white border border-gray-300">
                                            {groups.map((group) => (
                                                <SelectItem
                                                    key={group.id}
                                                    value={group.id}
                                                    className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10"
                                                >
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        {/* Schedule (Optional) */}
                        <FormField
                            control={form.control}
                            name="scheduledFor"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-black">Schedule (Optional)</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal bg-white border border-gray-300 hover:bg-[#41b658]/10',
                                                        !field.value && 'text-black/60'
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP HH:mm')
                                                    ) : (
                                                        <span>Pick a date and time</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="bg-white border border-gray-300 p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date() || date < new Date('1900-01-01')
                                                }
                                                className="bg-white"
                                                classNames={{
                                                    day_selected: "bg-[#41b658] text-white hover:bg-[#41b658]/90",
                                                    day_today: "bg-[#41b658]/10 text-black",
                                                }}
                                                initialFocus
                                            />
                                            <div className="p-3 border-t border-gray-200">
                                                <Input
                                                    type="time"
                                                    value={field.value ? format(field.value, 'HH:mm') : ''}
                                                    onChange={(e) => {
                                                        const time = e.target.value;
                                                        if (field.value) {
                                                            const [hours, minutes] = time.split(':');
                                                            const newDate = new Date(field.value);
                                                            newDate.setHours(parseInt(hours, 10));
                                                            newDate.setMinutes(parseInt(minutes, 10));
                                                            field.onChange(newDate);
                                                        }
                                                    }}
                                                    className="bg-white border border-gray-300 text-black"
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Show warning if tenant config is missing */}
                {(!tenantConfig?.accessToken || !tenantConfig?.phoneNumberId) && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        WhatsApp configuration is missing. Please check your tenant settings.
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full bg-[#41b658] hover:bg-[#41b658]/90 text-white gap-2"
                        disabled={isLoading || isFetching || !tenantConfig?.accessToken || !tenantConfig?.phoneNumberId}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : form.watch('scheduledFor') ? (
                            <Clock className="h-4 w-4" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        {form.watch('scheduledFor') ? 'Schedule Campaign' : 'Send Now'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}