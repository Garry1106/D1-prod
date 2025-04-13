"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentForm;
const input_1 = require("@/components/ui/input");
const form_1 = require("@/components/forms/Whatsapp/ui/form");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const FormContext_1 = require("@/context/whatsapp/FormContext");
function PaymentForm({ form }) {
    const router = (0, navigation_1.useRouter)();
    const { formData } = (0, FormContext_1.useFormContext)(); // Access formData from context
    return (<form_1.Form {...form}>
      <form className="space-y-6">
        <form_1.FormField control={form.control} name="email" render={({ field }) => (<form_1.FormItem>
              <form_1.FormLabel className="flex items-center gap-2">
                <lucide_react_1.Mail className="h-4 w-4"/>
                Email Address
              </form_1.FormLabel>
              <form_1.FormControl>
                <input_1.Input placeholder="Enter email address" type="email" {...field}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>

        <form_1.FormField control={form.control} name="billingAddress" render={({ field }) => (<form_1.FormItem>
              <form_1.FormLabel className="flex items-center gap-2">
                <lucide_react_1.MapPin className="h-4 w-4"/>
                Billing Address
              </form_1.FormLabel>
              <form_1.FormControl>
                <input_1.Input placeholder="Enter billing address" {...field}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>

        <form_1.FormField control={form.control} name="paymentPhone" render={({ field }) => (<form_1.FormItem>
              <form_1.FormLabel className="flex items-center gap-2">
                <lucide_react_1.Phone className="h-4 w-4"/>
                Phone Number
              </form_1.FormLabel>
              <form_1.FormControl>
                <input_1.Input placeholder="Enter phone number" {...field}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>

      </form>
    </form_1.Form>);
}
