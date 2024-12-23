"use client";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import LogoIcon from "../home/LogoIcon";
import { useRouter } from "next/navigation";
import { useUserStore } from "~/store/user";

import { LanguageSwitcher } from "~/components/ui/LanguageSwitcher";
import { useTranslation } from "~/hooks/useTranslation";

const Navigation = () => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  // const [isOpen, setIsOpen] = useState(false);
  // const handleNavClick = () => {
  //   setIsOpen(false);
  // };
  const navItems = [
    { label: "Values", href: "/home#values" },
    { label: "Philosophy", href: "/home#philosophy" },
    { label: "Elite", href: "/home#elite" },
    { label: "Features", href: "/home#features" },
    { label: "Membership", href: "/home#membership" },
    { label: "Security", href: "/home#security" },
  ];

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const handleChangeLanguage = () => {
    // Handle language change logic here
  };
  const handleLoginClick = () => {
    router.push("/sign-in");
  };

  const handleStartNowClick = () => {
    if (user?.clerkId) {
      if (user.userInfo?.birthday) {
        router.push("/homepage?id=" + user.id);
      } else {
        router.push("/info");
      }
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#1a103f]/80 backdrop-blur-sm">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex items-center justify-between py-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/home#" className="group flex items-center">
              <LogoIcon />
              <span className="ml-2.5 text-2xl font-bold text-white transition-opacity group-hover:opacity-90">
                iyoloo
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative py-2 font-medium text-white/80 transition-all duration-200 hover:text-white"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            {/* <button className="px-5 py-2.5 text-sm font-medium text-white/90 border border-white/10 
              rounded-full hover:bg-white/10 transition-all duration-200
              active:scale-95 transform backdrop-blur-sm"
              onClick={handleChangeLanguage}>
              Language
            </button> */}
            <LanguageSwitcher />
            {!(user?.clerkId) && (
              <button
                onClick={handleLoginClick}
                className="transform rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 active:scale-95"
              >
                Sign In
              </button>
            )}
            <button
              className="transform rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg hover:shadow-[#8B5CF6]/20 active:scale-95"
              onClick={handleStartNowClick}
            >
              {t("common.Start Now")}
            </button>
            <UserButton />
          </div>

          {/* Mobile menu button */}
          {/* <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-white/80 hover:text-white
                hover:bg-white/10 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div> */}
        </div>

        {/* Mobile Navigation */}
        {/* {isOpen && (
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
                  onClick={handleChangeLanguage}
                  className="w-full px-5 py-2.5 text-sm font-medium text-white/90 
                    border border-white/10 rounded-full hover:bg-white/10 
                    transition-all duration-200 active:scale-95 transform"
                >
                  Language
                </button>
                {!(user&&user.id) &&
                <button 
                  onClick={handleLoginClick}
                  className="w-full px-5 py-2.5 text-sm font-medium text-white/90 
                    border border-white/10 rounded-full hover:bg-white/10 
                    transition-all duration-200 active:scale-95 transform"
                >
                  Sign In
                </button>
                }
                <button 
                  onClick={handleStartNowClick}
                  className="w-full px-6 py-2.5 text-sm font-medium text-white rounded-full 
                    bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] hover:opacity-90 
                    transition-all duration-200 active:scale-95 transform"
                >
                  Start Now
                </button>
                <UserButton/>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default Navigation;
