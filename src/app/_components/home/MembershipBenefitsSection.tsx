'use client'

import { motion } from 'framer-motion';
import { Crown, Shield } from 'lucide-react';

const MembershipSection = () => {
  const memberships = [
    {
      type: "SVIP",
      icon: <Crown className="w-12 h-12" />,
      gradient: "from-amber-500/90 to-yellow-500/90",
      shadowColor: "shadow-amber-500/20",
      highlights: [
        {
          title: "Priority Matching",
          description: "Get premium recommendations to increase your chances of meeting ideal partners"
        },
        {
          title: "Exclusive Lifestyle Consultant",
          description: "One-on-one consulting to help plan your ideal life blueprint"
        },
        {
          title: "High-end Private Events",
          description: "Exclusive access to elite social circles and premium events"
        },
        {
          title: "Professional Privacy Protection",
          description: "Advanced privacy solutions ensuring absolute security of personal information"
        }
      ]
    },
    {
      type: "VIP",
      icon: <Shield className="w-12 h-12" />,
      gradient: "from-zinc-400/90 to-slate-400/90",
      shadowColor: "shadow-slate-400/20",
      highlights: [
        {
          title: "Quality Match Recommendations",
          description: "Receive curated matches to enhance your social efficiency"
        },
        {
          title: "Deep Social Experience",
          description: "Advanced social features to build genuine connections"
        },
        {
          title: "Advanced Privacy Settings",
          description: "Enhanced privacy options to protect your personal information"
        },
        {
          title: "Premium Event Access",
          description: "Participate in selected social events to expand your network"
        }
      ]
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
    <section className="relative py-24 bg-gradient-to-b from-[#1a103f] to-[#2D1B69]" id="membership">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
          from-white/5 via-transparent to-transparent" />
        
        {/* Animated Light Beams */}
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: '0',
              right: '0',
              transformOrigin: 'center'
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.5, 0],
              x: ['-100%', '0%', '100%']
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Membership Benefits
          </h2>
          <p className="text-xl text-white/80">
            Premium services to enhance your journey
          </p>
        </motion.div>

        {/* Membership Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {memberships.map((membership, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 h-full 
                border border-white/20 hover:border-white/30 transition-all duration-500">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${membership.gradient} ${membership.shadowColor}`}>
                    <div className="text-white">
                      {membership.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {membership.type}
                    <span className="text-white/60 text-lg ml-2">Membership</span>
                  </h3>
                </div>

                {/* Benefits List */}
                <div className="space-y-6">
                  {membership.highlights.map((highlight, idx) => (
                    <div key={idx} className="group/item">
                      <h4 className="text-lg font-semibold text-white mb-2 
                        group-hover/item:text-white/90 transition-colors">
                        {highlight.title}
                      </h4>
                      <p className="text-white/70 group-hover/item:text-white/80 
                        transition-colors">
                        {highlight.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-2xl bg-white/0 
                  group-hover:bg-white/5 transition-colors duration-500" />
              </div>

              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${membership.gradient} 
                rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 text-lg font-medium text-white rounded-full 
            bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] 
            hover:opacity-90 transition-all duration-200 
            shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Explore Memberships
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default MembershipSection;