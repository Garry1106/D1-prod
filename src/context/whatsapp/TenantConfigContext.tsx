'use client'

// context/TenantConfigContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

 interface TenantConfig {
    _id: string;
    clerkId: string;
    businessName: string;
    waba_id: string;
    displayPhoneNumber: string;
    phoneNumberId: string;
    accessToken: string;
    appId: string;
    appSecret: string;
    botName: string;
    language: string;
    role: string;
    ttsGender: string;
    country: string;
    currency: string;
    subscription: {
        subscriptionLevel: string;
        subscriptionExpiry: string;
        price: string;
        features: {
            text: boolean;
            tts: boolean;
            aiResponse: boolean;
            image: boolean;
            audio: boolean;
            document: boolean;
            video: boolean;
            sticker: boolean;
            interactive: boolean;
            retrieval: boolean;
        };
        limits: {
            messagesCount: number;
            ttsCount: number;
            imagesCount: number;
            audiosCount: number;
            documentsCount: number;
            videosCount: number;
        };
    };
}

interface TenantConfigContextType {
    tenantConfig: TenantConfig | null;
    setTenantConfig: (config: any) => void;
}

const TenantConfigContext = createContext<TenantConfigContextType | undefined>(undefined);

export const TenantConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);

    return (
        <TenantConfigContext.Provider value={{ tenantConfig, setTenantConfig }}>
            {children}
        </TenantConfigContext.Provider>
    );
};

export const useTenantConfig = () => {
    const context = useContext(TenantConfigContext);
    if (!context) {
        throw new Error('useTenantConfig must be used within a TenantConfigProvider');
    }
    return context;
};
