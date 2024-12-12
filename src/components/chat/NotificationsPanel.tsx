'use client'

import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { api } from '~/trpc/react';
// import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

const NotificationsPanel = ({
  onClose
}: {
  onClose: () => void;
}) => {
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // const entry = useIntersectionObserver(loadMoreRef, {});
  // const isVisible = !!entry?.isIntersecting;

  // Fetch notifications
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = api.notification.getNotifications.useInfiniteQuery(
    { pageSize: 20 },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
          return lastPage.pagination.currentPage + 1;
        }
        return undefined;
      },
    }
  );

  // Mark notification as read mutation
  const markAsRead = api.notification.markAsRead.useMutation();
  const markAllAsRead = api.notification.markAllAsRead.useMutation();

  // Load more when scroll to bottom
  // useEffect(() => {
  //   if (isVisible && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // }, [isVisible, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handle mark as read
  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead.mutateAsync({ notificationId });
  };

  // Get interaction type text
  const getInteractionText = (type: number) => {
    switch (type) {
      case 1:
        return '关注了您';
      case 2:
        return '评论了您的动态';
      case 3:
        return '点赞了您的动态';
      case 4:
        return '访问了您的主页';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 bg-[#D5D4EE] h-full">
      <div className="flex justify-between items-center p-4 border-b border-[#9997C5]/20">
        <h2 className="text-base font-medium text-gray-800">互动通知</h2>
        <div className="flex items-center space-x-2">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isLoading}
          >
            全部标记为已读
          </Button> */}
          <button onClick={onClose} className="hover:bg-gray-100/20 p-1 rounded-full">
            <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100%-60px)]">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4">
              <Skeleton className="h-[42px] w-[42px] rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))
        ) : (
          // Notification list
          data?.pages.map((page) =>
            page.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center py-4 border-b border-[#9997C5]/20 ${
                  notification.isRead ? 'opacity-60' : ''
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-center flex-1">
                  <Avatar className="h-[42px] w-[42px]">
                    <AvatarImage
                      src={notification.otherUser.avatar}
                      alt={notification.otherUser.nickname}
                    />
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-800">
                      {notification.otherUser.nickname}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {format(new Date(notification.insertTime), 'yyyy-MM-dd HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {getInteractionText(notification.type)}
                </div>
              </div>
            ))
          )
        )}
        
        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-4" />
        
        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="text-center py-4 text-gray-600">
            加载中...
          </div>
        )}
        
        {/* No more data */}
        {!hasNextPage && data?.pages[0].notifications.length > 0 && (
          <div className="text-center py-4 text-gray-600">
            没有更多通知了
          </div>
        )}
        
        {/* Empty state */}
        {data?.pages[0].notifications.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            暂无通知
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;