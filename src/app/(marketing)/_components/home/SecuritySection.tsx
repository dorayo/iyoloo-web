'use client'

import { motion } from 'framer-motion';
import { Shield, Lock, Users } from 'lucide-react';

const SecuritySection = () => {
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

  const securities = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Privacy Protection",
      description: "Advanced encryption and privacy protection mechanisms",
      features: [
        {
          title: "Full Encryption Communication",
          description: "Military-grade encryption standards protecting every interaction"
        },
        {
          title: "Data Desensitization",
          description: "Multiple encryption layers for critical information"
        },
        {
          title: "Strict Information Protection",
          description: "Comprehensive information protection system"
        },
        {
          title: "Privacy Data Control",
          description: "Full control over your personal information visibility"
        }
      ],
      gradient: "from-[#8B5CF6]/20 to-[#4F46E5]/20"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security Mechanism",
      description: "Comprehensive platform security protection system",
      features: [
        {
          title: "Behavior Credit Assessment",
          description: "Multi-dimensional credit evaluation system"
        },
        {
          title: "Smart Risk Control",
          description: "24/7 intelligent monitoring for risk prevention"
        },
        {
          title: "Quick Complaint Response",
          description: "Professional team for timely issue resolution"
        },
        {
          title: "Strict Report Verification",
          description: "Rigorous report handling mechanism"
        }
      ],
      gradient: "from-[#4F46E5]/20 to-[#2D1B69]/20"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Protection",
      description: "Creating a warm and supportive community atmosphere",
      features: [
        {
          title: "Community Guidelines",
          description: "Promoting respectful and friendly interactions"
        },
        {
          title: "Misconduct Control",
          description: "Zero tolerance for inappropriate behavior"
        },
        {
          title: "Environment Maintenance",
          description: "Continuous optimization of community atmosphere"
        }
      ],
      gradient: "from-[#2D1B69]/20 to-[#8B5CF6]/20"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#2D1B69] to-[#1a103f] overflow-hidden" id="security">
      {/* 星空背景 */}
      <div className="absolute inset-0">
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
      </div>

      {/* 安全网格效果 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(139 92 246 / 0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              backgroundPosition: ['0px 0px', '30px 30px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
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
          <motion.div 
            className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Scanning Effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: [
                  'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 100%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <Shield className="w-8 h-8 text-white relative z-10" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Security Assurance
          </h2>
          <p className="text-xl text-white/80">
            Professional protection for worry-free connections
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {securities.map((security, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              {/* Card */}
              <div className="relative backdrop-blur-lg bg-white/5 rounded-2xl p-8 
                border border-white/10 overflow-hidden transition-all duration-300
                hover:bg-white/10 hover:border-white/20">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div 
                    className="p-3 backdrop-blur-sm bg-white/10 rounded-xl border border-white/20 text-white
                      relative overflow-hidden"
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, 5, -5, 0],
                    }}
                  >
                    {/* Glowing Background */}
                    <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-xl" />
                    <div className="relative">{security.icon}</div>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {security.title}
                    </h3>
                    <p className="text-white/70 mt-1">
                      {security.description}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-6">
                  {security.features.map((feature, idx) => (
                    <div key={idx} className="group/item">
                      <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-2.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-lg font-semibold text-white/90 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-white/70">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Data Flow Animation */}
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent"
                      style={{
                        top: `${30 + i * 20}%`,
                        left: '-100%',
                        right: '100%'
                      }}
                      animate={{
                        left: ['100%', '-100%'],
                        right: ['300%', '100%']
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>

                {/* Card Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] 
                  rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-white bg-white/5 backdrop-blur-sm 
            px-4 py-2 rounded-full border border-white/10">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Bank-level Security Protection</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecuritySection;