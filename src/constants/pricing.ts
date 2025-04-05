export const SUBSCRIPTION_PRICES = {
    Basic:749,
    Standard:1499,
    Premium: 2499,
  } as const;
  
export type SubscriptionTier = keyof typeof SUBSCRIPTION_PRICES;


  // @/constants/pricing.ts
export type SubscriptionName = "Basic" | "Standard" | "Premium";
export const SUBSCRIPTION_COST: Record<SubscriptionTier, number> = {
  Basic: 500,
  Standard: 1000,
  Premium: 1500,
};