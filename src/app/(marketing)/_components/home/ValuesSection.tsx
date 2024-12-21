"use client";

import { motion } from "framer-motion";
import { Feather, Heart, TrendingUp } from "lucide-react";

const ValuesSection = () => {
  const values = [
    {
      icon: <Feather className="h-12 w-12" />,
      title: "Life Autonomy",
      subtitle: "Respect life choices",
      description: "Support diverse lifestyles and personal freedom",
    },
    {
      icon: <Heart className="h-12 w-12" />,
      title: "Emotional Connection",
      subtitle: "Meet your soulmate",
      description: "Build deep emotional bonds that last",
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: "Growing Together",
      subtitle: "Realize life ideals",
      description: "Create a meaningful life journey together",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className="relative overflow-hidden py-24" id="values">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B69] to-[#1a103f]" />

      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Our Core Values
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-white/80">
            Foundation of our commitment to your journey
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8"
        >
          {values.map((value, index) => (
            <motion.div key={index} variants={itemVariants} className="group">
              {/* Card Container */}
              <div className="relative h-full transform rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg transition-all duration-300 hover:translate-y-[-4px] hover:bg-white/10">
                {/* Glow Effect */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] opacity-0 blur transition-opacity duration-300 group-hover:opacity-20" />

                {/* Content Container */}
                <div className="relative flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <motion.div
                    className="relative mb-8"
                    whileHover={{
                      rotate: [-5, 5, 0],
                      scale: [1, 1.1, 1.05],
                      transition: { duration: 0.3 },
                    }}
                  >
                    {/* Icon Background */}
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-lg transition-all duration-300 group-hover:border-white/30">
                      <div className="text-white transition-colors duration-300 group-hover:text-[#8B5CF6]">
                        {value.icon}
                      </div>
                    </div>

                    {/* Animated Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#8B5CF6]/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0, 0.2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  {/* Text Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-[#8B5CF6]">
                      {value.title}
                    </h3>
                    <h4 className="text-lg font-medium text-[#8B5CF6]">
                      {value.subtitle}
                    </h4>
                    <p className="leading-relaxed text-white/70">
                      {value.description}
                    </p>
                  </div>

                  {/* Bottom Line */}
                  <div className="mt-6 h-1 w-0 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] transition-all duration-500 group-hover:w-20" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
