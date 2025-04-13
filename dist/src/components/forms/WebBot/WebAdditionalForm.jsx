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
exports.WebAdditionalForm = void 0;
const react_1 = __importStar(require("react"));
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const FormContext_1 = require("@/context/webbot/FormContext"); // Adjust the import path accordingly
const WebAdditionalForm = ({ onNext, onPrevious }) => {
    const { formData, setFormData } = (0, FormContext_1.useWebFormContext)(); // Access form data and setFormData from context
    const [logo, setLogo] = (0, react_1.useState)(null);
    const [selectedColor, setSelectedColor] = (0, react_1.useState)('#000000');
    const [quickButtons, setQuickButtons] = (0, react_1.useState)([]);
    const [newQuickButton, setNewQuickButton] = (0, react_1.useState)('');
    const [showInitialForm, setShowInitialForm] = (0, react_1.useState)(true);
    const [faqs, setFaqs] = (0, react_1.useState)([]);
    const [newFaq, setNewFaq] = (0, react_1.useState)({ question: '', answer: '' });
    const [expandedFaqIndex, setExpandedFaqIndex] = (0, react_1.useState)(null);
    const colorPalettes = [
        { name: 'Orange', value: '#EB6C33' },
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Green', value: '#10B981' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Black', value: '#000' }
    ];
    const handleLogoChange = (event) => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            const logoUrl = URL.createObjectURL(file);
            setLogo(logoUrl);
            setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webAdditionalForm: Object.assign(Object.assign({}, prevData.webAdditionalForm), { logo: file }) })));
        }
    };
    const handleColorChange = (color) => {
        setSelectedColor(color);
        setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webAdditionalForm: Object.assign(Object.assign({}, prevData.webAdditionalForm), { selectedColor: color }) })));
    };
    const handleAddQuickButton = () => {
        if (newQuickButton.trim()) {
            const updatedQuickButtons = [...quickButtons, newQuickButton.trim()];
            setQuickButtons(updatedQuickButtons);
            setNewQuickButton('');
            setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webAdditionalForm: Object.assign(Object.assign({}, prevData.webAdditionalForm), { quickButtons: updatedQuickButtons }) })));
        }
    };
    const handleRemoveQuickButton = (index) => {
        const updatedQuickButtons = quickButtons.filter((_, i) => i !== index);
        setQuickButtons(updatedQuickButtons);
        setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webAdditionalForm: Object.assign(Object.assign({}, prevData.webAdditionalForm), { quickButtons: updatedQuickButtons }) })));
    };
    const handleAddFaq = () => {
        if (newFaq.question.trim() && newFaq.answer.trim() && faqs.length < 5) {
            const updatedFaqs = [...faqs, newFaq];
            setFaqs(updatedFaqs);
            setNewFaq({ question: '', answer: '' });
            setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webAdditionalForm: Object.assign(Object.assign({}, prevData.webAdditionalForm), { faqs: updatedFaqs }) })));
        }
    };
    const handleRemoveFaq = (index) => {
        const updatedFaqs = faqs.filter((_, i) => i !== index);
        setFaqs(updatedFaqs);
        setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webAdditionalForm: Object.assign(Object.assign({}, prevData.webAdditionalForm), { faqs: updatedFaqs }) })));
    };
    const toggleFaq = (index) => {
        setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
    };
    return (<div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section */}
        <div>
          <card_1.Card>
            <card_1.CardHeader>
              <h2 className="text-xl font-bold">Customize Your Chatbot</h2>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="space-y-2">
                <label_1.Label htmlFor="logo">Upload Logo</label_1.Label>
                <input_1.Input id="logo" type="file" onChange={handleLogoChange} accept="image/*"/>
              </div>

              <div className="space-y-2">
                <label_1.Label>Select Color Palette</label_1.Label>
                <div className="flex gap-2">
                  {colorPalettes.map((palette) => (<button_1.Button key={palette.value} variant="outline" style={{ backgroundColor: palette.value }} className={`w-10 h-10 rounded-full border-2 ${selectedColor === palette.value ? 'border-[#EB6C33]' : 'border-gray-200'}`} onClick={() => handleColorChange(palette.value)}/>))}
                </div>
              </div>

              <div className="space-y-2">
                <label_1.Label>Add Quick Buttons</label_1.Label>
                <div className="flex gap-2">
                  <input_1.Input value={newQuickButton} onChange={(e) => setNewQuickButton(e.target.value)} placeholder="Enter quick button text"/>
                  <button_1.Button onClick={handleAddQuickButton} className='bg-[#EB6C33] hover:bg-[#f88753]'>Add</button_1.Button>
                </div>
              </div>

              <div className="space-y-2">
                <label_1.Label>Add FAQs (Max 5)</label_1.Label>
                <div className="space-y-2">
                  <input_1.Input value={newFaq.question} onChange={(e) => setNewFaq(Object.assign(Object.assign({}, newFaq), { question: e.target.value }))} placeholder="Enter question"/>
                  <input_1.Input value={newFaq.answer} onChange={(e) => setNewFaq(Object.assign(Object.assign({}, newFaq), { answer: e.target.value }))} placeholder="Enter answer"/>
                  <button_1.Button onClick={handleAddFaq} disabled={faqs.length >= 5} className='bg-[#EB6C33] hover:bg-[#f88753]'>
                    Add FAQ
                  </button_1.Button>
                </div>
                {faqs.map((faq, index) => (<div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                    <div>
                      <div className="font-medium">{faq.question}</div>
                      <div className="text-sm text-gray-600">{faq.answer}</div>
                    </div>
                    <button_1.Button variant="ghost" size="sm" onClick={() => handleRemoveFaq(index)}>
                      <lucide_react_1.X className="w-4 h-4"/>
                    </button_1.Button>
                  </div>))}
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        {/* Right Section (Preview) */}
        <div>
          <card_1.Card>
            <card_1.CardHeader>
              <h2 className="text-xl font-bold">Preview</h2>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="rounded-3xl overflow-hidden max-w-sm mx-auto  shadow-md" style={{ backgroundColor: selectedColor }}>
                {/* Header */}
                <div className="p-6 text-white relative" style={{ backgroundColor: selectedColor }}>
                  <div className="absolute right-4 top-4">
                    <lucide_react_1.X className="cursor-pointer" size={24}/>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    {logo ? (<img src={logo} alt="Logo" className="w-[20%] h-12"/>) : (<div className="w-12 h-12 bg-gray-300"/>)}
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

                  {showInitialForm && (<div className="bg-gray-200 rounded-lg p-6 space-y-4">
                      <input_1.Input placeholder="Your name" className="w-full"/>
                      <input_1.Input placeholder="Your email" className="w-full"/>
                      <button_1.Button className="w-full text-white" style={{ backgroundColor: selectedColor }} onClick={() => setShowInitialForm(false)}>
                        Start Chat
                      </button_1.Button>
                    </div>)}

                  {/* Quick Buttons with Remove */}
                  {quickButtons.length > 0 && (<div className="flex flex-wrap gap-2 mt-4">
                      {quickButtons.map((button, index) => (<div key={index} className="flex items-center space-x-1">
                          <button_1.Button variant="outline" className="bg-white text-black hover:bg-gray-100">
                            {button}
                          </button_1.Button>
                          <button_1.Button variant="ghost" size="sm" onClick={() => handleRemoveQuickButton(index)}>
                            <lucide_react_1.X className="w-4 h-4"/>
                          </button_1.Button>
                        </div>))}
                    </div>)}

                  {/* FAQs: Only rendered if there is at least one FAQ */}
                  {faqs.length > 0 && (<div className="mt-4 space-y-2">
                      <h3 className="text-lg font-semibold">FAQs</h3>
                      {faqs.map((faq, index) => (<div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFaq(index)}>
                            <div className="font-medium">{faq.question}</div>
                            {expandedFaqIndex === index ? (<lucide_react_1.ChevronUp className="w-4 h-4"/>) : (<lucide_react_1.ChevronDown className="w-4 h-4"/>)}
                          </div>
                          {expandedFaqIndex === index && (<div className="text-sm text-gray-600 mt-2">{faq.answer}</div>)}
                        </div>))}
                    </div>)}
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4">
                  <div className="flex gap-2 items-center p-2 mt-4 border-b">
                    <input_1.Input placeholder="Type your message..." className="border-0 focus:ring-0 bg-transparent bg-white"/>
                    <div className="flex gap-2">
                      <lucide_react_1.Paperclip className="w-6 h-6 text-black cursor-pointer"/>
                      <lucide_react_1.Send className="w-6 h-6 text-black cursor-pointer"/>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex justify-between items-center mt-4 px-4 py-2">
                    <div className="flex flex-col items-center">
                      <lucide_react_1.Home className="w-6 h-6"/>
                    </div>
                    <div className="flex flex-col items-center">
                      <lucide_react_1.MessageSquare className="w-6 h-6"/>
                    </div>
                    <div className="flex flex-col items-center">
                      <lucide_react_1.Headphones className="w-6 h-6"/>
                    </div>
                    <div className="flex flex-col items-center">
                      <lucide_react_1.HelpCircle className="w-6 h-6"/>
                    </div>
                  </div>

                  {/* Footer Text */}
                  <div className="text-center text-xs text-gray-500 mt-4">
                    ©2025 Dunefox
                  </div>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button_1.Button variant="outline" onClick={onPrevious}>
          Previous
        </button_1.Button>
        <button_1.Button onClick={onNext} style={{ backgroundColor: selectedColor }} className="hover:bg-opacity-90">
          Next
        </button_1.Button>
      </div>
    </div>);
};
exports.WebAdditionalForm = WebAdditionalForm;
exports.default = exports.WebAdditionalForm;
