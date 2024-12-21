"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Heart,
  Star,
  SmartphoneNfc,
  QrCode,
  Apple,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "~/store/user";

const CTASection = () => {
  const trustFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      text: "Strict Privacy Protection",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      text: "Genuine Community",
    },
    {
      icon: <Star className="h-6 w-6" />,
      text: "Premium Membership",
    },
  ];

  // QRCode 部分的实现
  const DownloadQRCode = () => {
    return (
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] opacity-30 blur-xl" />

        <div className="relative rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          {/* 实际的二维码，链接指向智能引导页 */}
          <div className="group relative h-48 w-48 overflow-hidden rounded-xl bg-white p-3">
            <QrCode className="h-full w-full text-[#2D1B69]" />
            {/* 扫描提示动画 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"
              animate={{
                y: ["100%", "-100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-medium text-white/90">Scan to Download</p>
            <p className="text-sm text-white/60">Auto-detects iOS/Android</p>
          </div>
        </div>
      </div>
    );
  };

  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const handleStartNowClick = () => {
    if (user?.clerkId) {
      if (user?.userInfo?.birthday) {
        router.push("/homepage?id=" + user?.id);
      } else {
        router.push("/info");
      }
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a103f] to-[#2D1B69] py-24">
      {/* 保持原有的背景效果 */}
      {/* ... 你现有的背景代码 ... */}

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12 text-center"
        >
          {/* Main Headlines */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Start Your Ideal Lifestyle
            </h2>
            <h3 className="text-3xl font-bold text-white/90 md:text-4xl">
              Meet Your Destined One
            </h3>
          </div>

          {/* Trust Features */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6"
          >
            {trustFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                className="flex items-center space-x-2 text-white/80"
              >
                <div className="text-white/90">{feature.icon}</div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center space-y-8"
          >
            {/* QR Code */}
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] opacity-30 blur-xl" />

              <div className="relative rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                <div className="h-48 w-48 rounded-xl bg-white p-3">
                  <QrCode className="h-full w-full text-[#2D1B69]" />
                </div>
                <p className="mt-4 text-sm text-white/80">Scan to Download</p>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <Apple className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <SmartphoneNfc className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Web Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="group relative transform rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:opacity-90">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-50" />

              <div className="relative flex items-center justify-center space-x-2">
                <button onClick={handleStartNowClick}>Start on Web</button>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.div>
              </div>
            </button>
          </motion.div>

          {/* Trust Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-white/60"
          >
            Available on iOS & Android with strict privacy protection
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
