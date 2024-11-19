'use client'

import React from 'react';
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const PhilosophySection = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-[#2D1B69] to-[#4F46E5] py-24">
      <div className="container mx-auto px-4">
        {/* Quote Card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-16"
        >
          <Quote className="w-12 h-12 mb-4 text-[#8B5CF6]" />
          <blockquote className="text-2xl font-light italic mb-4 text-white">
            "True happiness comes from making authentic choices, not from meeting others' expectations."
          </blockquote>
          <p className="text-right text-sm text-white">— Simone de Beauvoir</p>
        </motion.div>

        {/* Theory Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 h-full"
          >
            <h3 className="text-xl font-semibold mb-4 text-white">The Essence of Intimate Relationships</h3>
            <p className="text-white/90">
              The foundation of intimate relationships lies in mutual trust, authenticity, and voluntary commitment. The greatest pain in relationships often stems not from their ending, but from betrayal and deception. This is because the violation of emotional commitments damages the core foundation of feelings - sincerity and trust.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 h-full"
          >
            <h3 className="text-xl font-semibold mb-4 text-white">Beyond Traditional Contracts</h3>
            <p className="text-white/90">
              While traditional marriage often functions as a "business contract" involving property, legal obligations, and social expectations, non-marriage families foster relationships based on pure emotional needs. This structure encourages more open communication and mutual understanding, free from contractual anxieties, allowing for more authentic and pure emotional connections.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;