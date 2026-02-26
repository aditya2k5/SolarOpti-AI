import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/SolarOpti-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const goToSection = (id) => {
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(`/#${id}`);
    }
    setIsOpen(false);
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
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SolarOpti.AI Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold gradient-text">SolarOpti.AI</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-4">
            <button onClick={() => goToSection('home')} className={`px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/' && (!location.hash || location.hash === '#home') ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Home
            </button>
            <button onClick={() => goToSection('about')} className={`px-3 py-2 text-sm font-medium transition-colors ${location.hash === '#about' ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              About
            </button>
            <button onClick={() => goToSection('features')} className={`px-3 py-2 text-sm font-medium transition-colors ${location.hash === '#features' ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Features
            </button>

            <button onClick={() => goToSection('contact')} className={`px-3 py-2 text-sm font-medium transition-colors ${location.hash === '#contact' ? 'text-[#10B981]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Contact
            </button>
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
        <button className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md ${location.pathname === '/' && (!location.hash || location.hash === '#home') ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => goToSection('home')}>
          Home
        </button>
        <button className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md ${location.hash === '#about' ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => goToSection('about')}>
          About
        </button>
        <button className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md ${location.hash === '#features' ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => goToSection('features')}>
          Features
        </button>
        <button className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md ${location.hash === '#contact' ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.05)]'}`} onClick={() => goToSection('contact')}>
          Contact
        </button>

        <div className="mt-4 px-3 py-2">

        </div>
      </div>
    </div>}
  </nav>;
};
export default Navbar;