'use client'

const Footer = () => {
  const links = [
    { text: "Privacy", href: "#" },
    { text: "Terms", href: "#" },
    { text: "Help", href: "#" },
    { text: "Contact", href: "#" }
  ];

  return (
    <footer className="bg-[#1a103f] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#2D1B69] rounded-full"></div>
            <span className="text-2xl font-bold text-white">
              iyoloo
            </span>
          </div>
          
          {/* Brand Statement */}
          <p className="text-white/70 text-center max-w-md">
            Because You Only Live Once — Define Life on Your Terms
          </p>
          
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8">
            {links.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                {link.text}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-white/60 text-sm pt-8 border-t border-white/10 w-full text-center">
            © 2024 iyoloo. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;