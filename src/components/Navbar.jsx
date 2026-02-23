import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to check if a link is active
  const isActive = path => {
    return location.pathname === path;
  };
  return <nav className="bg-black/40 backdrop-blur-md sticky top-0 z-50 border-b border-[rgba(16,185,129,0.22)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">SolarOpti.AI</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-4">
            <Link to="/" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/') ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Home
            </Link>
            <Link to="" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/about') ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              About
            </Link>
            <Link to="" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/features') ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Features
            </Link>
            <Link to="" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/pricing') ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Pricing
            </Link>

            <Link to="" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/contact') ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Contact
            </Link>
          </div>
        </div>

        {/* CTA Button */}


        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.1)] focus:outline-none">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile menu */}
    {isOpen && <div className="md:hidden bg-[#050B0A] border-t border-[rgba(16,185,129,0.22)]">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link to="/" className={`block px-3 py-2 text-base font-medium rounded-md ${isActive('/') ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="" className={`block px-3 py-2 text-base font-medium rounded-md ${isActive('about') ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => setIsOpen(false)}>
          About
        </Link>
        <Link to="" className={`block px-3 py-2 text-base font-medium rounded-md ${isActive('features') ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => setIsOpen(false)}>
          Features
        </Link>
        <Link to="" className={`block px-3 py-2 text-base font-medium rounded-md ${isActive('pricing') ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => setIsOpen(false)}>
          Pricing
        </Link>
        <Link to="" className={`block px-3 py-2 text-base font-medium rounded-md ${isActive('contact') ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => setIsOpen(false)}>
          Contact
        </Link>

        <div className="mt-4 px-3 py-2">
          <Link to="https://codescandy.com/" target="_blank" className="btn-primary w-full inline-block text-center">
            Get Template
          </Link>
        </div>
      </div>
    </div>}
  </nav>;
};
export default Navbar;