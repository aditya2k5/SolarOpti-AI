import React from 'react';
import logo from '../../assets/SolarOpti-logo.png';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-transparent border-t border-[var(--border-emerald)] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
          
          {/* Company info */}
          <div className="col-span-1 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SolarOpti.AI Logo" className="h-8 w-auto" />
              <span className="text-2xl font-bold gradient-text">SolarOpti.AI</span>
            </a>
            <p className="text-[var(--text-muted)] mb-4">
              Design, simulate, and optimize solar installations with AI precision.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <a key={i} href="#" className="text-[var(--text-muted)] hover:text-[#10B981] transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    {/* Simplified path for placeholder logic */}
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </a>
              ))}
            </div>

            {/* Log Out Button - Reactive */}
            <button
              className="btn-outline mt-6 px-4 py-2 text-sm"
              onClick={() => navigate("/")}
            >
              Log Out
            </button>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Product</h3>
            <ul className="space-y-3">
              {['Home', 'Roadmap', 'Pricing', 'Documentation', 'Features'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[var(--text-muted)] hover:text-[#10B981] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Company</h3>
            <ul className="space-y-3">
              {['Blog', 'Contact Us', 'About', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[var(--text-muted)] hover:text-[#10B981] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms & Conditions', 'Cookie Policy', 'GDPR'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[var(--text-muted)] hover:text-[#10B981] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[var(--border-emerald)] text-center text-sm text-[var(--text-muted)] opacity-60">
          <p>© {new Date().getFullYear()} SolarOpti.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;