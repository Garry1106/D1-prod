"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cart;
const card_1 = require("@/components/ui/card");
const scroll_area_1 = require("@/components/ui/scroll-area");
const lucide_react_1 = require("lucide-react");
function Cart({ subscriptionLevel }) {
    // Hardcoded prices for demonstration
    const prices = {
        Basic: 500,
        Standard: 1000,
        Premium: 1500,
    };
    const price = subscriptionLevel ? prices[subscriptionLevel] : 0;
    return (<card_1.Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <lucide_react_1.CreditCard className="h-5 w-5 text-[#EB6C33]"/>
        <h3 className="text-lg font-semibold">Order Summary</h3>
      </div>

      <scroll_area_1.ScrollArea className="h-[200px] rounded-md border p-4">
        {subscriptionLevel ? (<div className="flex items-start gap-4">
            <lucide_react_1.Package className="h-5 w-5 text-[#EB6C33] mt-1"/>
            <div className="flex-1">
              <p className="font-medium">{subscriptionLevel} Plan</p>
              <p className="text-sm text-muted-foreground">Monthly subscription</p>
            </div>
            <p className="font-semibold">₹{price}/mo</p>
          </div>) : (<p className="text-center text-muted-foreground">
            Select a subscription plan to see the price
          </p>)}
      </scroll_area_1.ScrollArea>

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
    </card_1.Card>);
}
