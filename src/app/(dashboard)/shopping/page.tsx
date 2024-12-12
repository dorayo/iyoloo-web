'use client'

import React, { useState } from 'react';
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast"
import { api } from '~/trpc/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OrderCheckout() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const goodId = searchParams.get('id');
  const initialGoodId = goodId ? parseInt(goodId, 10) : 1;

  // Form state
  const [recipientType, setRecipientType] = useState<'friend' | 'self'>('friend');
  const [recipientId, setRecipientId] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  // Queries
  const { data: productDetail, isLoading: productLoading } = api.mall.getProductDetail.useQuery({
    productId: initialGoodId
  });

  const { data: friendList } = api.relation.getFriendList.useQuery({
    page: 1,
    pageSize: 20
  });

  const { data: userAccount } = api.user.getUserAccount.useQuery();

  // Create order mutation
  const createOrder = api.order.createOrder.useMutation({
    onSuccess: () => {
      toast({
        title: "订单创建成功",
        description: "您的订单已成功创建",
      });
      router.push('/order');
    },
    onError: (error) => {
      toast({
        title: "订单创建失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate total price
  const totalPrice = productDetail ? productDetail.price * quantity : 0;

  // Handlers
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = async () => {
    console.log('Submit order');
    // Validate form
    if (recipientType === 'self' && (!shippingAddress || !shippingPhone)) {
      toast({
        title: "请填写完整信息",
        description: "请填写收货地址和联系电话",
        variant: "destructive",
      });
      return;
    }

    if (recipientType === 'friend' && !recipientId) {
      toast({
        title: "请选择收货人",
        description: "请选择要赠送的好友",
        variant: "destructive",
      });
      return;
    }

    // Verify gold coins
    if (!userAccount || userAccount.goldCoin < totalPrice) {
      toast({
        title: "金币不足",
        description: "您的金币余额不足，请充值",
        variant: "destructive",
      });
      return;
    }

    setShowConfirm(true);
  };

  const confirmOrder = () => {
    createOrder.mutate({
      goodsId: initialGoodId,
      quantity,
      recipientType,
      recipientUserId: recipientType === 'friend' ? parseInt(recipientId) : undefined,
      shippingAddress: recipientType === 'self' ? shippingAddress : undefined,
      shippingPhone: recipientType === 'self' ? shippingPhone : undefined,
      message,
      paymentMethod: 'gold_coin',
    });
    setShowConfirm(false);
  };

  if (productLoading) {
    return <div className="p-4 text-center text-white">Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 text-white" />
          <span className="text-white">返回</span>
        </button>
        <span className="text-white">下单</span>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <Card className="bg-purple-100">
          <CardContent className="p-6">
            {/* Recipient Selection */}
            <div className="flex items-center justify-center gap-16">
              <span className="text-gray-600">选择收货人：</span>
              <RadioGroup 
                defaultValue={recipientType} 
                onValueChange={(value: 'friend' | 'self') => setRecipientType(value)} 
                className="flex gap-16"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="friend" id="friend" />
                  <label htmlFor="friend" className={recipientType === 'friend' ? "text-indigo-600" : "text-gray-900"}>
                    送给好友
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="self" id="self" />
                  <label htmlFor="self" className={recipientType === 'self' ? "text-indigo-600" : "text-gray-900"}>
                    送给自己
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Friend Selection or Address Input */}
            {recipientType === 'friend' ? (
              <div className="mt-6 flex items-center justify-center gap-4">
                <span className="text-gray-600">选择好友：</span>
                <Select value={recipientId} onValueChange={setRecipientId}>
                  <SelectTrigger className="w-[230px] bg-white/20 border-indigo-600/50">
                    <SelectValue placeholder="请选择好友" />
                  </SelectTrigger>
                  <SelectContent>
                    {friendList?.friends?.map((friend) => (
                      <SelectItem 
                        key={friend.friendUserId} 
                        value={friend.friendUserId.toString()}
                      >
                        {friend.friendUser.nickname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-gray-600">收货地址：</span>
                  <Textarea 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="请输入收货地址...."
                    className="w-[388px] h-20 bg-purple-50/30 border-gray-200"
                  />
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-gray-600">联系电话：</span>
                  <Input
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="请输入联系电话"
                    className="w-[388px] bg-purple-50/30 border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-start gap-4 px-[210px]">
              <img
                src={productDetail?.image}
                alt={productDetail?.name}
                className="w-[125px] h-[125px] rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-base">{productDetail?.name}</h3>
                <p className="text-gray-500 mt-2 text-sm">{productDetail?.product}</p>
                <div className="mt-12 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    {productDetail?.price} 金币
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">购买数量：</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Message */}
            <div className="mt-6 px-[210px]">
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="请输入赠言...."
                className="w-full bg-purple-50/30 border-gray-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Card */}
        <Card className="bg-purple-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-600">应支付：</span>
              {/* Payment Card - Continuation */}
              <span className="text-indigo-600 text-2xl font-bold">
                {totalPrice} 金币
              </span>
              <div className="text-sm text-gray-500">
                (当前余额: {userAccount?.goldCoin ?? 0} 金币)
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-gray-600">支付方式：</span>
              <Select disabled defaultValue="gold_coin">
                <SelectTrigger className="w-[230px] bg-white/20 border-indigo-600/50">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      {/* <img 
                        src="/images/gold-coin-icon.png" 
                        alt="Gold Coin" 
                        className="w-4 h-4"
                      /> */}
                      金币支付
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold_coin">金币支付</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className="w-[134px] h-[45px] bg-gradient-to-r from-violet-500 to-indigo-600"
                onClick={handleSubmit}
                disabled={createOrder.isLoading}
              >
                {createOrder.isLoading ? "处理中..." : "确认支付"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认订单</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">商品名称：</span>
                  <span className="font-medium">{productDetail?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">购买数量：</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">收货方式：</span>
                  <span className="font-medium">
                    {recipientType === 'friend' ? '赠送好友' : '自己收货'}
                  </span>
                </div>
                {recipientType === 'friend' ? (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">收货人：</span>
                    <span className="font-medium">
                      {friendList?.friends && friendList?.friends?.find(
                        f => f.friendUserId.toString() === recipientId
                      )?.friendUser.nickname}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">收货地址：</span>
                      <span className="font-medium">{shippingAddress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">联系电话：</span>
                      <span className="font-medium">{shippingPhone}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">支付金额：</span>
                  <span className="font-medium text-indigo-600">
                    {totalPrice} 金币
                  </span>
                </div>
                {message && (
                  <div className="border-t pt-4 mt-4">
                    <span className="text-gray-500">赠言：</span>
                    <p className="mt-2 text-sm">{message}</p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              取消
            </Button>
            <Button
              onClick={confirmOrder}
              disabled={createOrder.isLoading}
              className="bg-indigo-600"
            >
              确认下单
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}