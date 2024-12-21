"use client";

import { X } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { toast } from "@/hooks/use-toast";

export interface Announcement {
  id: number;
  content: string | null;
  url: string | null;
  insertTime: Date | null;
  status: number | null;
}

const AnnouncementPanel = ({ onClose }: { onClose: () => void }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 使用 useMemo 确保唯一性
  const announcementIds = useMemo(() => {
    return new Set(announcements.map((a) => a.id));
  }, [announcements]);

  const { data, isLoading } = api.announcement.getAnnouncementList.useQuery(
    {
      page,
      pageSize: 10,
      status: "unread",
    },
    {
      // 防止重复加载
      staleTime: 1000 * 60 * 5, // 5分钟
      // 只在数据确实变化时更新
      notifyOnChangeProps: ["data"],
    },
  );

  const markAsReadMutation =
    api.announcement.markAnnouncementAsRead.useMutation({
      onSuccess: (result, variables: any) => {
        setAnnouncements((prev) =>
          prev.filter(
            (announcement) => announcement.id !== variables?.announcementId,
          ),
        );
      },
      onError: (error) => {
        toast({
          title: "标记失败",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  useEffect(() => {
    if (data?.announcements) {
       const processedAnnouncements = data.announcements.map(announcement => ({
      ...announcement,
      status: announcement.status ?? undefined, // 将 null 转换为 undefined
    }));

    // 过滤重复数据
    const newAnnouncements = processedAnnouncements.filter(
      announcement => !announcementIds.has(announcement.id)
    );
      setAnnouncements(data?.announcements);
      // setAnnouncements(prev => [...prev, ...newAnnouncements]);
      // setHasMore(data.pagination.currentPage < data.pagination.totalPages);
    }
  }, [data, announcementIds]);

  // const handleLoadMore = () => {
  //   if (hasMore && !isLoading) {
  //     setPage(prev => prev + 1);
  //   }
  // };

  const handleMarkAsRead = (announcementId: number) => {
    markAsReadMutation.mutate({ announcementId });
  };

  return (
    <div className="h-full flex-1 bg-[#D5D4EE]">
      <div className="flex items-center justify-between border-b border-[#9997C5]/20 p-4">
        <h2 className="text-base font-medium text-gray-800">公告</h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100/20"
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>
      </div>

      <div className="max-h-[calc(100%-60px)] space-y-4 overflow-y-auto p-4">
        {isLoading && announcements.length === 0 ? (
          <div className="text-center text-gray-500">加载中...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-gray-500">暂无新公告</div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="relative flex items-start space-x-4"
            >
              <div className="flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-[#8B5CF6]">
                <span className="font-bold text-white">公告</span>
              </div>
              <div className="relative flex-1 rounded-lg bg-white p-4 font-medium text-[#2D1B69] shadow-sm">
                {announcement.content}
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(announcement?.insertTime!).toLocaleString()}
                </div>
                <button
                  onClick={() => handleMarkAsRead(announcement?.id!)}
                  className="absolute right-2 top-2 text-xs text-gray-500 hover:text-[#8B5CF6]"
                >
                  标记已读
                </button>
              </div>
            </div>
          ))
        )}

        {/* {hasMore && (
          <div className="text-center">
            <button 
              onClick={handleLoadMore}
              className="text-[#8B5CF6] hover:underline"
              disabled={isLoading}
            >
              加载更多
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AnnouncementPanel;
