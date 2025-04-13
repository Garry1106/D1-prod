"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fi_1 = require("react-icons/fi");
const DocumentationPage = () => {
    return (<div className="min-h-screen  flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full max-w-5xl px-4 py-6">
        <h1 className="text-4xl font-bold text-center">Meet SquareDocs</h1>
        <p className="mt-4 text-center text-lg text-gray-300">
          Premium, editable template for Framer. Craft your documentation effortlessly.
        </p>
      </header>

      {/* Main Navigation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl px-4 mt-10">
        {[
            { name: 'Getting Started', icon: <fi_1.FiHome />, href: '#' },
            { name: 'Installation', icon: <fi_1.FiCode />, href: '#' },
            { name: 'API Reference', icon: <fi_1.FiCode />, href: '#' },
            { name: 'Help', icon: <fi_1.FiHelpCircle />, href: '#' },
        ].map((item, idx) => (<a key={idx} href={item.href} className="flex items-center bg-[#EB6C33] text-white p-4 rounded-lg shadow-md transition hover:shadow-xl">
            <div className="p-3 bg-white rounded-full text-[#EB6C33] mr-4">{item.icon}</div>
            <span className="font-medium text-lg">{item.name}</span>
          </a>))}
      </div>

      {/* Why SquareDocs Section */}
      <section className="w-full max-w-5xl px-4 mt-16">
        <h2 className="text-2xl font-bold">Why SquareDocs?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[
            {
                title: 'Easily Editable',
                description: 'Thanks to premade assets, you can modify all colors and text, such as the Action Color.',
            },
            {
                title: 'Components',
                description: 'Finely crafted components with multiple states and variables.',
            },
            {
                title: 'CMS',
                description: 'Edit and manage all pages exclusively within the CMS mode.',
            },
            {
                title: 'Automatically Generated',
                description: 'All pages and navigation will be generated automatically from the CMS.',
            },
        ].map((feature, idx) => (<div key={idx} className="border border-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#EB6C33]">{feature.title}</h3>
              <p className="mt-2 text-gray-300">{feature.description}</p>
            </div>))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-16 w-full max-w-5xl px-4 py-6 border-t border-gray-700">
        <p className="text-center text-sm text-gray-500">
          Built with ❤️ using Next.js, TypeScript, TailwindCSS, and ShadCN.
        </p>
      </footer>
    </div>);
};
exports.default = DocumentationPage;
