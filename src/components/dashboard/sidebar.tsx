import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Card } from "@/components/ui/card";
import { UserPen } from "lucide-react";
import { api } from "~/trpc/react";
// import { useEasemob } from "~/providers/EasemobProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Update the UserInfo interface to match the API response type
interface UserInfo {
  id?: number;
  account?: number | null;
  nickname?: string | null;
  avatar?: string | null;
  userAccount?: {
    vipLevel?: number | null;
    goldCoin?: string | null;
    character?: number | null;
  };
  userData?: {
    follow: number | null;  // Changed from number | undefined to number | null
    fans: number | null;    // Same here
    friend: number | null;  // And here
  };
}

export default function DashboardSidebar() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchId, setSearchId] = useState("");
  const router = useRouter();
  // const { login, isConnected, error } = useEasemob();
  const { data: currentUser, isLoading } = api.user.getCurrentUser.useQuery();
  // console.log(444,userData)
  useEffect(() => {
    if (currentUser) {
      setUserInfo(currentUser!);
    }
  }, [currentUser]);

  // useEffect(() => {
  //   if (currentUser && !isConnected) {
  //     login(`iyoloo${currentUser.account}`, currentUser.password)
  //       .then(() => {
  //         console.log('Chat login successful');
  //       })
  //       .catch((err) => {
  //         console.error('Chat login failed:', err);
  //       });
  //   }
  // }, [currentUser, isConnected]);

  return (
    <div className="flex w-[230px] flex-col gap-5">
      {/* User Profile Card */}
      <Card className="border-white/10 bg-[#473B7B]">
        <a
          href={`/homepage?id=${userInfo?.id}`}
          className="bg-cover bg-center p-7 pb-4"
        >
          <div className="relative flex justify-center">
            <div className="border-3 flex rounded-full border-yellow-400 p-0.5">
              <Avatar className="h-[122px] w-[122px] shadow-white/50">
                <AvatarImage
                  src={
                    userInfo?.avatar ||
                    "/images/606d18e1ed6ef79895bd45fd7d384401.png"
                  }
                  alt="avatar"
                  className="object-cover"
                />
              </Avatar>
            </div>
            {userInfo?.userAccount?.vipLevel! > 0 ? (
              <img
                src={
                  userInfo?.userAccount?.vipLevel === 1
                    ? "/images/c67ff023113668f5a8f6fa921de1f4e6.png"
                    : "/images/4834b47190c84fad10e766cb795e2f12.png"
                }
                className="absolute bottom-0 right-6 h-5"
              />
            ) : null}
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-2xl font-bold text-white">
              {userInfo?.nickname || ""}
            </h3>
            <a
              className="mt-4 flex items-center justify-center text-sm text-[#9996C4]"
              href="/profile"
            >
              ID：{userInfo?.account || ""}
              <UserPen className="ml-2" />
            </a>
          </div>
        </a>

        {/* Stats */}
        <div className="px-9 py-2.5">
          <div className="flex justify-between text-white">
            <a href="/follow" className="text-base font-bold">
              {userInfo?.userData?.follow || 0}
            </a>
            <a href="/fans" className="text-base font-bold">
              {userInfo?.userData?.fans || 0}
            </a>
            <a href="/friend" className="text-base font-bold">
              {userInfo?.userData?.friend || 0}
            </a>
          </div>
          <div className="mt-2.5 flex justify-between text-sm text-[#9996C4]">
            <a href={`/follow?id=${userInfo?.id}`}>关注</a>
            <a href={`/fans?id=${userInfo?.id}`}>粉丝</a>
            <a href={`/friend?id=${userInfo?.id}`}>好友</a>
          </div>
        </div>

        {/* Assets */}
        <div className="mx-4 mb-4 mt-4 rounded-lg border border-white/20 bg-white/10 p-6 shadow-inner shadow-white/25">
          <div className="flex justify-between text-sm text-white">
            <a href="/recharge?type=3">金币</a>
            <a href="/recharge?type=4">翻译包</a>
          </div>
          <div className="mt-5 flex justify-between">
            <a
              href="/recharge?type=3"
              className="text-base font-bold text-yellow-400"
            >
              {userInfo?.userAccount?.goldCoin || 0}
            </a>
            <a
              href="/recharge?type=4"
              className="text-base font-bold text-[#60CFFF]"
            >
              {userInfo?.userAccount?.character || 0}
            </a>
          </div>
        </div>
      </Card>

      {/* Side Menu */}
      <Card className="border-white/10 bg-[#473B7B]">
        <div className="space-y-4 p-3">
          <a href="/chat" className="flex items-center">
            <img
              src="/images/3db6f98ee80a6ed89e6deaaf120c6e6d.png"
              alt="friend"
              className="rounded-full"
            />
            <span className="ml-3 text-[#9996C4]">好友申请</span>
            {/* <Badge className="ml-1.5 w-3 h-3 bg-red-500 flex items-center justify-center p-2">
                  <span className="text-[11px]">3</span>
                </Badge> */}
          </a>
          <a href="/chat" className="flex items-center">
            <img
              src="/images/7f61f55032815478239f700b08e821fd.png"
              alt="message"
              className="rounded-full"
            />
            <span className="ml-3 text-[#9996C4]">我的消息</span>
          </a>
          <a className="flex items-center" href="/visitor">
            <img
              src="/images/bb10ba3078d852e25f2f1c471b4204d4.png"
              alt="visitor"
              className="rounded-full"
            />
            <span className="ml-3 text-[#9996C4]">我的访客</span>
          </a>
          <a href="/recharge?type=1" className="flex items-center">
            <img
              src="/images/6eb8818420d842aa91bc08be96b9a321.png"
              alt="account"
              className="rounded-full"
            />
            <span className="ml-3 text-[#9996C4]">我的账户</span>
          </a>
          <a href="/order" className="flex items-center">
            <img
              src="/images/cd8a84dd861105159ea8ae65e5c1ad80.png"
              alt="order"
              className="rounded-full"
            />
            <span className="ml-3 text-[#9996C4]">我的订单</span>
          </a>
        </div>
      </Card>
    </div>
  );
}
