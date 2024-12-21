"use client";

import { motion } from "framer-motion";
import { Crown, Shield, Star, Check, Sparkles } from "lucide-react";

const MembershipSection = () => {
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

  const memberships = [
    {
      type: "SVIP",
      tag: "Ultimate Exclusivity",
      icon: <Crown className="h-12 w-12" />,
      gradientText:
        "bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-transparent bg-clip-text",
      gradient: "from-amber-400/90 via-yellow-300/90 to-amber-400/90",
      borderGradient: "from-amber-300 via-yellow-200 to-amber-300",
      iconGradient: "from-amber-300 to-yellow-400",
      highlights: [
        {
          icon: <Star className="h-5 w-5" />,
          title: "Elite Priority Matching",
          description:
            "Advanced AI-powered recommendations with highest priority",
        },
        {
          icon: <Crown className="h-5 w-5" />,
          title: "Personal Lifestyle Consultant",
          description:
            "24/7 dedicated consultant for life planning and social networking",
        },
        {
          icon: <Sparkles className="h-5 w-5" />,
          title: "Exclusive Private Events",
          description:
            "VIP access to ultra-exclusive social gatherings and luxury events",
        },
        {
          icon: <Shield className="h-5 w-5" />,
          title: "Premium Privacy System",
          description:
            "Military-grade privacy protection with custom security settings",
        },
      ],
      benefits: [
        "Unlimited profile visibility",
        "Priority customer service",
        "Advanced matching algorithms",
        "Exclusive event invitations",
        "Custom privacy settings",
      ],
    },
    {
      type: "VIP",
      tag: "Premium Experience",
      icon: <Shield className="h-12 w-12" />,
      gradientText:
        "bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-200 text-transparent bg-clip-text",
      gradient: "from-slate-400/90 via-zinc-300/90 to-slate-400/90",
      borderGradient: "from-slate-300 via-zinc-200 to-slate-300",
      iconGradient: "from-slate-300 to-zinc-400",
      highlights: [
        {
          icon: <Star className="h-5 w-5" />,
          title: "Smart Match Recommendations",
          description: "Enhanced matching system with curated suggestions",
        },
        {
          icon: <Crown className="h-5 w-5" />,
          title: "Premium Social Features",
          description: "Advanced communication and interaction tools",
        },
        {
          icon: <Sparkles className="h-5 w-5" />,
          title: "Quality Events Access",
          description: "Regular invitations to premium social events",
        },
        {
          icon: <Shield className="h-5 w-5" />,
          title: "Enhanced Privacy",
          description: "Advanced privacy controls and protection measures",
        },
      ],
      benefits: [
        "Extended profile visibility",
        "Priority support",
        "Enhanced matching",
        "Event access",
        "Privacy controls",
      ],
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#1a103f] to-[#2D1B69] py-32"
      id="membership"
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

      {/* 动态光效 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-96 w-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: "translate(-50%, -50%)",
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <motion.div
            className="mb-4 inline-flex items-center justify-center rounded-full bg-white/5 p-4 backdrop-blur-sm"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Crown className="h-8 w-8 text-amber-300" />
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Exclusive Memberships
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-white/80">
            Choose your path to premium experiences and meaningful connections
          </p>
        </motion.div>

        {/* Membership Cards */}
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
          {memberships.map((membership, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`group w-full ${membership.type === "SVIP" ? "md:w-[450px]" : "md:w-[400px]"}`}
            >
              {/* Card */}
              <motion.div
                whileHover={{
                  translateY: -8,
                  transition: { duration: 0.3 },
                }}
                className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                {/* Membership Type Badge */}
                <div className="absolute right-6 top-6">
                  <div
                    className={`rounded-full bg-gradient-to-r px-4 py-1.5 ${membership.gradient} text-sm font-semibold text-white shadow-lg`}
                  >
                    {membership.type}
                  </div>
                </div>

                {/* Header */}
                <div className="mb-8 flex items-center space-x-4">
                  <motion.div
                    className={`rounded-2xl bg-gradient-to-r p-4 ${membership.iconGradient}`}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, 10, -10, 0],
                    }}
                  >
                    <div className="text-white">{membership.icon}</div>
                  </motion.div>
                  <div>
                    <p className="mb-1 text-sm uppercase tracking-wider text-white/60">
                      {membership.tag}
                    </p>
                    <h3
                      className={`text-2xl font-bold ${membership.gradientText}`}
                    >
                      {membership.type} Membership
                    </h3>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-8 space-y-6">
                  {membership.highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      className="group/item flex items-start space-x-3"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`rounded-lg bg-gradient-to-r p-2 ${membership.gradient} opacity-80 transition-opacity group-hover/item:opacity-100`}
                      >
                        {highlight.icon}
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-white">
                          {highlight.title}
                        </h4>
                        <p className="text-sm text-white/70">
                          {highlight.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Benefits List */}
                <div className="space-y-3">
                  {membership.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-white/80"
                    >
                      <Check className="h-4 w-4" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <motion.button
                  className={`mt-8 w-full rounded-xl bg-gradient-to-r px-6 py-4 ${membership.gradient} font-semibold text-white shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Choose {membership.type}
                </motion.button>

                {/* Decorative Elements */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute h-[1px] w-full bg-gradient-to-r ${membership.borderGradient}`}
                      style={{ top: `${30 + i * 30}%` }}
                      animate={{
                        opacity: [0, 0.5, 0],
                        scaleX: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>

                {/* Card Glow */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${membership.borderGradient} rounded-2xl opacity-0 blur transition-opacity duration-500 group-hover:opacity-20`}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
