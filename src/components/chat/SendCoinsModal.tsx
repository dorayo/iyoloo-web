"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface SendCoinsModalProps {
  onClose: () => void;
  recipientName: string;
  recipientAvatar: string;
  userBalance: string;
  onSend: (amount: number) => void;
}

const SendCoinsModal: React.FC<SendCoinsModalProps> = ({
  onClose,
  recipientName,
  recipientAvatar,
  userBalance,
  onSend,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const { toast } = useToast();

  const coinOptions = [10, 30, 50];

  const handleSend = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    // 验证金额
    if (!amount || amount <= 0) {
      toast({
        title: "无效金额",
        description: "请输入有效的金币数量",
        variant: "destructive",
      });
      return;
    }

    // 验证余额
    if (amount > parseInt(userBalance)) {
      toast({
        title: "余额不足",
        description: "您的金币余额不足",
        variant: "destructive",
      });
      return;
    }

    onSend(amount);
  };

  const handleRecharge = () => {
    // Navigate to recharge page
    window.location.href = "/recharge?type=3";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[400px] rounded-lg bg-white p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Recipient Avatar */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-yellow-400">
              <AvatarImage src={recipientAvatar} alt={recipientName} />
            </Avatar>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-yellow-400 px-2 py-0.5 text-xs text-white">
              SVIP
            </div>
          </div>
          <h3 className="mt-4 text-lg font-medium">赠送金币给我</h3>
        </div>

        {/* Coin Amount Options */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {coinOptions.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              onClick={() => {
                setSelectedAmount(amount);
                setCustomAmount("");
              }}
              className="h-12"
            >
              {amount} 金币
            </Button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="mb-6">
          <label className="mb-2 block text-sm text-gray-600">其他金额:</label>
          <Input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(0);
            }}
            placeholder="输入自定义金额"
            min="1"
            max={userBalance}
          />
        </div>

        {/* Send Button */}
        <Button
          className="mb-4 w-full bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5]"
          onClick={handleSend}
        >
          赠送金币
        </Button>

        {/* Balance and Recharge */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>当前可用金币: {userBalance} </span>
          <button
            onClick={handleRecharge}
            className="text-[#8B5CF6] hover:text-[#4F46E5]"
          >
            去充值 &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendCoinsModal;
