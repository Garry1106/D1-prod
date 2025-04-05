"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Monitor, Smartphone, Sparkles, Clock, Zap, MessageCircle, Phone, Settings, Star } from 'lucide-react';
import { Service, services } from '@/constants/services-page';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FLAME_COLOR = "#EB6C33";

const ServiceIcon: React.FC<{ serviceId: string; className?: string }> = ({ serviceId, className = '' }) => {
  const iconProps = {
    className: `${className} w-8 h-8`,
    strokeWidth: 1.5,
    color: FLAME_COLOR,
  };

  switch (serviceId) {
    case 'Whatsapp-bot':
      return <MessageCircle {...iconProps} />;
    case 'WebBot':
      return <Monitor {...iconProps} />;
    case 'call-bot':
      return <Phone {...iconProps} />;
    case 'custom-solution':
      return <Settings {...iconProps} />;
    default:
      return null;
  }
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] border border-gray-100">
        <CardHeader className="space-y-1 p-6">
          <div className="flex items-center justify-between mb-2">
            <ServiceIcon serviceId={service.id} />
            <Badge 
              variant="outline" 
              className="bg-orange-50 text-[#EB6C33] border-orange-200"
            >
              Professional
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {service.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {service.description}
          </CardDescription>
        </CardHeader>
        
        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={() => router.push(service.route)}
            className="w-full bg-[#EB6C33] hover:bg-[#ff8555] text-white font-medium"
          >
            Get Started
            <Zap className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const CallBotCard: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    viewport={{ once: true }}
  >
    <Card className="bg-white rounded-xl shadow-md border border-gray-100">
      <CardHeader className="space-y-1 p-6">
        <div className="flex items-center justify-between mb-2">
          <ServiceIcon serviceId="call-bot" />
          <Badge 
            variant="outline" 
            className="text-[#EB6C33] border-[#EB6C33]"
          >
            Coming Soon
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          AI Call Bot
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Intelligent voice-based customer service solution powered by advanced AI
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-3">
          {[
            { id: '1', text: 'Natural voice interactions' },
            { id: '2', text: 'Multi-language support' },
            { id: '3', text: 'Call analytics and insights' },
          ].map((feature) => (
            <div key={feature.id} className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-[#EB6C33]" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          disabled
          className="w-full bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
        >
          Coming Soon
          <Clock className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const CustomSolutionCard: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    viewport={{ once: true }}
  >
    <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] border border-gray-100">
      <CardHeader className="space-y-1 p-6">
        <div className="flex items-center justify-between mb-2">
          <ServiceIcon serviceId="custom-solution" />
          <Badge 
            variant="outline" 
            className="bg-orange-50 text-[#EB6C33] border-orange-200"
          >
            Enterprise
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          Custom Solutions
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Tailor-made AI solutions designed specifically for your business needs
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-3">
          {[
            { id: '1', text: 'Dedicated development team' },
            { id: '2', text: 'Custom integrations' },
            { id: '3', text: 'Specialized AI training' },
          ].map((feature) => (
            <div key={feature.id} className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-[#EB6C33]" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-[#EB6C33] hover:bg-[#ff8555] text-white font-medium"
        >
          Contact Sales
          <Zap className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const ServicesHeader: React.FC = () => (
  <div className="text-center mb-16">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Powerful Tools for Modern Business
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Experience enterprise-grade automation and AI solutions designed to scale with your business
      </p>
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="flex justify-center gap-8 mt-8"
    >
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#EB6C33]" />
        <span className="text-sm text-gray-600">24/7 Support</span>
      </div>
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#EB6C33]" />
        <span className="text-sm text-gray-600">99.9% Uptime</span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-[#EB6C33]" />
        <span className="text-sm text-gray-600">Enterprise Ready</span>
      </div>
    </motion.div>
  </div>
);

const ProductsPage: React.FC = () => (
  <div className="min-h-screen p-8 bg-gray-50">
    <main className="container mx-auto max-w-7xl">
      <ServicesHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
        <CallBotCard />
        <CustomSolutionCard />
      </div>
    </main>
  </div>
);

export default ProductsPage;