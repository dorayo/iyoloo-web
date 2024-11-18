'use client'

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Values", href: "#values" },
    { label: "Features", href: "#features" },
    { label: "Membership", href: "#membership" },
    { label: "Security", href: "#security" },
  ];

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <div className="w-8 h-8 bg-[#2D1B69] rounded-full"></div>
              <span className="ml-2 text-2xl font-bold text-[#2D1B69] font-sans">
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
                className="text-gray-700 hover:text-[#2D1B69] transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-[#2D1B69] border border-[#2D1B69] rounded-full hover:bg-[#2D1B69] hover:text-white transition-colors duration-200">
              Language
            </button>
            <button 
              className="px-4 py-2 text-sm font-medium text-[#2D1B69] border border-[#2D1B69] rounded-full hover:bg-[#2D1B69] hover:text-white transition-colors duration-200"
            >
              Sign In
            </button>
            <button className="px-6 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] hover:opacity-90 transition-opacity duration-200">
              Start Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-[#2D1B69]"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2D1B69] hover:bg-gray-50"
                >
                  {item.label}
                </a>
              ))}
              <div className="space-y-2 pt-4">
                <button className="w-full px-4 py-2 text-sm font-medium text-[#2D1B69] border border-[#2D1B69] rounded-full hover:bg-[#2D1B69] hover:text-white">
                  Language
                </button>
                <button 
                  className="w-full px-4 py-2 text-sm font-medium text-[#2D1B69] border border-[#2D1B69] rounded-full hover:bg-[#2D1B69] hover:text-white"
                >
                  Sign In
                </button>
                <button className="w-full px-6 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] hover:opacity-90">
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