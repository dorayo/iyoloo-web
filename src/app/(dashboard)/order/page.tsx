"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { api } from "~/trpc/react";

export default function OrderContent() {
  const [type, setType] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Queries
  const purchasedOrders = api.order.getPurchasedOrders.useQuery(
    { page, pageSize },
    { enabled: type === 1 },
  );

  const receivedOrders = api.order.getReceivedOrders.useQuery(
    { page, pageSize },
    { enabled: type === 2 },
  );

  const orders = type === 1 ? purchasedOrders.data : receivedOrders.data;
  const isLoading =
    type === 1 ? purchasedOrders.isLoading : receivedOrders.isLoading;

  const handleBackClick = () => {
    window.history.back();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderOrderStatus = (status: number) => {
    switch (status) {
      case 0:
        return <span className="text-yellow-500">待支付</span>;
      case 1:
        return <span className="text-blue-500">处理中</span>;
      case 2:
        return <span className="text-green-500">已完成</span>;
      case 3:
        return <span className="text-red-500">已取消</span>;
      default:
        return <span className="text-gray-500">未知状态</span>;
    }
  };

  return (
    <div className="min-h-screen w-full p-4">
      {/* Navigation */}
      <div className="mb-6 flex items-center gap-3">
        <button className="flex items-center" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 text-white" />
          <span className="text-white">返回</span>
        </button>
        <span className="text-white">我的订单</span>
      </div>

      {/* Order Tabs */}
      <Card className="mb-4 bg-[rgb(213,212,238)]">
        <CardContent className="p-4">
          <div className="relative flex gap-12 pb-2">
            <button
              className={`${type === 1 ? "text-indigo-600" : "text-gray-400"} transition-colors`}
              onClick={() => {
                setType(1);
                setPage(1);
              }}
            >
              我购买的
            </button>
            <button
              className={`${type === 2 ? "text-indigo-600" : "text-gray-400"} transition-colors`}
              onClick={() => {
                setType(2);
                setPage(1);
              }}
            >
              我收到的
            </button>
            <div
              className={`absolute bottom-0 transition-all duration-300 ${
                type === 1 ? "left-[10px]" : "left-[120px]"
              } h-1 w-[22px] bg-indigo-600`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          [...Array(3)].map((_, i) => (
            <Card key={i} className="bg-[rgb(213,212,238)]">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-[98px] w-[98px] rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-6 w-48" />
                    <Skeleton className="mt-12 h-4 w-32" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : orders?.orders.length === 0 ? (
          <Card className="bg-[rgb(213,212,238)]">
            <CardContent className="p-8 text-center text-gray-500">
              暂无订单记录
            </CardContent>
          </Card>
        ) : (
          orders?.orders.map((order) => (
            <Card key={order.id} className="bg-[rgb(213,212,238)]">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img
                    src={order.goods.image}
                    alt={order.goods.name}
                    className="h-[98px] w-[98px] rounded-lg object-cover"
                  />

                  {/* Order Details */}
                  <div className="flex flex-1 justify-between">
                    {/* Left Content */}
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-gray-900">
                          {order.goods.name}
                        </h3>
                        <span className="text-gray-500">*{order.goodsSum}</span>
                        <span className="ml-2">
                          {renderOrderStatus(order.status)}
                        </span>
                      </div>
                      <div className="mt-12 space-y-2 text-sm text-gray-500">
                        <div>
                          下单时间：
                          {format(
                            new Date(order.insertTime),
                            "yyyy-MM-dd HH:mm:ss",
                          )}
                        </div>
                        <div>赠言：{order.remake || "-"}</div>
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-xl font-bold text-indigo-600">
                        {order.amount} 金币
                      </span>
                      <span className="text-gray-500">
                        {type === 1
                          ? `收货人：${order.recipient?.nickname}`
                          : `赠送人：${order.buyer?.nickname}`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Pagination */}
        {orders && orders.pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              上一页
            </Button>
            <span className="px-4 py-2 text-white">
              {page} / {orders.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === orders.pagination.totalPages}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
