"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import { useToast } from "@/hooks/use-toast";

// 匹配状态枚举
enum MatchStatus {
  IDLE = "idle", // 初始状态
  MATCHING = "matching", // 匹配中
  SUCCESS = "success", // 匹配成功
  EXHAUSTED = "exhausted", // 次数用完
  NO_VIP = "no_vip", // 未开通VIP
}

interface MatchedUserType {
  id: number;
  nickname: string | null;
  avatar: string | null;
  region: string | null;
  language: string | null;
  userInfo: {
    gender: number | null;
    age: number | null;
    height: string | null;
    weight: string | null;
    occupation: string | null;
    personalSign: string | null;
  };
}

// 模糊图片组件
const BlurredImage = ({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) => (
  <div
    className={`m-[4.5px] flex w-[230px] overflow-hidden rounded-lg ${className}`}
  >
    <img src={src} alt="" className="h-auto w-full object-cover blur-[5px]" />
  </div>
);

// 添加一个头像组件
const MatchAvatar = ({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) => (
  <div
    className={`h-24 w-24 overflow-hidden rounded-full border-2 border-white ${className}`}
  >
    <img src={src} alt="avatar" className="h-full w-full object-cover" />
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
  onUpgradeVip,
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
            <h2 className="mb-4 text-center text-3xl font-normal text-white">
              请稍等...
            </h2>
            <Button
              variant="default"
              className="mb-4 h-[56px] w-[264px] rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-xl font-bold"
              disabled
            >
              匹配中（{matchTimer}s）
            </Button>
            <h3 className="text-center text-3xl font-normal text-white">
              AI智能匹配中
            </h3>
          </>
        );

      case MatchStatus.SUCCESS:
        return (
          <>
            <h2 className="mb-4 text-center text-3xl font-normal text-white">
              匹配成功
            </h2>
            <div className="mb-6 flex items-center justify-center space-x-4">
              <MatchAvatar
                src={
                  currentUserAvatar ||
                  "/images/606d18e1ed6ef79895bd45fd7d384401.png"
                }
              />
              <MatchAvatar
                src={
                  matchedUser?.avatar ||
                  "/images/606d18e1ed6ef79895bd45fd7d384401.png"
                }
              />
            </div>
            <Button
              onClick={onViewProfile}
              className="mb-4 h-[56px] w-[264px] rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-xl font-bold"
            >
              进入主页
            </Button>
            <Button
              onClick={onContinue}
              className="mb-4 h-[56px] w-[264px] rounded-full bg-white/30 text-xl font-bold"
            >
              继续匹配
            </Button>
            <Button
              onClick={onBackHome}
              variant="ghost"
              className="text-xl font-normal text-white"
            >
              返回首页
            </Button>
          </>
        );

      case MatchStatus.EXHAUSTED:
        return (
          <>
            <h2 className="mb-4 text-center text-3xl font-normal text-white">
              请明天继续
            </h2>
            <h3 className="mb-8 text-center text-3xl font-normal text-white">
              今日匹配次数用完
            </h3>
            <Button
              className="mb-4 h-[56px] w-[264px] rounded-full bg-white/30 text-xl font-bold"
              disabled
            >
              开始匹配
            </Button>
          </>
        );

      case MatchStatus.NO_VIP:
        return (
          <>
            <h2 className="mb-4 text-center text-3xl font-normal text-white">
              AI智能测算
            </h2>
            <Button
              onClick={onUpgradeVip}
              className="mb-4 h-[56px] w-[375px] rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-xl font-bold"
            >
              加入SVIP获取匹配次数
            </Button>
            <h3 className="text-center text-3xl font-normal text-white">
              遇到与你匹配的那个人
            </h3>
          </>
        );

      default:
        return (
          <>
            <h2 className="mb-4 text-center text-3xl font-normal text-white">
              AI智能测算
            </h2>
            <Button
              onClick={onMatch}
              className="mb-4 h-[56px] w-[264px] rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-xl font-bold"
            >
              开始匹配
            </Button>
            <h3 className="text-center text-3xl font-normal text-white">
              遇到与你匹配的那个人
            </h3>
          </>
        );
    }
  };

  return (
    <Card className="absolute left-1/2 top-[189px] z-10 w-[684px] -translate-x-1/2 border border-white/20 bg-transparent bg-gradient-to-b from-[rgb(30,18,71)] to-[rgba(30,18,71,0.8)] shadow-lg shadow-white/25">
      <div className="px-8 py-16 text-center">
        <div className="relative mx-auto w-[474px]">
          <div className="mb-4 flex flex-col items-center bg-[url('/match-bg.png')] bg-cover bg-center p-20">
            {renderContent()}
          </div>

          <div className="mt-8 text-center text-white">
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
  const [status, setStatus] = useState<MatchStatus>(
    isVip ? MatchStatus.IDLE : MatchStatus.NO_VIP,
  );
  const [remainingCount, setRemainingCount] = useState(0);
  const [matchTimer, setMatchTimer] = useState(2);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>("");

  // 保存匹配到的用户信息
  const [matchedUser, setMatchedUser] = useState<null | MatchedUserType>(null);

  const matchMutation = api.user.match.useMutation({
    onSuccess: (data) => {
      // Update remaining count
      setRemainingCount(data.remainingCount);
      // Store matched user info
      setMatchedUser(data?.matchedUser as MatchedUserType | null);
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
          variant: "destructive",
        });
        setStatus(MatchStatus.IDLE);
      }
    },
  });

  useEffect(() => {
    setRemainingCount(accountInfo?.matchCount || 0);
    setIsVip(accountInfo?.vipLevel == 2 ? true : false);
    setStatus(
      accountInfo?.vipLevel == 2 ? MatchStatus.IDLE : MatchStatus.NO_VIP,
    );
  }, [accountInfo]);

  useEffect(() => {
    if (userData) {
      setCurrentUserAvatar(
        userData.avatar || "/images/606d18e1ed6ef79895bd45fd7d384401.png",
      );
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
    console.log("View profile");
    if (matchedUser) {
      router.push(`/homepage?id=${matchedUser?.id}`);
    }
  };

  // 处理返回首页
  const handleBackHome = () => {
    console.log("Back to home");
    router.push("/homepage?id=" + accountInfo?.userId);
  };

  // 处理升级VIP
  const handleUpgradeVip = () => {
    console.log("Upgrade to VIP");
    // 这里可以触发升级VIP的弹窗或跳转
    router.push("/recharge?type=1");
  };

  return (
    <div className="relative min-h-[953px] w-[980px] rounded-lg bg-purple-100 p-4">
      <div className="relative mx-auto w-[947px]">
        {/* Image Grid */}
        <div className="-m-[4.5px] flex flex-wrap">
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
