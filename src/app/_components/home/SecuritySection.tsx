'use client'

import { motion } from 'framer-motion';
import { Shield, Lock, Users } from 'lucide-react';

const SecuritySection = () => {
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
      gradient: "from-emerald-500/20 to-teal-500/20"
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
      gradient: "from-blue-500/20 to-indigo-500/20"
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
      gradient: "from-violet-500/20 to-purple-500/20"
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
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="relative py-24 bg-white" id="security">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
          from-[#2D1B69]/5 via-transparent to-transparent" />
        
        {/* Security Grid Pattern */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(139 92 246 / 0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
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
            className="inline-flex items-center justify-center p-2 rounded-full bg-[#2D1B69]/5 mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Shield className="w-8 h-8 text-[#2D1B69]" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Security Assurance
          </h2>
          <p className="text-xl text-gray-600">
            Professional protection for worry-free connections
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {securities.map((security, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Card */}
              <div className={`relative rounded-2xl p-8 h-full bg-gradient-to-br ${security.gradient}
                hover:bg-opacity-75 transition-all duration-500`}>
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-white rounded-xl shadow-md text-[#2D1B69]">
                    {security.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {security.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {security.description}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-6">
                  {security.features.map((feature, idx) => (
                    <div key={idx} className="group/item">
                      <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2D1B69] mt-2.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-white/0 
                  group-hover:bg-white/20 transition-colors duration-500" />
                
                {/* Security Lines Animation */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-px bg-[#2D1B69]/10"
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
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] 
                rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-[#2D1B69] bg-[#2D1B69]/5 px-4 py-2 rounded-full">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Bank-level Security Protection</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecuritySection;