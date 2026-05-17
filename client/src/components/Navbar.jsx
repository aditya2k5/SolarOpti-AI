import React, { useState, useContext } from 'react'; // Added useContext
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react'; // Added Sun and Moon

import logo from '../../assets/SolarOpti-logo.png';

import { ThemeContext } from './ui/themeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Consume the context
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const goToSection = (id) => {
    if (location.pathname === '/Index') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(`/Index#${id}`);
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/80 dark:bg-black/40 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-[rgba(16,185,129,0.22)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/Index" className="flex items-center gap-2">
              <img src={logo} alt="SolarOpti.AI Logo" className="h-8 w-auto" />
              <span className="text-2xl font-bold gradient-text">SolarOpti.AI</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => goToSection('home')} className={`px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/Index' && (!location.hash || location.hash === '#home') ? 'text-[#10B981]' : 'text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Home
            </button>
            <button onClick={() => goToSection('about')} className={`px-3 py-2 text-sm font-medium transition-colors ${location.hash === '#about' ? 'text-[#10B981]' : 'text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              About
            </button>
            <button onClick={() => goToSection('features')} className={`px-3 py-2 text-sm font-medium transition-colors ${location.hash === '#features' ? 'text-[#10B981]' : 'text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Features
            </button>
            <button onClick={() => goToSection('contact')} className={`px-3 py-2 text-sm font-medium transition-colors ${location.hash === '#contact' ? 'text-[#10B981]' : 'text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`}>
              Contact
            </button>

            {/* Desktop Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full bg-gray-100 dark:bg-[rgba(16,185,129,0.1)] text-gray-600 dark:text-[#34D399] hover:ring-2 ring-[#10B981] transition-all duration-300"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle (Visible before opening menu) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.1)] focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#050B0A] border-t border-gray-200 dark:border-[rgba(16,185,129,0.22)]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md ${location.pathname === '/Index' && (!location.hash || location.hash === '#home') ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`} onClick={() => goToSection('home')}>
              Home
            </button>
            <button className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md ${location.hash === '#about' ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`} onClick={() => goToSection('about')}>
              About
            </button>
            <button className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md ${location.hash === '#features' ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`} onClick={() => goToSection('features')}>
              Features
            </button>
            <button className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md ${location.hash === '#contact' ? 'text-[#10B981] bg-[rgba(16,185,129,0.1)]' : 'text-gray-600 dark:text-[rgba(248,250,252,0.72)] hover:text-[#34D399]'}`} onClick={() => goToSection('contact')}>
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;