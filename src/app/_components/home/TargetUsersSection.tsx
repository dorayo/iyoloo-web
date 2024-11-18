'use client'

import { motion } from 'framer-motion';
import { Briefcase, Palette, Globe, Coffee } from 'lucide-react';

const TargetUsersSection = () => {
  const users = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Elite Professionals",
      subtitle: "Pursuing excellence in life",
      description: "Focused on career development, possessing financial strength and social status, seeking like-minded soulmates",
      gradient: "from-purple-900/90 to-indigo-900/90",
      pattern: "bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-from)_0%,_transparent_70%)]"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Creative Souls",
      subtitle: "Free-spirited life artists",
      description: "Pursuing freedom in lifestyle, valuing personal growth and emotional resonance, longing to meet kindred spirits",
      gradient: "from-pink-900/90 to-purple-900/90",
      pattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_70%)]"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Citizens",
      subtitle: "Cross-cultural world citizens",
      description: "Embracing cultural diversity with an international perspective, looking forward to building a borderless quality life",
      gradient: "from-indigo-900/90 to-blue-900/90",
      pattern: "bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-from)_0%,_transparent_70%)]"
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Mature Individuals",
      subtitle: "Wise life mentors",
      description: "Rich in experience, financially independent, clear about life goals, seeking like-minded life partners",
      gradient: "from-violet-900/90 to-indigo-900/90",
      pattern: "bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-from)_0%,_transparent_70%)]"
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
    <section className="relative py-24 bg-[#1a103f] overflow-hidden" id="users">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
          from-white/5 via-transparent to-transparent" />
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
            Find Your Community
          </h2>
          <p className="text-xl text-white/80">
            Connect with kindred spirits who share your vision
          </p>
        </motion.div>

        {/* User Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {users.map((user, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className={`relative h-full rounded-2xl overflow-hidden bg-gradient-to-br ${user.gradient}`}>
                {/* Pattern Background */}
                <div className={`absolute inset-0 ${user.pattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-8 h-full flex flex-col min-h-[320px]">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      {user.icon}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {user.title}
                    </h3>
                    <p className="text-white/80 font-medium mb-4">
                      {user.subtitle}
                    </p>
                    <p className="text-white/70 leading-relaxed">
                      {user.description}
                    </p>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TargetUsersSection;