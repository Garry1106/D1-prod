// app/page.js
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useRouter } from 'next/navigation'

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    description: ''
  })

  const router = useRouter();
  
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = (e:any) => {
    e.preventDefault()
    // In a real application, you would handle the form submission here
    console.log('Form submitted:', formData)
    setSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        issueType: '',
        description: ''
      })
      setSubmitted(false)
    }, 3000)
  }
  
  const handleChange = (e:any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSelectChange = (value:any) => {
    setFormData(prev => ({
      ...prev,
      issueType: value
    }))
  }
  
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
      {/* Header */}
      <header className="py-6 px-4 md:px-8 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dunefox</h1>
          <Button className="bg-[#EB6C33] hover:bg-[#d86230] text-white" onClick={()=>router.push('/console')}>
            Console
          </Button>
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
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-[#EB6C33]/10 rounded-t-lg">
              <CardTitle className="text-2xl text-[#EB6C33]">Contact Support</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Type
                    </label>
                    <Select
                      value={formData.issueType}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="w-full rounded-md">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Problem</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="account">Account Management</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Describe your issue
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please provide as much detail as possible..."
                      className="w-full rounded-md min-h-32"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="submit"
                    className="w-full bg-[#EB6C33] hover:bg-[#d86230] text-white py-2 rounded-md transition-colors"
                  >
                    {submitted ? "Thank you! We'll be in touch soon." : "Submit Support Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  How do I reset my password?
                </AccordionTrigger>
                <AccordionContent>
                  You can reset your password by clicking on the "Forgot Password" link on the login page. 
                  You will receive an email with instructions to create a new password.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  How are subscriptions billed?
                </AccordionTrigger>
                <AccordionContent>
                  Subscriptions are billed on a monthly or annual basis, depending on the plan you choose. 
                  Annual plans include a 20% discount compared to monthly billing.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  Can I upgrade or downgrade my plan?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you can change your plan at any time. When upgrading, we'll prorate the remaining 
                  days in your current billing cycle. When downgrading, the new rate will apply at the 
                  start of your next billing cycle.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  How do I add team members to my account?
                </AccordionTrigger>
                <AccordionContent>
                  To add team members, go to the "Team Settings" section in your dashboard. From there, 
                  you can invite new members by entering their email addresses. Team members will receive 
                  an invitation email with instructions to create their account.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  What are your support hours?
                </AccordionTrigger>
                <AccordionContent>
                  Our support team is available Monday through Friday, 9:00 AM to 6:00 PM Eastern Time. 
                  Priority support is available for Enterprise customers 24/7.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Need more help?</h3>
              <p className="text-gray-600 mb-4">
                Check out our comprehensive documentation for tutorials, guides, and detailed information about our platform.
              </p>
              <Button className="bg-white text-[#EB6C33] hover:bg-gray-100 border border-[#EB6C33]">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}