"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SubscriptionForm;
const radio_group_1 = require("@/components/forms/Whatsapp/ui/radio-group");
const label_1 = require("@/components/ui/label");
const card_1 = require("@/components/ui/card");
const form_1 = require("@/components/forms/Whatsapp/ui/form");
const lucide_react_1 = require("lucide-react");
const FormContext_1 = require("@/context/whatsapp/FormContext");
const SUBSCRIPTION_PLANS = [
    {
        name: 'Basic',
        price: '₹749/month',
        features: [
            'Text: Enabled',
            'TTS (Text-to-Speech): 50 requests/month',
            'AI Response: Enabled',
            'Image: 100 images/month',
            'Audio: 50 audios/month',
            'Document: 50 documents/month',
        ],
        limits: {
            messagesCount: 200,
            ttsCount: 50,
            imagesCount: 100,
            audiosCount: 50,
            documentsCount: 50,
        },
    },
    {
        name: 'Standard',
        price: '₹1499/month',
        features: [
            'All Basic features',
            'TTS (Text-to-Speech): 100 requests/month',
            'Image: 300 images/month',
            'Audio: 100 audios/month',
            'Document: 100 documents/month',
            'Video: 50 videos/month',
            'Sticker: Enabled',
        ],
        limits: {
            messagesCount: 500,
            ttsCount: 100,
            imagesCount: 300,
            audiosCount: 100,
            documentsCount: 100,
            videosCount: 50,
        },
    },
    {
        name: 'Premium',
        price: '₹2499/month',
        features: [
            'All Standard features',
            'TTS (Text-to-Speech): Unlimited',
            'Image: Unlimited',
            'Audio: Unlimited',
            'Document: Unlimited',
            'Video: Unlimited',
            'Sticker: Enabled',
            'Interactive: Enabled',
            'Retrieval: Enabled',
        ],
        limits: {
            messagesCount: 10000,
            ttsCount: 10000,
            imagesCount: 10000,
            audiosCount: 10000,
            documentsCount: 10000,
            videosCount: 10000,
        },
    },
];
function SubscriptionForm({ form, setSubscriptionLevel }) {
    const { updateSubscription } = (0, FormContext_1.useFormContext)();
    const setPrice = (level) => {
        const selectedPlan = SUBSCRIPTION_PLANS.find((plan) => plan.name === level);
        return selectedPlan ? selectedPlan.price : '$0/month';
    };
    const getFeatures = (featuresArray) => {
        return {
            text: featuresArray.includes('Text: Enabled'),
            tts: featuresArray.includes('TTS (Text-to-Speech): 50 requests/month') || featuresArray.includes('TTS (Text-to-Speech): Unlimited'),
            aiResponse: featuresArray.includes('AI Response: Enabled'),
            image: featuresArray.includes('Image: 100 images/month') || featuresArray.includes('Image: Unlimited'),
            audio: featuresArray.includes('Audio: 50 audios/month') || featuresArray.includes('Audio: Unlimited'),
            document: featuresArray.includes('Document: 50 documents/month') || featuresArray.includes('Document: Unlimited'),
            video: featuresArray.includes('Video: 50 videos/month') || featuresArray.includes('Video: Unlimited'),
            sticker: featuresArray.includes('Sticker: Enabled'),
            interactive: featuresArray.includes('Interactive: Enabled'),
            retrieval: featuresArray.includes('Retrieval: Enabled'),
        };
    };
    const handleValueChange = (value) => {
        setSubscriptionLevel(value);
        const price = setPrice(value);
        form.setValue('price', price);
        const selectedPlan = SUBSCRIPTION_PLANS.find((plan) => plan.name === value);
        if (selectedPlan) {
            form.setValue('features', getFeatures(selectedPlan.features));
            form.setValue('limits', selectedPlan.limits);
        }
        // Calculate and set subscription expiry date (one month after current date)
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        const expiryDate = currentDate.toISOString();
        console.log("Expiry Date:", expiryDate); // Debugging
        form.setValue('subscriptionExpiry', expiryDate);
        updateSubscription(value, expiryDate);
    };
    return (<form_1.Form {...form}>
      <form>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-600 text-center">
            Select the subscription plan that best fits your business needs.
          </p>
        </div>

        <form_1.FormField control={form.control} name="subscriptionLevel" render={({ field }) => (<form_1.FormItem>
              <form_1.FormControl>
                <radio_group_1.RadioGroup onValueChange={(value) => {
                const level = value;
                field.onChange(level);
                handleValueChange(level);
            }} defaultValue={field.value} className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {SUBSCRIPTION_PLANS.map((plan) => (<div key={plan.name}>
                      <radio_group_1.RadioGroupItem value={plan.name} id={plan.name} className="peer sr-only"/>
                      <label_1.Label htmlFor={plan.name} className="block cursor-pointer">
                        <card_1.Card className="p-6 hover:border-[#EB6C33] peer-checked:border-[#EB6C33] peer-checked:ring-2 peer-checked:ring-[#EB6C33] transition-all shadow-md duration-300">
                          <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                            <p className="text-xl font-bold text-[#EB6C33] mb-4">{plan.price}</p>
                          </div>
                        </card_1.Card>
                      </label_1.Label>
                    </div>))}
                </radio_group_1.RadioGroup>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>

        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Selected Plan Details</h3>
          {form.watch('subscriptionLevel') && (<card_1.Card className="p-6">
              <h4 className="text-xl font-semibold mb-2">
                {form.watch('subscriptionLevel')} Plan
              </h4>
              <p className="text-lg text-[#EB6C33] font-bold mb-4">
                {form.watch('price')}
              </p>
              <div className="mb-4">
                <h5 className="text-lg font-semibold mb-1">Features</h5>
                <ul className="space-y-1">
                  {Object.entries(form.watch('features') || {}).map(([key, value]) => (value && (<li key={key} className="flex items-start gap-2 text-sm text-gray-700">
                        <lucide_react_1.Check className="h-4 w-4 text-[#EB6C33] flex-shrink-0 mt-1"/>
                        <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      </li>)))}
                </ul>
              </div>

              <div>
                <h5 className="text-lg font-semibold mb-1">Usage Limits</h5>
                <div className="grid grid-cols-2 gap-2">
                  {form.watch('limits') &&
                Object.entries(form.watch('limits')).map(([key, value]) => (<div key={key} className="text-sm text-gray-700">
                        <span className="font-medium capitalize">
                          {key.replace('Count', '')}:
                        </span>
                        <span className="ml-2">{value}</span>
                      </div>))}
                </div>
              </div>
            </card_1.Card>)}
        </div>
      </form>
    </form_1.Form>);
}
