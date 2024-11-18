'use client'

import { motion } from 'framer-motion';
import { Shield, Heart, Star } from 'lucide-react';

const CTASection = () => {
  const trustFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      text: "Strict Privacy Protection"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      text: "Genuine Community"
    },
    {
      icon: <Star className="w-6 h-6" />,
      text: "Premium Membership"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#1a103f] to-[#2D1B69] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
          from-white/10 via-transparent to-transparent" />
        
        {/* Animated Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Energy Lines */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ top: `${20 + i * 15}%` }}
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12"
        >
          {/* Main Headlines */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Start Your Ideal Lifestyle
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white/90">
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
                  staggerChildren: 0.2
                }
              }
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
                  show: { opacity: 1, y: 0 }
                }}
                className="flex items-center space-x-2 text-white/80"
              >
                <div className="text-white/90">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="group relative px-8 py-4 text-lg font-medium text-white rounded-full 
              bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] 
              hover:opacity-90 transition-all duration-300
              transform hover:-translate-y-1">
              {/* Button Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] 
                rounded-full opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300" />
              
              {/* Button Content */}
              <div className="relative flex items-center justify-center space-x-2">
                <span>Start Exploring</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
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
            className="text-white/60 text-sm"
          >
            Strict privacy protection and community management
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;