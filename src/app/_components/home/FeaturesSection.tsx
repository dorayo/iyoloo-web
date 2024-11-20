'use client'

import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Compass } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Smart Matching",
      subtitle: "Meet your destined one",
      description: "Multi-dimensional matching based on values and life planning",
      benefits: [
        "Personalized recommendations",
        "Deep interest matching",
        "Lifestyle compatibility",
        "Value alignment analysis"
      ],
      gradient: "from-purple-500/20 to-indigo-500/20",
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: "Deep Connection",
      subtitle: "Build genuine relationships",
      description: "From shared values to spiritual resonance",
      benefits: [
        "Cross-language communication",
        "Emotional interaction tools",
        "Privacy protection",
        "Multi-topic exploration"
      ],
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: <Compass className="w-12 h-12" />,
      title: "Future Co-creation",
      subtitle: "Co-create ideal life",
      description: "Respect mutual choices, realize life aspirations",
      benefits: [
        "Lifestyle planning",
        "Shared goal setting",
        "Growth trajectory tracking",
        "Vision blueprint creation"
      ],
      gradient: "from-violet-500/20 to-indigo-500/20",
    }
  ];

  const generateStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2
    }));
  };

  const stars = generateStars(50);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#2D1B69] to-[#1a103f]" id="features">
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {/* 星星 */}
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              left: star.x + '%',
              top: star.y + '%',
              filter: 'blur(0.5px)',
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
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translate(-50%, -50%)',
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Innovative features designed to create meaningful connections
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div className="relative h-full backdrop-blur-lg bg-white/5 rounded-2xl p-8 
                border border-white/10 overflow-hidden transition-all duration-300
                hover:bg-white/10 hover:border-white/20 hover:transform hover:-translate-y-1">
                
                {/* Icon Container */}
                <motion.div 
                  className="relative mb-8"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Icon Background Glow */}
                  <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-xl" />
                  
                  {/* Icon Circle */}
                  <div className="relative w-16 h-16 flex items-center justify-center 
                    bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                    <div className="text-white group-hover:text-[#8B5CF6] transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                      {feature.subtitle}
                    </h4>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#8B5CF6] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-white/70">
                      {feature.description}
                    </p>
                  </div>

                  {/* Feature Benefits */}
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Effects */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r 
                  from-[#8B5CF6] to-[#4F46E5] transform scale-x-0 group-hover:scale-x-100 
                  transition-transform duration-500" />
                
                {/* Card Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] 
                  rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;