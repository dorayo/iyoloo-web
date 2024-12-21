"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Compass } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="h-12 w-12" />,
      title: "Smart Matching",
      subtitle: "Meet your destined one",
      description:
        "Multi-dimensional matching based on values and life planning",
      benefits: [
        "Personalized recommendations",
        "Deep interest matching",
        "Lifestyle compatibility",
        "Value alignment analysis",
      ],
      gradient: "from-purple-500/20 to-indigo-500/20",
    },
    {
      icon: <MessageCircle className="h-12 w-12" />,
      title: "Deep Connection",
      subtitle: "Build genuine relationships",
      description: "From shared values to spiritual resonance",
      benefits: [
        "Cross-language communication",
        "Emotional interaction tools",
        "Privacy protection",
        "Multi-topic exploration",
      ],
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: <Compass className="h-12 w-12" />,
      title: "Future Co-creation",
      subtitle: "Co-create ideal life",
      description: "Respect mutual choices, realize life aspirations",
      benefits: [
        "Lifestyle planning",
        "Shared goal setting",
        "Growth trajectory tracking",
        "Vision blueprint creation",
      ],
      gradient: "from-violet-500/20 to-indigo-500/20",
    },
  ];

  const generateStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
  };

  const stars = generateStars(50);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#2D1B69] to-[#1a103f] py-24"
      id="features"
    >
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {/* 星星 */}
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size + "px",
              height: star.size + "px",
              left: star.x + "%",
              top: star.y + "%",
              filter: "blur(0.5px)",
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}

        {/* 星云效果 */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-96 w-96 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Platform Features
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-white/80">
            Innovative features designed to create meaningful connections
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              {/* Feature Card */}
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:transform hover:border-white/20 hover:bg-white/10">
                {/* Icon Container */}
                <motion.div
                  className="relative mb-8"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Icon Background Glow */}
                  <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-xl" />

                  {/* Icon Circle */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                    <div className="text-white transition-colors duration-300 group-hover:text-[#8B5CF6]">
                      {feature.icon}
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium uppercase tracking-wider text-white/60">
                      {feature.subtitle}
                    </h4>
                    <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-[#8B5CF6]">
                      {feature.title}
                    </h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>

                  {/* Feature Benefits */}
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-white/70">
                        <div className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#8B5CF6]" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Effects */}
                <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 transform bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] transition-transform duration-500 group-hover:scale-x-100" />

                {/* Card Glow Effect */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] opacity-0 blur transition-opacity duration-500 group-hover:opacity-20" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
