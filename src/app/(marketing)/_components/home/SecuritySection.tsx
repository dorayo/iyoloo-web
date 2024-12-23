"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Users } from "lucide-react";

const SecuritySection = () => {
  const generateStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
  };

  const stars = generateStars(50);

  const securities = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Privacy Protection",
      description: "Advanced encryption and privacy protection mechanisms",
      features: [
        {
          title: "Full Encryption Communication",
          description:
            "Military-grade encryption standards protecting every interaction",
        },
        {
          title: "Data Desensitization",
          description: "Multiple encryption layers for critical information",
        },
        {
          title: "Strict Information Protection",
          description: "Comprehensive information protection system",
        },
        {
          title: "Privacy Data Control",
          description: "Full control over your personal information visibility",
        },
      ],
      gradient: "from-[#8B5CF6]/20 to-[#4F46E5]/20",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security Mechanism",
      description: "Comprehensive platform security protection system",
      features: [
        {
          title: "Behavior Credit Assessment",
          description: "Multi-dimensional credit evaluation system",
        },
        {
          title: "Smart Risk Control",
          description: "24/7 intelligent monitoring for risk prevention",
        },
        {
          title: "Quick Complaint Response",
          description: "Professional team for timely issue resolution",
        },
        {
          title: "Strict Report Verification",
          description: "Rigorous report handling mechanism",
        },
      ],
      gradient: "from-[#4F46E5]/20 to-[#2D1B69]/20",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Protection",
      description: "Creating a warm and supportive community atmosphere",
      features: [
        {
          title: "Community Guidelines",
          description: "Promoting respectful and friendly interactions",
        },
        {
          title: "Misconduct Control",
          description: "Zero tolerance for inappropriate behavior",
        },
        {
          title: "Environment Maintenance",
          description: "Continuous optimization of community atmosphere",
        },
      ],
      gradient: "from-[#2D1B69]/20 to-[#8B5CF6]/20",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#2D1B69] to-[#1a103f] py-24"
      id="security"
    >
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size + "px",
              height: star.size + "px",
              left: star.x + "%",
              top: star.y + "%",
              filter: "blur(0.5px)",
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
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(139 92 246 / 0.1) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        >
          <motion.div
            className="h-full w-full"
            animate={{
              backgroundPosition: ["0px 0px", "30px 30px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            className="relative mb-4 inline-flex items-center justify-center rounded-full bg-white/5 p-4 backdrop-blur-sm"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Scanning Effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: [
                  "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 100%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Shield className="relative z-10 h-8 w-8 text-white" />
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Security Assurance
          </h2>
          <p className="text-xl text-white/80">
            Professional protection for worry-free connections
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                {/* Header */}
                <div className="mb-6 flex items-center space-x-4">
                  <motion.div
                    className="relative overflow-hidden rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm"
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
                    <p className="mt-1 text-white/70">{security.description}</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-6">
                  {security.features.map((feature, idx) => (
                    <div key={idx} className="group/item">
                      <div className="flex items-start space-x-3">
                        <div className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#8B5CF6]" />
                        <div>
                          <h4 className="mb-1 text-lg font-semibold text-white/90">
                            {feature.title}
                          </h4>
                          <p className="text-white/70">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Data Flow Animation */}
                <div className="absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent"
                      style={{
                        top: `${30 + i * 20}%`,
                        left: "-100%",
                        right: "100%",
                      }}
                      animate={{
                        left: ["100%", "-100%"],
                        right: ["300%", "100%"],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>

                {/* Card Glow Effect */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] opacity-0 blur transition-opacity duration-500 group-hover:opacity-20" />
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
          <div className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white backdrop-blur-sm">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">
              Bank-level Security Protection
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecuritySection;
