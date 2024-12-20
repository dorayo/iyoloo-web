'use client'

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LogoIcon from '../home/LogoIcon';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const navItems = [
    { label: "Values", href: "#values" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Elite", href: "#elite" },
    { label: "Features", href: "#features" },
    { label: "Membership", href: "#membership" },
    { label: "Security", href: "#security" }
  ];

  return (
    <nav className="fixed w-full bg-[#1a103f]/80 backdrop-blur-sm z-50 top-0 left-0 border-b border-white/10">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center group">
              <LogoIcon />
              <span className="ml-2.5 text-2xl font-bold text-white group-hover:opacity-90 transition-opacity">
                iyoloo
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/80 hover:text-white transition-all duration-200 font-medium
                  relative group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] transform scale-x-0 
                  group-hover:scale-x-100 transition-transform duration-200" />
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-5 py-2.5 text-sm font-medium text-white/90 border border-white/10 
              rounded-full hover:bg-white/10 transition-all duration-200
              active:scale-95 transform backdrop-blur-sm">
              Language
            </button>
            <button 
              className="px-5 py-2.5 text-sm font-medium text-white/90 border border-white/10
                rounded-full hover:bg-white/10 transition-all duration-200
                active:scale-95 transform backdrop-blur-sm"
            >
              Sign In
            </button>
            <button className="px-6 py-2.5 text-sm font-medium text-white rounded-full 
              bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] hover:opacity-90 
              transition-all duration-200 transform hover:-translate-y-0.5 
              hover:shadow-lg hover:shadow-[#8B5CF6]/20
              active:scale-95">
              Start Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-white/80 hover:text-white
                hover:bg-white/10 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden w-full">
            <div className="px-3 pt-3 pb-4 space-y-2 border-t border-white/10 bg-[#1a103f]/95 backdrop-blur-sm">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleNavClick}
                  className="block px-4 py-2.5 rounded-lg text-base font-medium 
                    text-white/80 hover:text-white hover:bg-white/10
                    transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <button 
                  onClick={handleNavClick}
                  className="w-full px-5 py-2.5 text-sm font-medium text-white/90 
                    border border-white/10 rounded-full hover:bg-white/10 
                    transition-all duration-200 active:scale-95 transform"
                >
                  Language
                </button>
                <button 
                  onClick={handleNavClick}
                  className="w-full px-5 py-2.5 text-sm font-medium text-white/90 
                    border border-white/10 rounded-full hover:bg-white/10 
                    transition-all duration-200 active:scale-95 transform"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleNavClick}
                  className="w-full px-6 py-2.5 text-sm font-medium text-white rounded-full 
                    bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] hover:opacity-90 
                    transition-all duration-200 active:scale-95 transform"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;