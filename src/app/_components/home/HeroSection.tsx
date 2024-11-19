'use client'

import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a103f] to-[#2D1B69]">
      {/* 背景动态效果 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#8B5CF6]/10 via-transparent to-transparent animate-pulse-slow" />
        {Array.from({ length: 30 }, (_, i) => (
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

      {/* 核心心形动画 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-96 h-96">
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
              viewBox="-10 -10 120 120" // 扩大视口范围，防止裁剪
              className="w-64 h-64"
              style={{ filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))' }}
            >
              <defs>
                <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B95"> 
                    <animate
                      attributeName="stop-color"
                      values="#FF6B95; #FF89B1; #FF6B95"  // 粉色系渐变
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
                transform="translate(0, 0)" // 确保心形在视口中心
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
      </div>
      
      {/* 能量射线系统 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 外层能量场 */}
        <div className="absolute w-[120%] h-[120%] animate-spin-slow opacity-20">
          {Array.from({ length: 8 }, (_, i) => (
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

      {/* 翅膀动画 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute z-20 mx-auto w-[1200px] h-[800px]" // 增加整体尺寸
      >
        <svg
          viewBox="0 0 1200 800"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 左翼 */}
          <g filter="url(#wing-blur)">
            <motion.path
              d="M600 200
                C500 150 400 150 300 200
                C200 250 150 350 200 450
                C250 550 400 600 600 500
                C500 550 400 500 350 450
                C300 400 275 350 275 300
                C275 250 300 200 350 175
                C400 150 500 150 600 200
                Z"
              strokeWidth="0"
              stroke="url(#wing-gradient)"
              fill="url(#wing-gradient)"
              fillOpacity="0.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                d: [
                  // 收起状态
                  `M600 200
                  C500 150 400 150 300 200
                  C200 250 150 350 200 450
                  C250 550 400 600 600 500
                  C500 550 400 500 350 450
                  C300 400 275 350 275 300
                  C275 250 300 200 350 175
                  C400 150 500 150 600 200
                  Z`,
                  // 完全展开状态
                  `M600 200
                  C450 100 250 100 150 250
                  C50 400 100 600 250 650
                  C400 700 500 650 600 550
                  C500 650 350 600 300 550
                  C250 500 200 400 250 300
                  C300 200 400 150 450 150
                  C500 150 550 150 600 200
                  Z`,
                  // 收起状态
                  `M600 200
                  C500 150 400 150 300 200
                  C200 250 150 350 200 450
                  C250 550 400 600 600 500
                  C500 550 400 500 350 450
                  C300 400 275 350 275 300
                  C275 250 300 200 350 175
                  C400 150 500 150 600 200
                  Z`
                ]
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))'
              }}
            />
            
            {/* 左翼羽毛装饰 */}
            {Array.from({ length: 7 }, (_, i) => (
              <motion.path
                key={`left-feather-${i}`}
                d={`M${350 + i * 40} ${300 + i * 40} 
                  C${320 + i * 40} ${320 + i * 40} 
                    ${300 + i * 40} ${350 + i * 40} 
                    ${320 + i * 40} ${380 + i * 40}`}
                stroke="url(#wing-gradient)"
                strokeWidth="0"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  d: [
                    `M${350 + i * 40} ${300 + i * 40} 
                    C${320 + i * 40} ${320 + i * 40} 
                      ${300 + i * 40} ${350 + i * 40} 
                      ${320 + i * 40} ${380 + i * 40}`,
                    `M${300 + i * 40} ${250 + i * 40} 
                    C${270 + i * 40} ${270 + i * 40} 
                      ${250 + i * 40} ${300 + i * 40} 
                      ${270 + i * 40} ${330 + i * 40}`,
                    `M${350 + i * 40} ${300 + i * 40} 
                    C${320 + i * 40} ${320 + i * 40} 
                      ${300 + i * 40} ${350 + i * 40} 
                      ${320 + i * 40} ${380 + i * 40}`
                  ]
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </g>

          {/* 右翼 - 镜像翻转左翼的路径 */}
          <g filter="url(#wing-blur)">
            <motion.path
              d="M600 200
                C700 150 800 150 900 200
                C1000 250 1050 350 1000 450
                C950 550 800 600 600 500
                C700 550 800 500 850 450
                C900 400 925 350 925 300
                C925 250 900 200 850 175
                C800 150 700 150 600 200
                Z"
              strokeWidth="0"
              stroke="url(#wing-gradient)"
              fill="url(#wing-gradient)"
              fillOpacity="0.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                d: [
                  // 收起状态
                  `M600 200
                  C700 150 800 150 900 200
                  C1000 250 1050 350 1000 450
                  C950 550 800 600 600 500
                  C700 550 800 500 850 450
                  C900 400 925 350 925 300
                  C925 250 900 200 850 175
                  C800 150 700 150 600 200
                  Z`,
                  // 完全展开状态
                  `M600 200
                  C750 100 950 100 1050 250
                  C1150 400 1100 600 950 650
                  C800 700 700 650 600 550
                  C700 650 850 600 900 550
                  C950 500 1000 400 950 300
                  C900 200 800 150 750 150
                  C700 150 650 150 600 200
                  Z`,
                  // 收起状态
                  `M600 200
                  C700 150 800 150 900 200
                  C1000 250 1050 350 1000 450
                  C950 550 800 600 600 500
                  C700 550 800 500 850 450
                  C900 400 925 350 925 300
                  C925 250 900 200 850 175
                  C800 150 700 150 600 200
                  Z`
                ]
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))'
              }}
            />
            
            {/* 右翼羽毛装饰 */}
            {Array.from({ length: 7 }, (_, i) => (
              <motion.path
                key={`right-feather-${i}`}
                d={`M${850 - i * 40} ${300 + i * 40} 
                  C${880 - i * 40} ${320 + i * 40} 
                    ${900 - i * 40} ${350 + i * 40} 
                    ${880 - i * 40} ${380 + i * 40}`}
                stroke="url(#wing-gradient)"
                strokeWidth="0"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  d: [
                    `M${850 - i * 40} ${300 + i * 40} 
                    C${880 - i * 40} ${320 + i * 40} 
                      ${900 - i * 40} ${350 + i * 40} 
                      ${880 - i * 40} ${380 + i * 40}`,
                    `M${900 - i * 40} ${250 + i * 40} 
                    C${930 - i * 40} ${270 + i * 40} 
                      ${950 - i * 40} ${300 + i * 40} 
                      ${930 - i * 40} ${330 + i * 40}`,
                    `M${850 - i * 40} ${300 + i * 40} 
                    C${880 - i * 40} ${320 + i * 40} 
                      ${900 - i * 40} ${350 + i * 40} 
                      ${880 - i * 40} ${380 + i * 40}`
                  ]
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </g>

          {/* 渐变和模糊效果 */}
          <defs>
            <linearGradient
              id="wing-gradient"
              x1="0"
              y1="0"
              x2="800"
              y2="600"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFA3C4">
                <animate
                  attributeName="stop-color"
                  values="#FFA3C4; #FFFFFF; #FFA3C4" // 加入白色过渡，增加光芒感
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#B44AC0">
                <animate
                  attributeName="stop-color"
                  values="#B44AC0; #FF6B95; #B44AC0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <filter id="wing-blur">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
        </svg>
      </motion.div>

      {/* 主要内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 平台定位 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm
            text-white/90 text-lg md:text-xl font-medium">
            World's First Premium Social Platform for Single-by-Choice Community
          </span>
        </motion.div>
        {/* 文字内容 */}
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

export default HeroSection;