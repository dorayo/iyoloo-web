const LogoIcon = () => {
  return (
    <div className="w-10 h-10">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 外圈渐变 */}
        <circle 
          cx="20" 
          cy="20" 
          r="20" 
          className="fill-[#2D1B69]"
        />
        
        {/* 内圈装饰 */}
        <circle 
          cx="20" 
          cy="20" 
          r="16"
          className="stroke-white/10" 
          strokeWidth="0.5"
        />
        
        {/* i字母主体 */}
        <path
          d="M19 12h2v3h-2zM19 17h2v11h-2z"
          className="fill-white"
        />
        
        {/* 装饰光点 */}
        <circle 
          cx="20" 
          cy="20" 
          r="1"
          className="fill-white/30"
        />
      </svg>
    </div>
  );
};

export default LogoIcon;