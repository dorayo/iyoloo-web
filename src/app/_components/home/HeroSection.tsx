'use client'

import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a103f] to-[#2D1B69]">
      {/* 背景动态效果 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#8B5CF6]/10 via-transparent to-transparent animate-pulse-slow" />
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/30 rounded-full"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s linear infinite ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* 能量光环系统 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 外层能量场 */}
        <div className="absolute w-[120%] h-[120%] animate-spin-slow opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-40 bg-gradient-to-t from-[#8B5CF6] to-transparent origin-bottom"
              style={{
                transform: `rotate(${i * 45}deg) translateX(-50%)`,
              }}
            />
          ))}
        </div>
        
        {/* 中层能量场 */}
        <div className="absolute w-[90%] h-[90%] animate-spin-reverse-slow opacity-40">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-0.5 h-32 bg-gradient-to-t from-[#4F46E5] to-transparent origin-bottom"
              style={{
                transform: `rotate(${i * 30}deg) translateX(-50%)`,
              }}
            />
          ))}
        </div>

        {/* 核心能量球 */}
        <div className="relative w-96 h-96">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6]/40 to-[#4F46E5]/40 animate-pulse-fast" />
          <div className="absolute inset-[15%] rounded-full bg-gradient-to-r from-[#8B5CF6]/30 to-[#4F46E5]/30 animate-pulse" />
          <div className="absolute inset-[30%] rounded-full bg-gradient-to-r from-[#8B5CF6]/20 to-[#4F46E5]/20 animate-pulse-slow" />
        </div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 翅膀动画 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto w-96 h-96 mb-12 relative"
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 左翼 */}
            <motion.path
              d="M200 100 C150 120 100 180 100 250 C100 320 150 350 200 350"
              stroke="url(#wing-gradient)"
              strokeWidth="4"
              fill="url(#wing-gradient)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                d: [
                  "M200 100 C150 120 100 180 100 250 C100 320 150 350 200 350",
                  "M200 100 C100 120 50 180 50 250 C50 320 100 350 200 350",
                  "M200 100 C150 120 100 180 100 250 C100 320 150 350 200 350"
                ]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            {/* 右翼 */}
            <motion.path
              d="M200 100 C250 120 300 180 300 250 C300 320 250 350 200 350"
              stroke="url(#wing-gradient)"
              strokeWidth="4"
              fill="url(#wing-gradient)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                d: [
                  "M200 100 C250 120 300 180 300 250 C300 320 250 350 200 350",
                  "M200 100 C300 120 350 180 350 250 C350 320 300 350 200 350",
                  "M200 100 C250 120 300 180 300 250 C300 320 250 350 200 350"
                ]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            {/* 渐变定义 */}
            <defs>
              <linearGradient
                id="wing-gradient"
                x1="0"
                y1="0"
                x2="400"
                y2="400"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#8B5CF6">
                  <animate
                    attributeName="stop-color"
                    values="#8B5CF6; #4F46E5; #8B5CF6"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#4F46E5">
                  <animate
                    attributeName="stop-color"
                    values="#4F46E5; #8B5CF6; #4F46E5"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* 文字内容部分保持不变 */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              Because You Only Live Once
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 tracking-wide">
              Define Life on Your Terms
            </h2>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-8 mt-12"
          >
            <div className="space-y-2">
              <p className="text-xl md:text-2xl text-white/90">Meet Your Soulmate</p>
              <p className="text-xl md:text-2xl text-white/90">Create Your Ideal Life</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 text-lg font-medium text-white rounded-full 
                bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] 
                hover:opacity-90 transition-all duration-200 
                shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 
                transition-colors duration-200" />
              <span className="relative z-10">Start Now</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// 添加自定义动画
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0);
      opacity: 0;
    }
    50% {
      transform: translate(-20px, -20px);
      opacity: 1;
    }
  }
  
  @keyframes pulse-fast {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.05); opacity: 0.6; }
  }
  
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.02); opacity: 0.4; }
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin-reverse-slow {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }

  .animate-spin-reverse-slow {
    animation: spin-reverse-slow 15s linear infinite;
  }

  .animate-pulse-fast {
    animation: pulse-fast 2s infinite;
  }

  .animate-pulse-slow {
    animation: pulse-slow 4s infinite;
  }
`;
document.head.appendChild(style);

export default HeroSection;