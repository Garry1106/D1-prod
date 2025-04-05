"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, Package } from "lucide-react";
import { SUBSCRIPTION_PRICES, type SubscriptionTier } from "@/constants/pricing";

interface CartProps {
  subscriptionLevel?: SubscriptionTier;
}

export default function Cart({ subscriptionLevel }: CartProps) {
  const price = subscriptionLevel ? SUBSCRIPTION_PRICES[subscriptionLevel] : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-[#EB6C33]" />
        <h3 className="text-lg font-semibold">Order Summary</h3>
      </div>
      
      <ScrollArea className="h-[200px] rounded-md border p-4">
        {subscriptionLevel ? (
          <div className="flex items-start gap-4">
            <Package className="h-5 w-5 text-[#EB6C33] mt-1" />
            <div className="flex-1">
              <p className="font-medium">{subscriptionLevel} Plan</p>
              <p className="text-sm text-muted-foreground">Monthly subscription</p>
            </div>
            <p className="font-semibold">₹{price}/mo</p>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Select a subscription plan to see the price
          </p>
        )}
      </ScrollArea>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Subtotal</p>
          <p className="font-medium">₹{price}</p>
        </div>
        <div className="flex justify-between border-t pt-2">
          <p className="font-semibold">Total</p>
          <p className="font-semibold text-[#EB6C33]">₹{price}/mo</p>
        </div>
      </div>
    </Card>
  );
}