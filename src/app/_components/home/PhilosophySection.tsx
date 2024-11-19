'use client'

import React from 'react';
import { motion } from "framer-motion";
import { Quote, Heart, Lock, Sparkles } from "lucide-react";

const PhilosophySection = () => {
  const concepts = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Trust & Authenticity",
      description: "The foundation of intimate relationships lies in mutual trust and authenticity. True connections thrive on genuine emotional bonds.",
      gradient: "from-pink-500/90 to-purple-500/90",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Beyond Traditional Bonds",
      description: "Free from conventional constraints, non-marriage relationships focus on pure emotional connections and mutual growth.",
      gradient: "from-purple-500/90 to-indigo-500/90",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Pure Connection",
      description: "When relationships are built on choice rather than obligation, they foster deeper understanding and more authentic interactions.",
      gradient: "from-indigo-500/90 to-blue-500/90",
    }
  ];

  return (
    <section className="relative py-24 bg-[#2D1B69] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 space-y-20">
        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <Quote className="absolute -top-6 -left-6 w-12 h-12 text-[#8B5CF6]" />
            <blockquote className="text-2xl md:text-3xl font-light italic text-white text-center mb-4">
            &quot;True happiness comes from making authentic choices, not from meeting others&#39; expectations.&quot;
            </blockquote>
            <p className="text-right text-lg text-white/80">— Simone de Beauvoir</p>
          </div>
        </motion.div>

        {/* Concept Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {concepts.map((concept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative"
            >
              <div className={`h-full rounded-2xl p-8 bg-gradient-to-br ${concept.gradient}`}>
                <div className="mb-6 text-white">{concept.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{concept.title}</h3>
                <p className="text-white/90">{concept.description}</p>
              </div>
              {/* Hover glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;