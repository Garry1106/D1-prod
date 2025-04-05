'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { X, Paperclip, Send, Home, MessageSquare, Headphones, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useWebFormContext } from '@/context/webbot/FormContext'; // Adjust the import path accordingly

interface WebAdditionalFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const WebAdditionalForm: React.FC<WebAdditionalFormProps> = ({ onNext, onPrevious }) => {
  const { formData, setFormData } = useWebFormContext(); // Access form data and setFormData from context

  const [logo, setLogo] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [quickButtons, setQuickButtons] = useState<string[]>([]);
  const [newQuickButton, setNewQuickButton] = useState<string>('');
  const [showInitialForm, setShowInitialForm] = useState(true);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [newFaq, setNewFaq] = useState<{ question: string; answer: string }>({ question: '', answer: '' });
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const colorPalettes = [
    { name: 'Orange', value: '#EB6C33' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Black', value: '#000' }
  ];

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setLogo(logoUrl);
      setFormData((prevData) => ({
        ...prevData,
        webAdditionalForm: {
          ...prevData.webAdditionalForm,
          logo: file,
        },
      }));
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setFormData((prevData) => ({
      ...prevData,
      webAdditionalForm: {
        ...prevData.webAdditionalForm,
        selectedColor: color,
      },
    }));
  };

  const handleAddQuickButton = () => {
    if (newQuickButton.trim()) {
      const updatedQuickButtons = [...quickButtons, newQuickButton.trim()];
      setQuickButtons(updatedQuickButtons);
      setNewQuickButton('');
      setFormData((prevData) => ({
        ...prevData,
        webAdditionalForm: {
          ...prevData.webAdditionalForm,
          quickButtons: updatedQuickButtons,
        },
      }));
    }
  };

  const handleRemoveQuickButton = (index: number) => {
    const updatedQuickButtons = quickButtons.filter((_, i) => i !== index);
    setQuickButtons(updatedQuickButtons);
    setFormData((prevData) => ({
      ...prevData,
      webAdditionalForm: {
        ...prevData.webAdditionalForm,
        quickButtons: updatedQuickButtons,
      },
    }));
  };

  const handleAddFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim() && faqs.length < 5) {
      const updatedFaqs = [...faqs, newFaq];
      setFaqs(updatedFaqs);
      setNewFaq({ question: '', answer: '' });
      setFormData((prevData) => ({
        ...prevData,
        webAdditionalForm: {
          ...prevData.webAdditionalForm,
          faqs: updatedFaqs,
        },
      }));
    }
  };

  const handleRemoveFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
    setFormData((prevData) => ({
      ...prevData,
      webAdditionalForm: {
        ...prevData.webAdditionalForm,
        faqs: updatedFaqs,
      },
    }));
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Customize Your Chatbot</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Upload Logo</Label>
                <Input id="logo" type="file" onChange={handleLogoChange} accept="image/*" />
              </div>

              <div className="space-y-2">
                <Label>Select Color Palette</Label>
                <div className="flex gap-2">
                  {colorPalettes.map((palette) => (
                    <Button
                      key={palette.value}
                      variant="outline"
                      style={{ backgroundColor: palette.value }}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === palette.value ? 'border-[#EB6C33]' : 'border-gray-200'
                      }`}
                      onClick={() => handleColorChange(palette.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Quick Buttons</Label>
                <div className="flex gap-2">
                  <Input
                    value={newQuickButton}
                    onChange={(e) => setNewQuickButton(e.target.value)}
                    placeholder="Enter quick button text"
                  />
                  <Button onClick={handleAddQuickButton} className='bg-[#EB6C33] hover:bg-[#f88753]'>Add</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add FAQs (Max 5)</Label>
                <div className="space-y-2">
                  <Input
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    placeholder="Enter question"
                  />
                  <Input
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    placeholder="Enter answer"
                  />
                  <Button onClick={handleAddFaq} disabled={faqs.length >= 5} className='bg-[#EB6C33] hover:bg-[#f88753]'>
                    Add FAQ
                  </Button>
                </div>
                {faqs.map((faq, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                    <div>
                      <div className="font-medium">{faq.question}</div>
                      <div className="text-sm text-gray-600">{faq.answer}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFaq(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section (Preview) */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Preview</h2>
            </CardHeader>
            <CardContent>
              <div className="rounded-3xl overflow-hidden max-w-sm mx-auto  shadow-md" style={{ backgroundColor: selectedColor }}>
                {/* Header */}
                <div className="p-6 text-white relative" style={{ backgroundColor: selectedColor }}>
                  <div className="absolute right-4 top-4">
                    <X className="cursor-pointer" size={24} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    {logo ? (
                      <img src={logo} alt="Logo" className="w-[20%] h-12" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300" />
                    )}
                  </div>
                  <div className="text-2xl font-semibold mb-2">
                    Good Evening! 👋
                  </div>
                  <div className="text-2xl font-semibold">
                    How can we help you today?
                  </div>
                </div>

                {/* Chat Content (Scrollable) */}
                <div className={`bg-gray-100 p-4 ${faqs.length > 0 ? 'h-[400px] overflow-y-auto' : ''}`}>
                  <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                    <span>Connected to server</span>
                  </div>

                  {showInitialForm && (
                    <div className="bg-gray-200 rounded-lg p-6 space-y-4">
                      <Input placeholder="Your name" className="w-full" />
                      <Input placeholder="Your email" className="w-full" />
                      <Button 
                        className="w-full text-white"
                        style={{ backgroundColor: selectedColor }}
                        onClick={() => setShowInitialForm(false)}
                      >
                        Start Chat
                      </Button>
                    </div>
                  )}

                  {/* Quick Buttons with Remove */}
                  {quickButtons.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {quickButtons.map((button, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            className="bg-white text-black hover:bg-gray-100"
                          >
                            {button}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuickButton(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FAQs: Only rendered if there is at least one FAQ */}
                  {faqs.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-lg font-semibold">FAQs</h3>
                      {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleFaq(index)}
                          >
                            <div className="font-medium">{faq.question}</div>
                            {expandedFaqIndex === index ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                          {expandedFaqIndex === index && (
                            <div className="text-sm text-gray-600 mt-2">{faq.answer}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4">
                  <div className="flex gap-2 items-center p-2 mt-4 border-b">
                    <Input 
                      placeholder="Type your message..." 
                      className="border-0 focus:ring-0 bg-transparent bg-white"
                    />
                    <div className="flex gap-2">
                      <Paperclip className="w-6 h-6 text-black cursor-pointer" />
                      <Send className="w-6 h-6 text-black cursor-pointer" />
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex justify-between items-center mt-4 px-4 py-2">
                    <div className="flex flex-col items-center">
                      <Home className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-center">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-center">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Footer Text */}
                  <div className="text-center text-xs text-gray-500 mt-4">
                    ©2025 Dunefox
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          style={{ backgroundColor: selectedColor }}
          className="hover:bg-opacity-90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WebAdditionalForm;