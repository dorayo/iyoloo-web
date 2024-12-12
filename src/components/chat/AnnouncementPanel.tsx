'use client'

import { X } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '~/trpc/react';
import { toast } from "@/hooks/use-toast"

export interface Announcement {
  id: number;
  content: string;
  url?: string;
  insertTime: Date;
  status: number;
}

const AnnouncementPanel = ({
  onClose
}: {
  onClose: () => void;
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 使用 useMemo 确保唯一性
  const announcementIds = useMemo(() => {
    return new Set(announcements.map(a => a.id));
  }, [announcements]);

  const { data, isLoading } = api.announcement.getAnnouncementList.useQuery(
    {
      page,
      pageSize: 10,
      status: 'unread'
    },
    {
      // 防止重复加载
      keepPreviousData: true,
      // 只在数据确实变化时更新
      notifyOnChangeProps: ['data']
    }
  );

  const markAsReadMutation = api.announcement.markAnnouncementAsRead.useMutation({
    onSuccess: (result, variables) => {
      setAnnouncements(prev => 
        prev.filter(announcement => announcement.id !== variables.announcementId)
      );
    },
    onError: (error) => {
      toast({
        title: "标记失败",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (data?.announcements) {
      // 过滤重复数据
      // const newAnnouncements = data.announcements.filter(
      //   announcement => !announcementIds.has(announcement.id)
      // );
      setAnnouncements(data?.announcements)
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
    <div className="flex-1 bg-[#D5D4EE] h-full">
      <div className="flex justify-between items-center p-4 border-b border-[#9997C5]/20">
        <h2 className="text-base font-medium text-gray-800">公告</h2>
        <button onClick={onClose} className="hover:bg-gray-100/20 p-1 rounded-full">
          <X className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100%-60px)]">
        {isLoading && announcements.length === 0 ? (
          <div className="text-center text-gray-500">加载中...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-gray-500">暂无新公告</div>
        ) : (
          announcements.map(announcement => (
            <div 
              key={announcement.id} 
              className="flex items-start space-x-4 relative"
            >
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-[#8B5CF6] flex items-center justify-center">
                <span className="text-white font-bold">公告</span>
              </div>
              <div className="flex-1 p-4 bg-white rounded-lg shadow-sm text-[#2D1B69] font-medium relative">
                {announcement.content}
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(announcement.insertTime).toLocaleString()}
                </div>
                <button 
                  onClick={() => handleMarkAsRead(announcement.id)}
                  className="absolute top-2 right-2 text-xs text-gray-500 hover:text-[#8B5CF6]"
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