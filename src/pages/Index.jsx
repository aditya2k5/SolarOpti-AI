import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';

import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
const Index = () => {
  return <div className="min-h-screen bg-transparent">
    <Navbar />
    <main>
      <HeroSection />

      <FeaturesSection />
      <PricingSection />
      <CtaSection />
    </main>
    <Footer />
  </div>;
};
export default Index;