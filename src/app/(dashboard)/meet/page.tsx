'use client'
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

import { api } from "~/trpc/react";

import { useToast } from "@/hooks/use-toast"








// 匹配状态枚举
enum MatchStatus {
  IDLE = 'idle',         // 初始状态
  MATCHING = 'matching', // 匹配中
  SUCCESS = 'success',   // 匹配成功
  EXHAUSTED = 'exhausted', // 次数用完
  NO_VIP = 'no_vip'     // 未开通VIP
}

// 模糊图片组件
const BlurredImage = ({ src, className = "" }: { src: string, className?: string }) => (
  <div className={`w-[230px] flex rounded-lg overflow-hidden m-[4.5px] ${className}`}>
    <img
      src={src}
      alt=""
      className="w-full h-auto object-cover blur-[5px]"
    />
  </div>
);

// 添加一个头像组件
const MatchAvatar = ({ src, className = "" }: { src: string; className?: string }) => (
  <div className={`w-24 h-24 rounded-full border-2 border-white overflow-hidden ${className}`}>
    <img src={src} alt="avatar" className="w-full h-full object-cover" />
  </div>
);

// 匹配面板组件
const MatchPanel = ({ 
  status, 
  remainingCount,
  matchTimer,
  matchedUser,
  currentUserAvatar,
  onMatch,
  onContinue,
  onViewProfile,
  onBackHome,
  onUpgradeVip
}: {
  status: MatchStatus;
  remainingCount: number;
  matchTimer: number;
  matchedUser: any;
  currentUserAvatar: string;
  onMatch: () => void;
  onContinue: () => void;
  onViewProfile: () => void;
  onBackHome: () => void;
  onUpgradeVip: () => void;
}) => {
  const renderContent = () => {
    switch (status) {
      case MatchStatus.MATCHING:
        return (
          <>
            <h2 className="text-3xl text-white font-normal text-center mb-4">
              请稍等...
            </h2>
            <Button
              variant="default" 
              className="w-[264px] h-[56px] bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-xl font-bold mb-4"
              disabled
            >
              匹配中（{matchTimer}s）
            </Button>
            <h3 className="text-3xl text-white font-normal text-center">
              AI智能匹配中
            </h3>
          </>
        );
        
      case MatchStatus.SUCCESS:
        return (
          <>
            <h2 className="text-3xl text-white font-normal text-center mb-4">
              匹配成功
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <MatchAvatar 
                src={currentUserAvatar || '/images/606d18e1ed6ef79895bd45fd7d384401.png'} 
              />
              <MatchAvatar 
                src={matchedUser?.avatar || '/images/606d18e1ed6ef79895bd45fd7d384401.png'} 
              />
            </div>
            <Button
              onClick={onViewProfile}
              className="w-[264px] h-[56px] bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-xl font-bold mb-4"
            >
              进入主页
            </Button>
            <Button
              onClick={onContinue}
              className="w-[264px] h-[56px] bg-white/30 rounded-full text-xl font-bold mb-4"
            >
              继续匹配
            </Button>
            <Button
              onClick={onBackHome}
              variant="ghost"
              className="text-xl text-white font-normal"
            >
              返回首页
            </Button>
          </>
        );
        
      case MatchStatus.EXHAUSTED:
        return (
          <>
            <h2 className="text-3xl text-white font-normal text-center mb-4">
              请明天继续
            </h2>
            <h3 className="text-3xl text-white font-normal text-center mb-8">
              今日匹配次数用完
            </h3>
            <Button
              className="w-[264px] h-[56px] bg-white/30 rounded-full text-xl font-bold mb-4"
              disabled
            >
              开始匹配
            </Button>
          </>
        );

      case MatchStatus.NO_VIP:
        return (
          <>
            <h2 className="text-3xl text-white font-normal text-center mb-4">
              AI智能测算
            </h2>
            <Button
              onClick={onUpgradeVip}
              className="w-[375px] h-[56px] bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-xl font-bold mb-4"
            >
              加入SVIP获取匹配次数
            </Button>
            <h3 className="text-3xl text-white font-normal text-center">
              遇到与你匹配的那个人
            </h3>
          </>
        );
        
      default:
        return (
          <>
            <h2 className="text-3xl text-white font-normal text-center mb-4">
              AI智能测算
            </h2>
            <Button
              onClick={onMatch}
              className="w-[264px] h-[56px] bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-xl font-bold mb-4"
            >
              开始匹配
            </Button>
            <h3 className="text-3xl text-white font-normal text-center">
              遇到与你匹配的那个人
            </h3>
          </>
        );
    }
  };

  return (
    <Card className="absolute left-1/2 top-[189px] -translate-x-1/2 w-[684px] bg-transparent bg-gradient-to-b from-[rgb(30,18,71)] to-[rgba(30,18,71,0.8)] border border-white/20 shadow-lg shadow-white/25 z-10">
      <div className="py-16 px-8 text-center">
        <div className="relative w-[474px] mx-auto">
          <div className="bg-[url('/match-bg.png')] bg-cover bg-center p-20 mb-4 flex flex-col items-center">
            {renderContent()}
          </div>
          
          <div className="text-center text-white mt-8">
            <span className="opacity-85">今日剩余匹配次数</span>
            <span className="font-bold"> {remainingCount} </span>
            <span className="opacity-85">次</span>
          </div>
        </div>
      </div>
    </Card>
  );
};


export default function MatchContent() {

  const { data: accountInfo } = api.user.getUserAccount.useQuery();
  const { data: userData } = api.user.getCurrentUser.useQuery();

  // console.log(333,accountInfo)
  const router = useRouter();
  const { toast } = useToast();

  const [isVip, setIsVip] = useState(false);
  // 模拟图片数据
  const images = [
    "/images/f06e2ccf52c59d0edf895b0b5deccaef.png",
    "/images/245c3539f005b6f252d845eb611634bb.png",
    "/images/4685162de1c8d1b4ec68106acf89b313.png",
    "/images/45c4453b8822914ac4f345220cf07da9.png",
    "/images/93030eced3f1b7466cce76d03ab5ff86.png",
    "/images/7ef375c6f373390350377a0d58c27cca.png",
    "/images/e322376cc8edace365a5ab2254fd4991.png",
    "/images/d640bd214dc424d6128fbe48c1b0fa15.png",
    "/images/8a36a7e4ac6e8bcd41ec56609624f332.png",
    "/images/ef931f11e7e60732ac9f3291c613ae99.png",
    "/images/d47be39e116c69add241d98061aa9575.png",
    "/images/d640bd214dc424d6128fbe48c1b0fa15.png",
  ];

  // 根据VIP状态设置初始status
  const [status, setStatus] = useState<MatchStatus>(isVip ? MatchStatus.IDLE : MatchStatus.NO_VIP);
  const [remainingCount, setRemainingCount] = useState(0);
  const [matchTimer, setMatchTimer] = useState(2);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>("");

    // 保存匹配到的用户信息
  const [matchedUser, setMatchedUser] = useState(null);

  const matchMutation = api.user.match.useMutation({
    onSuccess: (data) => {
      // Update remaining count
      setRemainingCount(data.remainingCount);
      // Store matched user info
      setMatchedUser(data.matchedUser);
      // Update status to success
      setStatus(MatchStatus.SUCCESS);
    },
    onError: (error) => {
      // Handle different error cases
      if (error.message.includes("SVIP")) {
        setStatus(MatchStatus.NO_VIP);
      } else if (error.message.includes("次数已用完")) {
        setStatus(MatchStatus.EXHAUSTED); 
      } else {
        // Show error message
        toast({
          title: "匹配失败",
          description: error.message,
          variant: "destructive"
        });
        setStatus(MatchStatus.IDLE);
      }
    }
  });

  useEffect(() => {
    setRemainingCount(accountInfo?.matchCount || 0);
    setIsVip(accountInfo?.vipLevel == 2?true:false);
    setStatus(accountInfo?.vipLevel == 2 ? MatchStatus.IDLE : MatchStatus.NO_VIP);
  }, [accountInfo]);

  useEffect(() => {
    if (userData) {
      setCurrentUserAvatar(userData.avatar || '/images/606d18e1ed6ef79895bd45fd7d384401.png');
    }
  }, [userData]);
  
  // 处理开始匹配
  const handleMatch = async () => {
    if (!isVip) {
      setStatus(MatchStatus.NO_VIP);
      return;
    }
    
    if (remainingCount <= 0) {
      setStatus(MatchStatus.EXHAUSTED);
      return;
    }
    
    setStatus(MatchStatus.MATCHING);
    // setRemainingCount(prev => prev - 1);
    
     // Start matching
    await matchMutation.mutateAsync();
  };

  // 处理继续匹配
  const handleContinue = () => {
    if (!isVip) {
      setStatus(MatchStatus.NO_VIP);
      return;
    }
    
    if (remainingCount <= 0) {
      setStatus(MatchStatus.EXHAUSTED);
    } else {
      setStatus(MatchStatus.IDLE);
    }
  };

  // 处理查看资料
  const handleViewProfile = () => {
    console.log('View profile');
    if (matchedUser) {
      router.push(`/homepage?id=${matchedUser.id}`);
    }
  };

  // 处理返回首页  
  const handleBackHome = () => {
    console.log('Back to home');
    router.push('/homepage?id=' + accountInfo?.userId);
  };

  // 处理升级VIP
  const handleUpgradeVip = () => {
    console.log('Upgrade to VIP');
    // 这里可以触发升级VIP的弹窗或跳转
    router.push('/recharge?type=1')
  };

  return (
    <div className="w-[980px] bg-purple-100 rounded-lg p-4 min-h-[953px] relative">
      <div className="relative w-[947px] mx-auto">
        {/* Image Grid */}
        <div className="flex flex-wrap -m-[4.5px]">
          {images.map((src, index) => (
            <BlurredImage key={index} src={src} />
          ))}
        </div>

        {/* Matching Panel */}
        <MatchPanel
          status={status}
          remainingCount={remainingCount}
          matchTimer={matchTimer}
          currentUserAvatar={currentUserAvatar}
          matchedUser={matchedUser}
          onMatch={handleMatch}
          onContinue={handleContinue}
          onViewProfile={handleViewProfile}
          onBackHome={handleBackHome}
          onUpgradeVip={handleUpgradeVip}
        />
      </div>
    </div>
  );


}