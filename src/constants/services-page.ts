export interface Feature {
    id: string;
    text: string;
    available: boolean;
  }
  
export interface Service {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    route: string;
    features: Feature[];
  }
export const services: Service[] = [
    {
      id: 'Whatsapp-bot',
      title: 'WhatsApp AI Chatbot',
      description: 'Automate your customer interactions with our intelligent WhatsApp Bot solution. Provide 24/7 support and enhance customer engagement through WhatsApp. Leverage automated responses, improve customer service, and offer a personalized experience for your users.',
      imageUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=800',
      route: '/console/services/whatsapp',
      features: [
        { id: '1', text: 'Automated customer support 24/7', available: true },
        { id: '2', text: 'Multi-language support', available: true },
        { id: '3', text: 'Custom workflow automation', available: true },
        { id: '4', text: 'Rich media message handling', available: true },
        { id: '5', text: 'Analytics dashboard', available: true },
      ],
    },
    {
      id: 'WebBot',
      title: 'Website AI Chatbot',
      description: 'Enhance your website with our AI-powered Web Chatbot. Engage visitors instantly and convert them into customers with intelligent conversations. The Web Chatbot integrates seamlessly with your website, providing a robust tool to handle customer inquiries and boost lead generation.',
      imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800',
      route: '/console/services/webbot',
      features: [
        { id: '1', text: 'Easy website integration', available: true },
        { id: '2', text: 'Customizable chat interface', available: true },
        { id: '3', text: 'Lead generation capabilities', available: true },
        { id: '4', text: 'Real-time visitor insights', available: true },
        { id: '5', text: 'Integration with CRM systems', available: true },
      ],
    },
  ];