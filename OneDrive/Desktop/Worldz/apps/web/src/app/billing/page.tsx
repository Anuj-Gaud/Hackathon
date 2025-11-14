'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/ui/Button';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    features: [
      'Post up to 5 jobs',
      'Basic analytics',
      'Email support',
      'Standard listing',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: [
      'Post up to 20 jobs',
      'Advanced analytics',
      'Priority support',
      'Featured listings',
      'Custom branding',
      'Bulk posting',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    features: [
      'Unlimited job posts',
      'Full analytics suite',
      '24/7 support',
      'Premium listings',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
];

const faqs = [
  {
    q: 'Can I change plans later?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.'
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes, we offer a 14-day free trial on all plans. No credit card required to start.'
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.'
  },
];

export default function BillingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const getPrice = (price: number) => {
    if (isYearly) {
      return `$${Math.round(price * 12 * 0.8)}`; // 20% off for yearly
    }
    return `$${price}`;
  };

  const getPeriod = () => (isYearly ? 'year' : 'month');

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // TODO: Integrate with payment/Supabase
    alert(`Subscribed to ${planId} plan (${isYearly ? 'Yearly' : 'Monthly'})`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black">Choose Your Plan</h1>
          <p className="mt-4 text-gray-600">Select the perfect plan for your hiring needs</p>
        </div>
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-soft p-1">
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${!isYearly ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${isYearly ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setIsYearly(true)}
              >
                Yearly <span className="ml-1 text-xs text-green-500">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-soft p-8 flex flex-col items-center ${plan.popular ? 'ring-2 ring-black' : ''}`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 text-sm font-medium text-black bg-gray-100 rounded-full mb-4">Most Popular</span>
              )}
              <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-bold text-black">{getPrice(plan.price)}</span>
                <span className="ml-1 text-gray-500">/ {getPeriod()}</span>
              </div>
              {isYearly && (
                <p className="mt-1 text-sm text-green-500">Save 20% with yearly billing</p>
              )}
              <ul className="mt-6 space-y-4 w-full">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="h-5 w-5 text-black mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                fullWidth
                className="mt-8"
                onClick={() => handleSubscribe(plan.id)}
                disabled={selectedPlan === plan.id}
              >
                {selectedPlan === plan.id ? 'Current Plan' : 'Subscribe'}
              </Button>
            </div>
          ))}
        </div>
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-soft p-6">
                <h3 className="text-lg font-semibold text-black mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 