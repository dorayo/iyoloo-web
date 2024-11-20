'use client'

import { motion } from 'framer-motion';

const StarSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white" opacity="0.8">
    <path d="M12 2L9 9H2L7.5 13.5L5.5 21L12 16.5L18.5 21L16.5 13.5L22 9H15L12 2Z" />
  </svg>
);

const HeroSection = () => {
  const generateStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      angle: Math.PI * (0.25 + Math.random() * 0.25) // 控制流星角度
    }));
  };

  const stars = generateStars(100);
  const shootingStars = generateStars(6);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a103f] to-[#2D1B69]">
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {/* 静态星星 */}
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              left: star.x + '%',
              top: star.y + '%',
              filter: 'blur(0.5px)', // 添加轻微模糊使其更柔和
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

        {/* 更新流星效果 */}
        {shootingStars.map((star, i) => {
          const angle = 35; // 固定一个下落角度，可以调整
          return (
            <motion.div
              key={`shooting-${i}`}
              className="absolute"
              style={{
                width: '2px',
                height: '2px',
                background: 'white',
                boxShadow: '0 0 3px 1px rgba(255, 255, 255, 0.5)',
                top: '-10%',
                left: star.x + '%'
              }}
              animate={{
                top: ['-10%', '120%'],
                left: [star.x + '%', `${star.x - 50}%`],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: star.delay * 3,
                ease: "linear"
              }}
            />
          );
        })}

        {/* 已有的星云效果 */}
        <div className="absolute inset-0 bg-[radial-gradient(...)]" />
      </div>

      {/* 核心内容区 */}
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20"> 
        {/* Platform Introduction - 新增部分 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-16"  // 调整与主标题的间距
        >
          <div className="inline-block px-6 py-3 rounded-full 
            bg-white/[0.03] backdrop-blur-md
            border border-white/10 shadow-2xl">
            <span className="text-white/90 text-lg tracking-wide">
              World's First Premium Social Platform for Single-by-Choice Community
            </span>
          </div>
        </motion.div>
        {/* 主标题区域 */}
        <div className="flex flex-col items-center justify-center gap-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-tight">
              You Only Live Once
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 tracking-wide">
              Define Life on Your Terms
            </h2>
          </motion.div>

          {/* 中心太阳光环 */}
          <motion.div
          className="absolute w-40 h-40 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          />

          {/* 核心心形动画 */}
          <div className="relative w-72 h-72">
            {/* 心形光环 */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg 
                viewBox="-10 -10 120 120"
                className="w-64 h-64"
                style={{ filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))' }}
              >
                <defs>
                  <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B95">
                      <animate
                        attributeName="stop-color"
                        values="#FF6B95; #FF89B1; #FF6B95"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop offset="100%" stopColor="#B44AC0">
                      <animate
                        attributeName="stop-color"
                        values="#B44AC0; #FF6B95; #B44AC0"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </stop>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M50 85 C25 65 0 50 0 25 C0 10 10 0 25 0 C35 0 45 10 50 20 C55 10 65 0 75 0 C90 0 100 10 100 25 C100 50 75 65 50 85Z"
                  fill="url(#heart-gradient)"
                  filter="url(#glow)"
                  className="animate-heartbeat"
                >
                  <animate
                    attributeName="d"
                    values="
                      M50 85 C25 65 0 50 0 25 C0 10 10 0 25 0 C35 0 45 10 50 20 C55 10 65 0 75 0 C90 0 100 10 100 25 C100 50 75 65 50 85Z;
                      M50 80 C25 60 0 45 0 20 C0 5 10 -5 25 -5 C35 -5 45 5 50 15 C55 5 65 -5 75 -5 C90 -5 100 5 100 20 C100 45 75 60 50 80Z;
                      M50 85 C25 65 0 50 0 25 C0 10 10 0 25 0 C35 0 45 10 50 20 C55 10 65 0 75 0 C90 0 100 10 100 25 C100 50 75 65 50 85Z"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </motion.div>

            {/* 能量光环 */}
            {Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  scale: 1 + i * 0.2,
                }}
                animate={{
                  scale: [1 + i * 0.2, 1.2 + i * 0.2, 1 + i * 0.2],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Start Now 按钮 */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
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
        </div>
      </div>

      {/* 能量射线系统 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 外层能量场 */}
        {/* <div className="absolute w-[120%] h-[120%] animate-spin-slow opacity-20">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-40 bg-gradient-to-t from-[#8B5CF6] to-transparent origin-bottom"
              style={{
                transform: `rotate(${i * 45}deg) translateX(-50%)`,
              }}
            />
          ))}
        </div> */}
        
        {/* 中层能量场 */}
        <div className="absolute w-[90%] h-[90%] animate-spin-reverse-slow opacity-15">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-0.5 h-32 bg-gradient-to-t from-[#4F46E5] to-transparent origin-bottom"
              style={{
                transform: `rotate(${i * 30}deg) translateX(-50%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 波浪过渡效果 */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[120px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            fill="#2D1B69"
          />
          <motion.path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 0.5, pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
            fill="#2D1B69"
            opacity="0.5"
          />
        </svg>
      </div>

    </section>
  );
};

export default HeroSection; 