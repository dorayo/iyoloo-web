'use client'

import { motion } from 'framer-motion';
import { Feather, Heart, TrendingUp } from 'lucide-react';

const ValuesSection = () => {
  const values = [
    {
      icon: <Feather className="w-12 h-12" />,
      title: "Life Autonomy",
      subtitle: "Respect life choices",
      description: "Support diverse lifestyles and personal freedom"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Emotional Connection",
      subtitle: "Meet your soulmate",
      description: "Build deep emotional bonds that last"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Growing Together",
      subtitle: "Realize life ideals",
      description: "Create a meaningful life journey together"
    }
  ];

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
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden" id="values">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B69]/5 to-transparent" />
      
      {/* Background Decoration */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="absolute w-64 h-64 bg-gradient-to-r from-[#8B5CF6]/5 to-[#4F46E5]/5 rounded-full blur-3xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Foundation of our commitment to your journey
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Container with Animation */}
              <div className="relative mb-8">
                {/* Background Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6]/20 to-[#4F46E5]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
                
                {/* Icon Circle */}
                <div className="relative w-24 h-24 flex items-center justify-center bg-white rounded-full shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-300">
                  <div className="text-[#2D1B69] group-hover:text-[#8B5CF6] transition-colors duration-300">
                    {value.icon}
                  </div>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#8B5CF6]/20 transition-all duration-300" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#2D1B69] transition-colors duration-300">
                  {value.title}
                </h3>
                <h4 className="text-lg font-medium text-[#8B5CF6]">
                  {value.subtitle}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>

              {/* Bottom Decorative Line */}
              <div className="h-1 w-0 group-hover:w-20 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] mt-6 transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;