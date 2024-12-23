"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Heart, Lock, Sparkles } from "lucide-react";

const PhilosophySection = () => {
  const concepts = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Trust & Authenticity",
      description:
        "The foundation of intimate relationships lies in mutual trust and authenticity. True connections thrive on genuine emotional bonds.",
      gradient: "from-pink-500/90 to-purple-500/90",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Beyond Traditional Bonds",
      description:
        "Free from conventional constraints, non-marriage relationships focus on pure emotional connections and mutual growth.",
      gradient: "from-purple-500/90 to-indigo-500/90",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Pure Connection",
      description:
        "When relationships are built on choice rather than obligation, they foster deeper understanding and more authentic interactions.",
      gradient: "from-indigo-500/90 to-blue-500/90",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-[#2D1B69] py-24"
      id="philosophy"
    >
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-20 px-4">
        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <div className="relative rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
            <Quote className="absolute -left-6 -top-6 h-12 w-12 text-[#8B5CF6]" />
            <blockquote className="mb-4 text-center text-2xl font-light italic text-white md:text-3xl">
              &quot;True happiness comes from making authentic choices, not from
              meeting others&#39; expectations.&quot;
            </blockquote>
            <p className="text-right text-lg text-white/80">
              — Simone de Beauvoir
            </p>
          </div>
        </motion.div>

        {/* Concept Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
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
              <div
                className={`h-full rounded-2xl bg-gradient-to-br p-8 ${concept.gradient}`}
              >
                <div className="mb-6 text-white">{concept.icon}</div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  {concept.title}
                </h3>
                <p className="text-white/90">{concept.description}</p>
              </div>
              {/* Hover glow effect */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] opacity-0 blur transition-opacity duration-500 group-hover:opacity-20" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
