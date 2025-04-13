"use strict";
// app/page.js
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SupportPage;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const textarea_1 = require("@/components/ui/textarea");
const button_1 = require("@/components/ui/button");
const select_1 = require("@/components/ui/select");
const accordion_1 = require("@/components/ui/accordion");
const navigation_1 = require("next/navigation");
function SupportPage() {
    const [formData, setFormData] = (0, react_1.useState)({
        name: '',
        email: '',
        issueType: '',
        description: ''
    });
    const router = (0, navigation_1.useRouter)();
    const [submitted, setSubmitted] = (0, react_1.useState)(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would handle the form submission here
        console.log('Form submitted:', formData);
        setSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                issueType: '',
                description: ''
            });
            setSubmitted(false);
        }, 3000);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSelectChange = (value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { issueType: value })));
    };
    return (<div className="min-h-screen bg-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
      {/* Header */}
      <header className="py-6 px-4 md:px-8 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dunefox</h1>
          <button_1.Button className="bg-[#EB6C33] hover:bg-[#d86230] text-white" onClick={() => router.push('/console')}>
            Console
          </button_1.Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 md:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions or issues you may encounter.
          </p>
        </div>
        
        {/* Two Column Layout for larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Support Form */}
          <card_1.Card className="shadow-lg border-0">
            <card_1.CardHeader className="bg-[#EB6C33]/10 rounded-t-lg">
              <card_1.CardTitle className="text-2xl text-[#EB6C33]">Contact Support</card_1.CardTitle>
              <card_1.CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input_1.Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full rounded-md" required/>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input_1.Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" className="w-full rounded-md" required/>
                  </div>
                  
                  <div>
                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Type
                    </label>
                    <select_1.Select value={formData.issueType} onValueChange={handleSelectChange}>
                      <select_1.SelectTrigger className="w-full rounded-md">
                        <select_1.SelectValue placeholder="Select issue type"/>
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        <select_1.SelectItem value="technical">Technical Problem</select_1.SelectItem>
                        <select_1.SelectItem value="billing">Billing Question</select_1.SelectItem>
                        <select_1.SelectItem value="account">Account Management</select_1.SelectItem>
                        <select_1.SelectItem value="feature">Feature Request</select_1.SelectItem>
                        <select_1.SelectItem value="other">Other</select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Describe your issue
                    </label>
                    <textarea_1.Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Please provide as much detail as possible..." className="w-full rounded-md min-h-32" required/>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button_1.Button type="submit" className="w-full bg-[#EB6C33] hover:bg-[#d86230] text-white py-2 rounded-md transition-colors">
                    {submitted ? "Thank you! We'll be in touch soon." : "Submit Support Request"}
                  </button_1.Button>
                </div>
              </form>
            </card_1.CardContent>
          </card_1.Card>
          
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <accordion_1.Accordion type="single" collapsible className="w-full">
              <accordion_1.AccordionItem value="item-1">
                <accordion_1.AccordionTrigger className="text-left font-medium">
                  How do I reset my password?
                </accordion_1.AccordionTrigger>
                <accordion_1.AccordionContent>
                  You can reset your password by clicking on the "Forgot Password" link on the login page. 
                  You will receive an email with instructions to create a new password.
                </accordion_1.AccordionContent>
              </accordion_1.AccordionItem>
              
              <accordion_1.AccordionItem value="item-2">
                <accordion_1.AccordionTrigger className="text-left font-medium">
                  How are subscriptions billed?
                </accordion_1.AccordionTrigger>
                <accordion_1.AccordionContent>
                  Subscriptions are billed on a monthly or annual basis, depending on the plan you choose. 
                  Annual plans include a 20% discount compared to monthly billing.
                </accordion_1.AccordionContent>
              </accordion_1.AccordionItem>
              
              <accordion_1.AccordionItem value="item-3">
                <accordion_1.AccordionTrigger className="text-left font-medium">
                  Can I upgrade or downgrade my plan?
                </accordion_1.AccordionTrigger>
                <accordion_1.AccordionContent>
                  Yes, you can change your plan at any time. When upgrading, we'll prorate the remaining 
                  days in your current billing cycle. When downgrading, the new rate will apply at the 
                  start of your next billing cycle.
                </accordion_1.AccordionContent>
              </accordion_1.AccordionItem>
              
              <accordion_1.AccordionItem value="item-4">
                <accordion_1.AccordionTrigger className="text-left font-medium">
                  How do I add team members to my account?
                </accordion_1.AccordionTrigger>
                <accordion_1.AccordionContent>
                  To add team members, go to the "Team Settings" section in your dashboard. From there, 
                  you can invite new members by entering their email addresses. Team members will receive 
                  an invitation email with instructions to create their account.
                </accordion_1.AccordionContent>
              </accordion_1.AccordionItem>
              
              <accordion_1.AccordionItem value="item-5">
                <accordion_1.AccordionTrigger className="text-left font-medium">
                  What are your support hours?
                </accordion_1.AccordionTrigger>
                <accordion_1.AccordionContent>
                  Our support team is available Monday through Friday, 9:00 AM to 6:00 PM Eastern Time. 
                  Priority support is available for Enterprise customers 24/7.
                </accordion_1.AccordionContent>
              </accordion_1.AccordionItem>
            </accordion_1.Accordion>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Need more help?</h3>
              <p className="text-gray-600 mb-4">
                Check out our comprehensive documentation for tutorials, guides, and detailed information about our platform.
              </p>
              <button_1.Button className="bg-white text-[#EB6C33] hover:bg-gray-100 border border-[#EB6C33]">
                View Documentation
              </button_1.Button>
            </div>
          </div>
        </div>
      </main>
    </div>);
}
