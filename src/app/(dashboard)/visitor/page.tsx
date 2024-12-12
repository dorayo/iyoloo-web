'use client'
import React from 'react';
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";

// 访客卡片骨架组件
const VisitorCardSkeleton = () => (
  <Card className="bg-white rounded-lg overflow-hidden">
    <Skeleton className="w-full h-[227px]" />
    <div className="p-3 flex items-center justify-between">
      <div className="flex space-x-4">
        <div className="mt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-4 w-4" />
        </div>
        <div>
          <Skeleton className="h-4 w-12 rounded-full" />
          <div className="mt-2 flex items-center space-x-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
      <Skeleton className="w-[72px] h-[32px] rounded" />
    </div>
  </Card>
);

// 日期组骨架组件
const DateGroupSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-32" />
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <VisitorCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const VisitorList = () => {
  const { data: visitorData, isLoading } = api.visitor.getVisitorList.useQuery({
    page: 1,
    pageSize: 50
  });

  const handleBackClick = () => {
    window.history.back();
  };

  const sortedDates = visitorData 
    ? Object.keys(visitorData.visitors).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    : [];

  return (
    <div className="w-full max-w-6xl bg-[rgb(45,27,105)] rounded-lg">
      {/* Navigation */}
      <div className="flex items-center gap-4 px-6 py-4">
        <button className="flex items-center gap-2 text-white hover:text-white/90 cursor-pointer" onClick={handleBackClick}>
          <ChevronLeft className="w-4 h-4" />
          <span>返回</span>
        </button>
        <span className="text-white">我的访客</span>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="bg-[rgb(213,212,238)] rounded-lg p-4">
          {isLoading ? (
            // 骨架加载状态
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <DateGroupSkeleton key={i} />
              ))}
            </div>
          ) : !sortedDates.length ? (
            // 空状态展示
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">暂无访客</p>
              <p className="text-gray-400 text-sm mt-2">让更多人发现你的魅力吧~</p>
            </div>
          ) : (
            // 数据展示
            <div className="space-y-6">
              {sortedDates.map(date => (
                <div key={date} className="space-y-4">
                  <h2 className="text-base font-bold text-[rgb(51,51,51)]">
                    {date}
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {visitorData?.visitors[date].map((visitor, idx) => (
                      <Card key={idx} className="bg-white rounded-lg overflow-hidden">
                        <img 
                          src={visitor.visitor?.avatar || '/images/05d1055f0014208652c5efbb3ccdfc50.png'}
                          alt="visitor avatar"
                          className="w-full h-[227px] object-cover"
                        />
                        
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex space-x-4">
                            <div className='mt-2'>
                              <div className="text-xs font-bold text-[rgb(51,51,51)]">
                                {visitor.visitor?.nickname}
                              </div>
                              <img 
                                src={visitor.visitor?.userInfo?.gender==0?'/images/a59df0715ec3aa8ddd267014c5e4494f.png':visitor.visitor?.userInfo?.gender==1?'/images/e3be6ddebcee5c13b9051ed628117cd3.png':'37b9b5249a60d6352f80d52d8eee480f.png'}
                                alt="icon"
                                className="mt-2 w-4 h-4"
                              />
                            </div>
                            <div>
                              <span className="inline-block px-3 py-0.5 text-[10px] text-[rgb(56,184,101)] border border-[rgb(56,184,101)] rounded-full">
                                {visitor.visitor?.onlineState ? '在线' : '离线'}
                              </span>
                              <div className="mt-2 flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{visitor.visitor?.regionName}</span>
                                <span className="text-xs text-gray-400">52km</span>
                              </div>
                            </div>
                          </div>
                          <a href={`/homepage?id=${visitor.visitor?.id}`} className="px-4 py-2 text-xs text-[rgb(79,70,229)] bg-[rgba(79,70,229,0.1)] rounded">
                            查看主页
                          </a>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorList;