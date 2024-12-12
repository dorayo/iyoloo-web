const LogoIcon = () => {
  return (
    <div className="w-9 h-9">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 外层渐变背景 */}
        <circle cx="20" cy="20" r="20" className="fill-[#2D1B69]" />
        
        {/* 内部渐变装饰环 */}
        <circle 
          cx="20" 
          cy="20" 
          r="16" 
          className="stroke-white/20" 
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        
        {/* 内部发光圆环 */}
        <circle 
          cx="20" 
          cy="20" 
          r="12" 
          className="stroke-white/30" 
          strokeWidth="0.5"
          filter="url(#glow)"
        />

        {/* i字母主体 - 更圆润的设计 */}
        <g className="fill-white">
          {/* 顶点 */}
          <circle cx="20" cy="13" r="1.5" />
          {/* 主体 */}
          <rect x="18.5" y="16" width="3" height="12" rx="1.5" />
        </g>

        {/* 装饰光点 */}
        <g className="fill-white" filter="url(#glow)">
          <circle cx="15" cy="20" r="0.5" className="animate-pulse opacity-60" />
          <circle cx="25" cy="20" r="0.5" className="animate-pulse opacity-60" />
          <circle cx="20" cy="25" r="0.5" className="animate-pulse opacity-60" />
        </g>

        {/* 滤镜定义 */}
        <defs>
          <filter id="glow" x="-2" y="-2" width="44" height="44">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default LogoIcon;