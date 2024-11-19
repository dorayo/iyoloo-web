'use client'

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LogoIcon from '../home/LogoIcon';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Values", href: "#values" },
    { label: "Features", href: "#features" },
    { label: "Membership", href: "#membership" },
    { label: "Security", href: "#security" },
  ];

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 top-0 left-0 border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18"> {/* 稍微增加高度 */}
          {/* Logo */}
          <div className="flex-shrink-0">
          <a href="#" className="flex items-center">
            <LogoIcon />
            <span className="ml-3 text-2xl font-bold text-[#2D1B69]">
              iyoloo
            </span>
          </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10"> {/* 增加间距 */}
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-[#2D1B69] transition-all duration-200 font-medium
                  relative group py-2"
              >
                {item.label}
                {/* Hover underline effect */}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2D1B69] transform scale-x-0 
                  group-hover:scale-x-100 transition-transform duration-200" />
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-[#2D1B69] border border-[#2D1B69] 
              rounded-full hover:bg-[#2D1B69] hover:text-white transition-all duration-200
              active:scale-95 transform">
              Language
            </button>
            <button 
              className="px-4 py-2 text-sm font-medium text-[#2D1B69] border border-[#2D1B69] 
                rounded-full hover:bg-[#2D1B69] hover:text-white transition-all duration-200
                active:scale-95 transform"
            >
              Sign In
            </button>
            <button className="px-6 py-2 text-sm font-medium text-white rounded-full 
              bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] hover:opacity-90 
              transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg
              active:scale-95">
              Start Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-[#2D1B69]
                hover:bg-gray-100/50 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-3 pt-3 pb-4 space-y-2"> {/* 调整间距 */}
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-2.5 rounded-lg text-base font-medium 
                    text-gray-700 hover:text-[#2D1B69] hover:bg-gray-50
                    transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
              <div className="space-y-2.5 pt-4 border-t border-gray-100">
                <button className="w-full px-5 py-2.5 text-sm font-medium text-[#2D1B69] 
                  border border-[#2D1B69] rounded-full hover:bg-[#2D1B69] hover:text-white 
                  transition-all duration-200 active:scale-95 transform">
                  Language
                </button>
                <button 
                  className="w-full px-5 py-2.5 text-sm font-medium text-[#2D1B69] 
                    border border-[#2D1B69] rounded-full hover:bg-[#2D1B69] hover:text-white 
                    transition-all duration-200 active:scale-95 transform"
                >
                  Sign In
                </button>
                <button className="w-full px-6 py-2.5 text-sm font-medium text-white rounded-full 
                  bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] hover:opacity-90 
                  transition-all duration-200 active:scale-95 transform">
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