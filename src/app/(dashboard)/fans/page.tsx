'use client'
import { Card } from "@/components/ui/card";
import { ChevronLeft ,Users } from "lucide-react";
import { api } from "~/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";

// 抽取骨架卡片组件
const FanCardSkeleton = () => (
  <Card className="bg-white rounded-lg overflow-hidden">
    <Skeleton className="w-full aspect-square" />
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <Skeleton className="w-14 h-8 rounded" />
      </div>
    </div>
  </Card>
);


export default function FollowingList() {

  const { data: fansData ,isLoading } = api.relation.getFansList.useQuery({
    page: 1,
    pageSize: 50
  });
  console.log(333,fansData)
  const handleBackClick = () => {
    window.history.back();
  };



  return (
    <div className="w-full min-h-screen">
      {/* Navigation */}
      <div className="flex items-center gap-3 px-6 py-4">
        <button className='flex items-center' onClick={handleBackClick}>
          <ChevronLeft className="w-4 h-4 text-white" />
          <span className="text-white">返回</span>
        </button>
        <span className="text-white">我的粉丝</span>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-[rgb(213,212,238)] rounded-lg p-4">
          {/* Grid of user cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <FanCardSkeleton key={i} />
              ))}
            </div>
          ) : (!fansData?.fans || fansData.fans.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-indigo-600" />
              </div>
              <p className="text-gray-500 text-lg">暂无粉丝</p>
              <p className="text-gray-400 text-sm mt-2">继续加油，提升自己的魅力值吧~</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fansData?.fans && fansData?.fans.map((user) => (
              <Card key={user.id} className="bg-white rounded-lg overflow-hidden">
                {/* User Avatar */}
                <div className="relative w-full">
                  <img
                    src={user?.user?.avatar || '/images/dd864e07b4202526dabaa469ed0e75ab.png'}
                    className="w-full aspect-square object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="p-3">

                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{user.user?.nickname}</span>
                        <div className={`text-xs ${user.user?.onlineState ? 'text-green-500 border border-green-500' : 'bg-gray-200 text-gray-500'} rounded-full px-2 py-0.5`}>
                          {user.user?.onlineState ? '在线' : '离线'}
                        </div>
                      </div>

                      <div className="flex items-center text-gray-500 text-xs gap-2">
                        <img
                          src={user.user?.userInfo?.gender==0?'/images/a59df0715ec3aa8ddd267014c5e4494f.png':user.user?.userInfo?.gender==1?'/images/e3be6ddebcee5c13b9051ed628117cd3.png':'37b9b5249a60d6352f80d52d8eee480f.png'}
                          className="w-4 h-4"
                        />
                        <span>{user.user?.regionName}</span>
                        <span>{user.user?.distance}km</span>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="w-14 h-8 bg-indigo-50/10 rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>)}
        </div>
      </div>
    </div>
  );
}