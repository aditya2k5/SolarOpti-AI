import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Sun, Zap, MapPin, FileText, TrendingUp } from 'lucide-react';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Homeowner',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for residential solar planning',
      features: [
        '5 simulations/month',
        'Basic yield forecasting',
        'ROI calculator',
        'Location analysis',
        'PDF reports'
      ],
      isPopular: false,
      ctaText: 'Get Started Free'
    },
    {
      name: 'Professional',
      monthlyPrice: 29,
      annualPrice: 19,
      description: 'For engineers & installers',
      features: [
        'Unlimited simulations',
        'AI tilt optimization',
        'Advanced forecasting',
        'Priority support',
        'Unlimited PDF exports',
        '3D visualizations',
        'Custom reports'
      ],
      isPopular: true,
      ctaText: 'Start Professional'
    },
    {
      name: 'Enterprise',
      monthlyPrice: 79,
      annualPrice: 59,
      description: 'For solar businesses & EPCs',
      features: [
        'Unlimited everything',
        'Team accounts (10+ users)',
        'API access',
        'White-label reports',
        'Portfolio management',
        'Live monitoring integration',
        'Dedicated support',
        'Custom optimizations'
      ],
      isPopular: false,
      ctaText: 'Contact Sales'
    }
  ];

  return (
    <div className="bg-transparent py-16 md:py-24">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text">
            Simple, <span className="block text-[#F8FAFC]">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-[rgba(248,250,252,0.72)] max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your needs. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <span className={`text-sm font-medium ${isAnnual ? 'text-[#34D399]' : 'text-[rgba(248,250,252,0.72)]'}`}>
            Annual <span className="text-xs text-[#34D399]">(Save 20%)</span>
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isAnnual ? 'bg-[#10B981]' : 'bg-[rgba(255,255,255,0.2)]'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </button>
          <span className={`text-sm font-medium ${!isAnnual ? 'text-[#34D399]' : 'text-[rgba(248,250,252,0.72)]'}`}>
            Monthly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card group p-8 ${plan.isPopular ? 'border-[#34D399]/50 shadow-emerald scale-[1.02]' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.isPopular && (
                <span className="bg-[#10B981] text-[#050B0A] text-xs font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block">
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold mb-2 text-[#F8FAFC] group-hover:text-[#34D399] transition-colors">{plan.name}</h3>
              <p className="text-[rgba(248,250,252,0.72)] mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[#F8FAFC]">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-[#34D399]"> /month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-[#34D399] mr-2 shrink-0" />
                    <span className="text-[rgba(248,250,252,0.72)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.isPopular ? 'btn-primary' : 'btn-outline'}`}
              >
                {plan.ctaText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
