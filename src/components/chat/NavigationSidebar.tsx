'use client'

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { api } from "~/trpc/react";

const NavigationSidebar = ({
  onNavigationClick,
  activeBar,
}: {
  onNavigationClick: (index:number) => void;
  activeBar: number;
}) => {


  const { data: curUser } = api.user.getCurrentUser.useQuery();


  return(
    <nav className="w-[60px] bg-[#2D1B69] h-full flex flex-col items-center pt-4">
      <button className="mb-10">
        <Avatar className="w-10 h-10">
          <AvatarImage src={curUser?.avatar || "/images/606d18e1ed6ef79895bd45fd7d384401.png"} alt="Profile" />
        </Avatar>
      </button>
  
      <div className="space-y-8">
        {[
          { src: "/images/0eebba875fd583f387657faaca49de07.png", selSrc:'/images/6608b90272582d6184f2810c4fabd68e.png', alt: "Messages", },
          { src: "/images/e5f7a8dbdc5f1608ef8cf6ee1f71b1e8.png", selSrc:'/images/9b95ff039ed0bb2aee39c9bec48ea585.png',alt: "Notices", },
        ].map((icon, index) => (
          <button 
            key={index}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            onClick={()=>{onNavigationClick(index)}}
          >
            <img src={activeBar==index?icon.selSrc:icon.src} alt={icon.alt} className="w-6 h-6" />
          </button>
        ))}
      </div>
    </nav>
  );
}

export default NavigationSidebar;