import { Raleway } from 'next/font/google';
import Sidebar from "@/components/whatsapp/components/sidebar";
import "../../../globals.css"
import { TenantConfigProvider } from '@/context/whatsapp/TenantConfigContext';

const raleway = Raleway({ subsets: ['latin'] });

export default function WhatsappLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <TenantConfigProvider>
            <div className={`flex h-screen bg-background font-sans ${raleway.className}`}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </TenantConfigProvider>
    );
}