'use client'
import { UserButton } from '@clerk/nextjs'

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft,Bolt,ChevronDown } from 'lucide-react';
// import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { UserPen } from 'lucide-react';
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [userInfo, setUserInfo] = useState({
    userData: {
      follow: 0,
      fans: 0,
      friend: 0,
    },
    userAccount: {
      goldCoin: 0,
      character: 0,
      vipLevel:0
    },
    nickname: "",
    account: "",
    avatar: "",
    id:""
  });
  const [searchId, setSearchId] = useState('');
  const router = useRouter();

  const { data: userData, isLoading } = api.user.getCurrentUser.useQuery();
  // console.log(444,userData)
  useEffect(() => {
    if (userData) {
      setUserInfo(userData!);
    }
  }, [userData]);


  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const id = searchId.trim();
      if (id && /^\d+$/.test(id)) { // Validate numeric ID
        router.push(`/homepage?id=${id}`);
        setSearchId(''); // Clear input after search
      }
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-[#2D1B69]">
      {/* Header - Fixed Top */}
      <header className="bg-[#1E1247] py-2 px-[348px] shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white font-poppins tracking-tight">
              iyoloo
            </span>
            <div className="ml-[172px] flex space-x-12">
              <a href="/meet" className="text-[#9996C4] text-sm">偶遇</a>
              {/* <span className="text-[#9996C4] text-sm">动态</span> */}
              <a href="/mall" className="text-[#9996C4] text-sm">商城</a>
            </div>
          </div>
          <div className="flex items-center">
            <div className="px-1.5 py-1 bg-white/10 border border-white/40 rounded flex items-center">
            <Input 
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="请输入您要搜索的用户ID"
                className="bg-transparent border-none text-xs text-[#BBBCBF] w-[200px] h-7 focus:outline-none"
              />
              <ChevronDown color="white" />
              {/* <img src="/api/placeholder/16/16" alt="search" className="ml-[85px]" /> */}
            </div>
            <span className="ml-6 text-white text-sm">简体中文</span>
            <img src="/images/be56af9852fa810252d998dfb0fa2a20.png" alt="lang" className="ml-1" />
            {/* <Bolt color="white" /> */}
            <UserButton />

          </div>
        </div>
      </header>
      {/* Main Content -  */}
      <main className="flex-1 flex px-[347px] mt-20 gap-5">
        {/* Left Sidebar */}
        <div className="w-[230px] flex flex-col gap-5">
          {/* User Profile Card */}
          <Card className="bg-[#473B7B] border-white/10">
            <a href={`/homepage?id=${userInfo?.id}`} className="p-7 pb-4 bg-center bg-cover">
              <div className="relative flex justify-center">
                <div className="rounded-full border-3 border-yellow-400 p-0.5">
                  <Avatar className="w-[122px] h-[122px] shadow-white/50">
                    <AvatarImage src={userInfo.avatar || '/images/606d18e1ed6ef79895bd45fd7d384401.png'} alt="avatar" className="object-cover" />
                  </Avatar>
                </div>
                {userInfo?.userAccount?.vipLevel ?? 0 > 0?
                <img 
                  src={userInfo?.userAccount?.vipLevel === 1 ? "/images/c67ff023113668f5a8f6fa921de1f4e6.png" : "/images/4834b47190c84fad10e766cb795e2f12.png"} 
                  className="absolute right-6 bottom-0 h-5" 
                />:null}
              </div>
              <div className="text-center mt-4">
                <h3 className="text-2xl font-bold text-white">{userInfo?.nickname || ""}</h3>
                <a className="text-[#9996C4] text-sm mt-4 flex items-center justify-center" href="/profile">ID：{userInfo?.account || ""}<UserPen className='ml-2' /></a>
              </div>
            </a>
            
            {/* Stats */}
            <div className="px-9 py-2.5">
              <div className="flex justify-between text-white">
                <a href="/follow" className="text-base font-bold">{userInfo?.userData?.follow || 0}</a>
                <a href="/fans" className="text-base font-bold">{ userInfo?.userData?.fans || 0}</a>
                <a href="/friend" className="text-base font-bold">{ userInfo?.userData?.friend || 0}</a>
              </div>
              <div className="flex justify-between text-[#9996C4] text-sm mt-2.5">
                <a href={`/follow?id=${userInfo?.id}`}>关注</a>
                <a href={`/fans?id=${userInfo?.id}`}>粉丝</a>
                <a href={`/friend?id=${userInfo?.id}`}>好友</a>
              </div>
            </div>

            {/* Assets */}
            <div className="mx-4 mt-4 mb-4 p-6 bg-white/10 rounded-lg border border-white/20 shadow-inner shadow-white/25">
              <div className="flex justify-between text-white text-sm">
                <a href="/recharge?type=3">金币</a>
                <a href="/recharge?type=4">翻译包</a>
              </div>
              <div className="flex justify-between mt-5">
                <a href="/recharge?type=3" className="text-yellow-400 text-base font-bold">{ userInfo?.userAccount?.goldCoin || 0}</a>
                <a href="/recharge?type=4" className="text-[#60CFFF] text-base font-bold">{ userInfo?.userAccount?.character || 0}</a>
              </div>
            </div>
          </Card>

          {/* Side Menu */}
          <Card className="bg-[#473B7B] border-white/10">
            <div className="p-3 space-y-4">
              <a href="/chat" className="flex items-center">
                <img src="/images/3db6f98ee80a6ed89e6deaaf120c6e6d.png" alt="friend" className="rounded-full" />
                <span className="text-[#9996C4] ml-3">好友申请</span>
                <Badge className="ml-1.5 w-3 h-3 bg-red-500 flex items-center justify-center p-2">
                  <span className="text-[11px]">3</span>
                </Badge>
              </a>
              <a  href="/chat" className="flex items-center">
                <img src="/images/7f61f55032815478239f700b08e821fd.png" alt="message" className="rounded-full" />
                <span className="text-[#9996C4] ml-3">我的消息</span>
              </a>
              <a className="flex items-center" href="/visitor">
                <img src="/images/bb10ba3078d852e25f2f1c471b4204d4.png" alt="visitor" className="rounded-full" />
                <span className="text-[#9996C4] ml-3">我的访客</span>
              </a>
              <a href="/recharge?type=1" className="flex items-center">
                <img src="/images/6eb8818420d842aa91bc08be96b9a321.png" alt="account" className="rounded-full" />
                <span className="text-[#9996C4] ml-3">我的账户</span>
              </a>
              <a href="/order" className="flex items-center">
                <img src="/images/cd8a84dd861105159ea8ae65e5c1ad80.png" alt="order" className="rounded-full" />
                <span className="text-[#9996C4] ml-3">我的订单</span>
              </a>
            </div>
          </Card>
        </div>
        {/* Content */}
        {children}
        </main>
      {/* Footer - Fixed Bottom */}
      <footer className="mt-12 bg-[#1E1247] py-3.5">
        <div className="px-[348px] flex justify-between items-center text-white/85">
          <div className="space-x-2">
            <a href="https://file.iyoloo.net/agreement/iyoloo_about_zh_CN.htm" target="_blank">关于我们</a>
            <span>|</span>
            <a href="https://file.iyoloo.net/agreement/iyoloo_security_zh_CN.htm" target="_blank">交友安全</a>
            <span>|</span>
            <a href="https://file.iyoloo.net/agreement/iyoloo_use_zh_CN.htm" target="_blank">隐私条款</a>
            <span>|</span>
            <a  href="https://file.iyoloo.net/agreement/iyoloo_question_zh_CN.htm" target="_blank">帮助中心</a>
          </div>
          <a href="https://beian.miit.gov.cn/" target="_blank">豫ICP备2022017547号</a>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}