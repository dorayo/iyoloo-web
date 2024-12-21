"use client";

import { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "~/trpc/react";

export interface FriendRequest {
  id: number;
  userId: number;
  name: string;
  avatar: string;
  personalSign?: string;
  region: string;
  timestamp: string;
  remark: string;
}

const FriendRequestList = ({
  onAccept,
  onReject,
  onClose,
}: {
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<number | null>(null);

  // 获取好友申请列表
  const { data, isLoading, error, refetch } =
    api.relation.getFriendRequests.useQuery(
      {
        page: 1,
        pageSize: 20,
      },
      {
        // 防止重复加载
        staleTime: 1000 * 60 * 5, // 5分钟
        // 只在数据确实变化时更新
        notifyOnChangeProps: ["data"],
      },
    );

  // 处理好友申请的 mutation
  const handleFriendRequest: any = api.relation.handleFriendRequest.useMutation(
    {
      onSuccess: (_, variables: any) => {
        toast({
          title: variables?.accept ? "好友申请已通过" : "已拒绝好友申请",
          variant: variables?.accept ? "default" : "destructive",
        });

        // 重新获取列表
        refetch();
        setProcessingId(null);
      },
      onError: (error) => {
        toast({
          title: "操作失败",
          description: error.message,
          variant: "destructive",
        });
        setProcessingId(null);
      },
    },
  );

  const handleAccept = (requestId: number) => {
    setProcessingId(requestId);
    handleFriendRequest.mutate({
      requestId,
      accept: true,
    });
  };

  const handleReject = (requestId: number) => {
    setProcessingId(requestId);
    handleFriendRequest.mutate({
      requestId,
      accept: false,
    });
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-[#D5D4EE]">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center bg-[#D5D4EE] p-4">
        <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
        <p className="mb-4 text-center text-gray-800">加载好友申请失败</p>
        <Button onClick={() => refetch()} variant="outline">
          重新加载
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 bg-[#D5D4EE]">
      <div className="flex items-center justify-between border-b border-[#9997C5]/20 p-4">
        <h2 className="text-base font-medium text-gray-800">
          好友申请 ({data?.pagination.total || 0})
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100/20"
          disabled={handleFriendRequest?.isLoading}
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>
      </div>

      <div className="max-h-[calc(100%-60px)] space-y-4 overflow-y-auto p-4">
        {data?.requests.length === 0 ? (
          <div className="py-8 text-center text-gray-500">暂无新的好友申请</div>
        ) : (
          data?.requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between border-b border-[#9997C5]/20 pb-4"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-[42px] w-[42px]">
                  <AvatarImage src={request?.avatar || ""}  />
                  <AvatarFallback>{request?.name?.charAt(0) || ""}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">
                      {request.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {request.region}
                    </span>
                  </div>
                  {request.personalSign && (
                    <p className="mt-1 line-clamp-1 text-xs text-gray-600">
                      {request.personalSign}
                    </p>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    {request.timestamp}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(request.id)}
                  disabled={processingId === request.id}
                  className="border-0 bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                >
                  {processingId === request.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "拒绝"
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAccept(request.id)}
                  disabled={processingId === request.id}
                  className="bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90"
                >
                  {processingId === request.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "通过"
                  )}
                </Button>
              </div>
            </div>
          ))
        )}

        {/* 分页信息 */}
        {data?.pagination &&
          data.pagination.total > data.pagination.pageSize && (
            <div className="mt-4 text-center text-sm text-gray-500">
              共 {data.pagination.total} 条好友申请，当前显示{" "}
              {data.requests.length} 条
            </div>
          )}
      </div>
    </div>
  );
};

export default FriendRequestList;
