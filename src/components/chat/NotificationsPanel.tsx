"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { api } from "~/trpc/react";
// import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

const NotificationsPanel = ({ onClose }: { onClose: () => void }) => {
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // const entry = useIntersectionObserver(loadMoreRef, {});
  // const isVisible = !!entry?.isIntersecting;

  // Fetch notifications
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    api.notification.getNotifications.useInfiniteQuery(
      { pageSize: 20 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
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
        return "关注了您";
      case 2:
        return "评论了您的动态";
      case 3:
        return "点赞了您的动态";
      case 4:
        return "访问了您的主页";
      default:
        return "";
    }
  };

  return (
    <div className="h-full flex-1 bg-[#D5D4EE]">
      <div className="flex items-center justify-between border-b border-[#9997C5]/20 p-4">
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
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100/20"
          >
            <X className="h-5 w-5 text-gray-800" />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100%-60px)] space-y-4 overflow-y-auto p-4">
        {isLoading
          ? // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <Skeleton className="h-[42px] w-[42px] rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))
          : // Notification list
            data?.pages.map((page) =>
              page.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center border-b border-[#9997C5]/20 py-4 ${
                    notification.isRead ? "opacity-60" : ""
                  }`}
                  onClick={() =>
                    !notification.isRead && handleMarkAsRead(notification.id)
                  }
                >
                  <div className="flex flex-1 items-center">
                    <Avatar className="h-[42px] w-[42px]">
                      <AvatarImage
                        src={notification?.otherUser?.avatar || ""}
                      />
                    </Avatar>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-800">
                        {notification?.otherUser?.nickname}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {notification?.insertTime?format(
                            new Date(notification?.insertTime),
                            "yyyy-MM-dd HH:mm",
                          ):null}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {notification.type?getInteractionText(notification.type):null}
                  </div>
                </div>
              )),
            )}

        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-4" />

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="py-4 text-center text-gray-600">加载中...</div>
        )}

        {/* No more data */}
        {!hasNextPage && data?.pages && data?.pages[0]?.notifications?.length > 0 && (
          <div className="py-4 text-center text-gray-600">没有更多通知了</div>
        )}

        {/* Empty state */}
        {data?.pages[0].notifications.length === 0 && (
          <div className="py-12 text-center text-gray-600">暂无通知</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
