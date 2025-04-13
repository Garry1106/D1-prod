"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Monitor, Smartphone, Sparkles, Clock, Zap, MessageCircle, Phone, Settings, Star, ChevronRight } from 'lucide-react';
import { Service, services } from '@/constants/services-page';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserProducts } from '@/actions/user/index'; // Import the server function
import { useUser } from '@clerk/nextjs'; // Assuming Clerk is used for auth

const ServiceIcon: React.FC<{ serviceId: string; className?: string }> = ({ serviceId, className = '' }) => {
  const iconProps = {
    className: `${className} w-10 h-10`,
    strokeWidth: 1.5,
    color: '#EB6C33',
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
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-6px] border border-gray-100 h-full flex flex-col overflow-hidden group">
        <CardHeader className="space-y-2 p-6 pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="bg-orange-50 p-3 rounded-lg">
              <ServiceIcon serviceId={service.id} />
            </div>
            <Badge 
              variant="outline" 
              className="bg-orange-50 text-[#EB6C33] border-orange-200 font-medium"
            >
              Professional
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mt-4">
            {service.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 line-clamp-3">
            {service.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 pt-2 flex-grow">
          <div className="space-y-3 mt-2">
            {[
              { id: '1', text: 'Easy integration with existing systems' },
              { id: '2', text: 'Scalable solution for growing businesses' },
              { id: '3', text: '24/7 automated customer interactions' },
            ].map((feature) => (
              <div key={feature.id} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="min-w-4 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#EB6C33]" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0 mt-auto">
          <Button 
            onClick={() => router.push(service.route)}
            className="w-full bg-[#EB6C33] hover:bg-[#ff8555] text-white font-medium h-12 group-hover:shadow-md transition-all duration-300"
          >
            Get Started
            <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
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
    transition={{ duration: 0.4, delay: 0.1 }}
    viewport={{ once: true }}
    className="h-full"
  >
    <Card className="bg-white rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
      <CardHeader className="space-y-2 p-6 pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="bg-orange-50 p-3 rounded-lg">
            <ServiceIcon serviceId="call-bot" />
          </div>
          <Badge 
            variant="outline" 
            className="bg-gray-100 text-gray-600 border-gray-200 font-medium"
          >
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 mt-4">
          AI Call Bot
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Intelligent voice-based customer service solution powered by advanced AI
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-2 flex-grow">
        <div className="space-y-3 mt-2">
          {[
            { id: '1', text: 'Natural voice interactions with customers' },
            { id: '2', text: 'Multi-language support for global reach' },
            { id: '3', text: 'Detailed call analytics and insights' },
          ].map((feature) => (
            <div key={feature.id} className="flex items-start gap-2 text-sm text-gray-600">
              <div className="min-w-4 mt-0.5">
                <Star className="w-4 h-4 text-[#EB6C33]" />
              </div>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
        <Button 
          disabled
          className="w-full bg-gray-100 text-gray-500 font-medium h-12 cursor-not-allowed"
        >
          Coming Soon
          <Clock className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const CustomSolutionCard: React.FC = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-6px] border border-orange-100 h-full flex flex-col group overflow-hidden">
        <CardHeader className="space-y-2 p-6 pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <ServiceIcon serviceId="custom-solution" />
            </div>
            <Badge 
              variant="outline" 
              className="bg-white text-[#EB6C33] border-orange-200 font-medium"
            >
              Enterprise
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mt-4">
            Custom Solutions
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Tailor-made AI solutions designed specifically for your business needs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2 flex-grow">
          <div className="space-y-3 mt-2">
            {[
              { id: '1', text: 'Dedicated development team for your project' },
              { id: '2', text: 'Custom integrations with your existing stack' },
              { id: '3', text: 'Specialized AI training for your use cases' },
              { id: '4', text: 'Priority support and dedicated account manager' },
            ].map((feature) => (
              <div key={feature.id} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="min-w-4 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#EB6C33]" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto">
          <Button 
            className="w-full bg-[#EB6C33] hover:bg-[#ff8555] text-white font-medium h-12 group-hover:shadow-md transition-all duration-300"
            onClick={()=>{router.push('/console/support')}}
          >
            Contact Sales
            <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const ServicesHeader: React.FC = () => (
  <div className="text-center mb-20">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto"
    >
      <Badge className="mb-4 bg-orange-50 text-[#EB6C33] border-orange-200 px-4 py-1.5">
        Our Services
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        Powerful AI Tools for Modern Business
      </h1>
      <p className="text-gray-600 mx-auto text-lg mb-8">
        Experience enterprise-grade automation and AI solutions designed to scale with your business needs and drive exceptional results
      </p>
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="flex flex-wrap justify-center gap-6 md:gap-12"
    >
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
        <Clock className="w-5 h-5 text-[#EB6C33]" />
        <span className="text-sm font-medium text-gray-700">24/7 Support</span>
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
        <Sparkles className="w-5 h-5 text-[#EB6C33]" />
        <span className="text-sm font-medium text-gray-700">99.9% Uptime</span>
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
        <Zap className="w-5 h-5 text-[#EB6C33]" />
        <span className="text-sm font-medium text-gray-700">Enterprise Ready</span>
      </div>
    </motion.div>
  </div>
);

const ProductsPage: React.FC = () => {
  const { user } = useUser();
  const [userProducts, setUserProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        if (user?.id) {
          const products = await getUserProducts(user.id);
          console.log("User Products in services", products);
          // If the user has products, add them to the userProducts array
          if (products && products.length > 0) {
            // Extract all product names into an array
            const productNames = products.map(product => product.name);
            setUserProducts(productNames);
          }
        }
      } catch (error) {
        console.error("Error fetching user products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProducts();
  }, [user]);

  // Filter services to exclude ones the user already has
  const filteredServices = services.filter(
    (service) => !userProducts.includes(service.id)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-orange-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB6C33] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading available services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto max-w-7xl">
        <ServicesHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          
          {/* Always show call bot since it's coming soon */}
          <CallBotCard />
          
          {/* Always show custom solutions since it's an enterprise option */}
          <CustomSolutionCard />
        </div>
        
      </main>
    </div>
  );
};

export default ProductsPage;