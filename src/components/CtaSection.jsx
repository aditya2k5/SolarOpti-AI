import React from "react";
import { Phone, Mail } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-transparent">
      <div className="section-container">
        <div className="card p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
            Contact{" "}
            <span className="gradient-text">
              SolarOpti.AI
            </span>
          </h2>

          <p className="mt-3 text-[rgba(248,250,252,0.72)]">
            Need help with solar yield, ROI, or tilt optimization? Reach us here.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a
              href="tel:+910000000000"
              className="card flex items-center justify-center gap-3 px-6 py-4 text-[#F8FAFC] hover:text-[#34D399]"
            >
              <Phone className="h-5 w-5 text-[#10B981]" />
              <span className="font-medium">+91 00000 00000</span>
            </a>

            <a
              href="mailto:hello@solaropti.ai"
              className="card flex items-center justify-center gap-3 px-6 py-4 text-[#F8FAFC] hover:text-[#34D399]"
            >
              <Mail className="h-5 w-5 text-[#10B981]" />
              <span className="font-medium">hello@solaropti.ai</span>
            </a>
          </div>

          <p className="mt-6 text-sm text-[rgba(248,250,252,0.72)]">
            Available: Mon–Sat, 10 AM – 6 PM IST
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
