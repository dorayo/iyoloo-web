'use client'

import { motion } from 'framer-motion';

const HeroSection = () => {
  // 翅膀动画变体
  const wingVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut",
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a103f] to-[#2D1B69]">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-30">
        {/* 光点装饰 - 使用多个点创造深度感 */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 2}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* 能量光环 - 多层次重叠效果 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[1000px] h-[1000px]">
          {/* 外层光环 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6]/10 to-[#4F46E5]/10 animate-pulse-slow" />
          {/* 中层光环 */}
          <div className="absolute inset-[10%] rounded-full bg-gradient-to-r from-[#8B5CF6]/15 to-[#4F46E5]/15 animate-pulse-slower" />
          {/* 内层光环 */}
          <div className="absolute inset-[20%] rounded-full bg-gradient-to-r from-[#8B5CF6]/20 to-[#4F46E5]/20 animate-pulse" />
        </div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 翅膀SVG - 优化的动画效果 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto w-80 h-80 mb-12 relative"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M100 20C60 40 40 80 40 120C40 160 60 180 100 180C140 180 160 160 160 120C160 80 140 40 100 20Z"
              variants={wingVariants}
              initial="initial"
              animate="animate"
              stroke="url(#wing-gradient)"
              strokeWidth="2"
              fill="url(#wing-gradient)"
              className="drop-shadow-lg"
            />
            <defs>
              <linearGradient
                id="wing-gradient"
                x1="0"
                y1="0"
                x2="200"
                y2="200"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* 文字内容 */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          {/* 英文标题 */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              Because You Only Live Once
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 tracking-wide">
              Define Life on Your Terms
            </h2>
          </div>

          {/* 引导文案和按钮 */}
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
              {/* 按钮内发光效果 */}
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 
                transition-colors duration-200" />
              <span className="relative z-10">Start Now</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* 渐变遮罩 - 增加层次感 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a103f] via-transparent to-transparent opacity-50" />
    </section>
  );
};

// 添加自定义动画关键帧
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.05); opacity: 0.5; }
  }
  
  @keyframes pulse-slower {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.08); opacity: 0.6; }
  }
`;
document.head.appendChild(style);

export default HeroSection;