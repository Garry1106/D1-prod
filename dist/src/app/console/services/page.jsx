"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const services_page_1 = require("@/constants/services-page");
const framer_motion_1 = require("framer-motion");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const FLAME_COLOR = "#EB6C33";
const ServiceIcon = ({ serviceId, className = '' }) => {
    const iconProps = {
        className: `${className} w-8 h-8`,
        strokeWidth: 1.5,
        color: FLAME_COLOR,
    };
    switch (serviceId) {
        case 'Whatsapp-bot':
            return <lucide_react_1.MessageCircle {...iconProps}/>;
        case 'WebBot':
            return <lucide_react_1.Monitor {...iconProps}/>;
        case 'call-bot':
            return <lucide_react_1.Phone {...iconProps}/>;
        case 'custom-solution':
            return <lucide_react_1.Settings {...iconProps}/>;
        default:
            return null;
    }
};
const ServiceCard = ({ service }) => {
    const router = (0, navigation_1.useRouter)();
    return (<framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} viewport={{ once: true }}>
      <card_1.Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] border border-gray-100">
        <card_1.CardHeader className="space-y-1 p-6">
          <div className="flex items-center justify-between mb-2">
            <ServiceIcon serviceId={service.id}/>
            <badge_1.Badge variant="outline" className="bg-orange-50 text-[#EB6C33] border-orange-200">
              Professional
            </badge_1.Badge>
          </div>
          <card_1.CardTitle className="text-xl font-bold text-gray-900">
            {service.title}
          </card_1.CardTitle>
          <card_1.CardDescription className="text-sm text-gray-600">
            {service.description}
          </card_1.CardDescription>
        </card_1.CardHeader>
        
        <card_1.CardFooter className="p-6 pt-0">
          <button_1.Button onClick={() => router.push(service.route)} className="w-full bg-[#EB6C33] hover:bg-[#ff8555] text-white font-medium">
            Get Started
            <lucide_react_1.Zap className="w-4 h-4 ml-2"/>
          </button_1.Button>
        </card_1.CardFooter>
      </card_1.Card>
    </framer_motion_1.motion.div>);
};
const CallBotCard = () => (<framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} viewport={{ once: true }}>
    <card_1.Card className="bg-white rounded-xl shadow-md border border-gray-100">
      <card_1.CardHeader className="space-y-1 p-6">
        <div className="flex items-center justify-between mb-2">
          <ServiceIcon serviceId="call-bot"/>
          <badge_1.Badge variant="outline" className="text-[#EB6C33] border-[#EB6C33]">
            Coming Soon
          </badge_1.Badge>
        </div>
        <card_1.CardTitle className="text-xl font-bold text-gray-900">
          AI Call Bot
        </card_1.CardTitle>
        <card_1.CardDescription className="text-sm text-gray-600">
          Intelligent voice-based customer service solution powered by advanced AI
        </card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent className="p-6 pt-0">
        <div className="space-y-3">
          {[
        { id: '1', text: 'Natural voice interactions' },
        { id: '2', text: 'Multi-language support' },
        { id: '3', text: 'Call analytics and insights' },
    ].map((feature) => (<div key={feature.id} className="flex items-center gap-2 text-sm text-gray-600">
              <lucide_react_1.Star className="w-4 h-4 text-[#EB6C33]"/>
              <span>{feature.text}</span>
            </div>))}
        </div>
      </card_1.CardContent>
      <card_1.CardFooter className="p-6 pt-0">
        <button_1.Button disabled className="w-full bg-gray-100 text-gray-500 font-medium cursor-not-allowed">
          Coming Soon
          <lucide_react_1.Clock className="w-4 h-4 ml-2"/>
        </button_1.Button>
      </card_1.CardFooter>
    </card_1.Card>
  </framer_motion_1.motion.div>);
const CustomSolutionCard = () => (<framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} viewport={{ once: true }}>
    <card_1.Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] border border-gray-100">
      <card_1.CardHeader className="space-y-1 p-6">
        <div className="flex items-center justify-between mb-2">
          <ServiceIcon serviceId="custom-solution"/>
          <badge_1.Badge variant="outline" className="bg-orange-50 text-[#EB6C33] border-orange-200">
            Enterprise
          </badge_1.Badge>
        </div>
        <card_1.CardTitle className="text-xl font-bold text-gray-900">
          Custom Solutions
        </card_1.CardTitle>
        <card_1.CardDescription className="text-sm text-gray-600">
          Tailor-made AI solutions designed specifically for your business needs
        </card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent className="p-6 pt-0">
        <div className="space-y-3">
          {[
        { id: '1', text: 'Dedicated development team' },
        { id: '2', text: 'Custom integrations' },
        { id: '3', text: 'Specialized AI training' },
    ].map((feature) => (<div key={feature.id} className="flex items-center gap-2 text-sm text-gray-600">
              <lucide_react_1.Sparkles className="w-4 h-4 text-[#EB6C33]"/>
              <span>{feature.text}</span>
            </div>))}
        </div>
      </card_1.CardContent>
      <card_1.CardFooter className="p-6 pt-0">
        <button_1.Button className="w-full bg-[#EB6C33] hover:bg-[#ff8555] text-white font-medium">
          Contact Sales
          <lucide_react_1.Zap className="w-4 h-4 ml-2"/>
        </button_1.Button>
      </card_1.CardFooter>
    </card_1.Card>
  </framer_motion_1.motion.div>);
const ServicesHeader = () => (<div className="text-center mb-16">
    <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Powerful Tools for Modern Business
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Experience enterprise-grade automation and AI solutions designed to scale with your business
      </p>
    </framer_motion_1.motion.div>
    <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="flex justify-center gap-8 mt-8">
      <div className="flex items-center gap-2">
        <lucide_react_1.Clock className="w-5 h-5 text-[#EB6C33]"/>
        <span className="text-sm text-gray-600">24/7 Support</span>
      </div>
      <div className="flex items-center gap-2">
        <lucide_react_1.Sparkles className="w-5 h-5 text-[#EB6C33]"/>
        <span className="text-sm text-gray-600">99.9% Uptime</span>
      </div>
      <div className="flex items-center gap-2">
        <lucide_react_1.Zap className="w-5 h-5 text-[#EB6C33]"/>
        <span className="text-sm text-gray-600">Enterprise Ready</span>
      </div>
    </framer_motion_1.motion.div>
  </div>);
const ProductsPage = () => (<div className="min-h-screen p-8 bg-gray-50">
    <main className="container mx-auto max-w-7xl">
      <ServicesHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services_page_1.services.map((service) => (<ServiceCard key={service.id} service={service}/>))}
        <CallBotCard />
        <CustomSolutionCard />
      </div>
    </main>
  </div>);
exports.default = ProductsPage;
