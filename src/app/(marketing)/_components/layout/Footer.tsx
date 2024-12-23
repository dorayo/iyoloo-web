"use client";

import LogoIcon from "../home/LogoIcon";

const Footer = () => {
  const links = [
    { text: "Privacy", href: "#" },
    { text: "Terms", href: "#" },
    { text: "Help", href: "#" },
    { text: "Contact", href: "#" },
  ];

  return (
    <footer className="bg-[#1a103c] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="group flex items-center">
              <LogoIcon />
              <span className="ml-2.5 text-2xl font-bold text-white transition-opacity group-hover:opacity-90">
                iyoloo
              </span>
            </a>
          </div>

          {/* Brand Statement */}
          <p className="max-w-md text-center text-white/70">
            You Only Live Once — Define Life on Your Terms
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8">
            {links.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-white/70 transition-colors duration-200 hover:text-white"
              >
                {link.text}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="w-full border-t border-white/10 pt-8 text-center text-sm text-white/60">
            © 2024 iyoloo. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
