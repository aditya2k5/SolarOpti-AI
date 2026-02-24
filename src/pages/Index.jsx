import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
const Index = () => {
  return <div className="min-h-screen bg-transparent">
    <Navbar />
    <main>
      <HeroSection />

      <FeaturesSection />

      <CtaSection />
    </main>
    <Footer />
  </div>;
};
export default Index;