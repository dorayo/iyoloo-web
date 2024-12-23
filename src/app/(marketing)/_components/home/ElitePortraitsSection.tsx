"use client";

import { motion } from "framer-motion";
import { Briefcase, Palette, Globe, Book, Target, Heart } from "lucide-react";

const ElitePortraitsSection = () => {
  const portraits = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      type: "Elite Professional",
      title: "Career Focused Achievers",
      traits: [
        {
          icon: <Target className="h-5 w-5" />,
          title: "Clear Life Goals",
          description: "Driven by personal and professional growth",
        },
        {
          icon: <Book className="h-5 w-5" />,
          title: "Continuous Learning",
          description: "Invested in self-development and knowledge",
        },
        {
          icon: <Heart className="h-5 w-5" />,
          title: "Emotional Intelligence",
          description: "Values deep, meaningful connections",
        },
      ],
      stats: [
        { label: "Career Focus", value: 95 },
        { label: "Independence", value: 90 },
        { label: "Life Balance", value: 85 },
      ],
      gradient: "from-purple-500/20 to-indigo-500/20",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      type: "Life Artist",
      title: "Creative Soul",
      traits: [
        {
          icon: <Target className="h-5 w-5" />,
          title: "Unique Lifestyle",
          description: "Crafts life according to personal values",
        },
        {
          icon: <Book className="h-5 w-5" />,
          title: "Rich Inner World",
          description: "Appreciates art, culture, and philosophy",
        },
        {
          icon: <Heart className="h-5 w-5" />,
          title: "Authentic Connection",
          description: "Seeks genuine emotional resonance",
        },
      ],
      stats: [
        { label: "Creativity", value: 95 },
        { label: "Freedom", value: 90 },
        { label: "Authenticity", value: 88 },
      ],
      gradient: "from-pink-500/20 to-purple-500/20",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      type: "Global Citizen",
      title: "World Explorer",
      traits: [
        {
          icon: <Target className="h-5 w-5" />,
          title: "Global Perspective",
          description: "Embraces diverse cultures and ideas",
        },
        {
          icon: <Book className="h-5 w-5" />,
          title: "Cross-cultural Wisdom",
          description: "Rich in international experience",
        },
        {
          icon: <Heart className="h-5 w-5" />,
          title: "Open Mindset",
          description: "Welcomes diverse relationships",
        },
      ],
      stats: [
        { label: "Openness", value: 92 },
        { label: "Adaptability", value: 88 },
        { label: "Cultural IQ", value: 90 },
      ],
      gradient: "from-indigo-500/20 to-blue-500/20",
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
      className="relative overflow-hidden bg-gradient-to-b from-[#1a103f] to-[#2D1B69] py-24"
      id="elite"
    >
      {/* 星空背景 */}
      <div className="absolute inset-0">
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
            Elite Portraits
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-white/80">
            Discover your resonating community of like-minded individuals
          </p>
        </motion.div>

        {/* Portraits Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {portraits.map((portrait, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              {/* Portrait Card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                {/* Header */}
                <div className="mb-8 flex items-center space-x-4">
                  <motion.div
                    className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm"
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, 5, -5, 0],
                    }}
                  >
                    {portrait.icon}
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-medium uppercase tracking-wider text-white/60">
                      {portrait.type}
                    </h4>
                    <h3 className="text-xl font-bold text-white">
                      {portrait.title}
                    </h3>
                  </div>
                </div>

                {/* Traits */}
                <div className="mb-8 space-y-6">
                  {portrait.traits.map((trait, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="rounded-lg bg-white/10 p-2 text-white">
                        {trait.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {trait.title}
                        </h4>
                        <p className="text-sm text-white/70">
                          {trait.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  {portrait.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="mb-1 flex justify-between text-sm text-white/80">
                        <span>{stat.label}</span>
                        <span>{stat.value}%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hover Effects */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {/* Connection Lines */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{ top: `${20 + i * 15}%` }}
                      animate={{
                        opacity: [0, 1, 0],
                        scaleX: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>

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

export default ElitePortraitsSection;
