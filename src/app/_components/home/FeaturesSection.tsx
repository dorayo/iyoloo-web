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
      hoverGradient: "from-purple-500/30 to-indigo-500/30"
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
      hoverGradient: "from-blue-500/30 to-cyan-500/30"
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
      hoverGradient: "from-violet-500/30 to-indigo-500/30"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
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
    <section className="relative py-24 bg-white overflow-hidden" id="features">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
          from-[#2D1B69]/5 via-transparent to-transparent" />
        
        {/* Geometric Patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <svg
              key={i}
              className="absolute text-[#8B5CF6]/5"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              width="400"
              height="400"
              viewBox="0 0 100 100"
              fill="none"
            >
              <motion.path
                d="M50 10 L90 50 L50 90 L10 50 Z"
                stroke="currentColor"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.5
                }}
              />
            </svg>
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Innovative features designed to create meaningful connections
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Feature Card */}
              <div className={`relative rounded-2xl p-8 h-full bg-gradient-to-br ${feature.gradient} 
                group-hover:bg-gradient-to-br ${feature.hoverGradient} transition-all duration-500`}>
                {/* Icon Container */}
                <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-md mb-6">
                  <div className="text-[#2D1B69]">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                      {feature.subtitle}
                    </h4>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>

                  {/* Feature Benefits */}
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2D1B69] mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Lines Animation */}
                <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent 
                  transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="absolute inset-y-8 right-0 w-px bg-gradient-to-b from-transparent via-[#8B5CF6]/20 to-transparent 
                  transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700" />
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] 
                rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;