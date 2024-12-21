// components/chat/UserChatPanel.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Image as ImageIcon,
  Gift,
  ChevronDown,
  BadgeDollarSign,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import type { Conversation } from "~/types/chatType";
import { api } from "~/trpc/react";
import { useEasemob } from "~/providers/EasemobProvider";
import { useToast } from "@/hooks/use-toast";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import SendCoinsModal from "./SendCoinsModal";

interface UserChatProps {
  onClose: () => void;
  onRefresh: () => void;
  otherUser: Conversation;
}

const UserChatPanel: React.FC<UserChatProps> = ({ onClose, otherUser }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [language, setLanguage] = useState("zh-CN");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showCoinModal, setShowCoinModal] = useState(false);

  const { data: currentUser } = api.user.getCurrentUser.useQuery();
  const { isConnected, messages, loadHistoryMessages, sendMessage, sendImage } =
    useEasemob();
  const sendCoinsMutation = api.transaction.sendCoins.useMutation();

  // 加载历史消息
  useEffect(() => {
    if (isConnected && otherUser.imAccount) {
      loadHistoryMessages(otherUser.imAccount);
    }
  }, [isConnected, otherUser.imAccount]);

  // 滚动到最新消息
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // 发送文本消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const message = await sendMessage(
        otherUser.imAccount!,
        inputMessage,
        "txt",
        {
          translation: "", // 待实现翻译
          platform: "web",
        },
      );

      setInputMessage("");
    } catch (error: any) {
      console.error("Failed to send message11:", error);
      // 处理特定错误
      if (error.message === "其他设备已登录") {
        // 可以触发登出流程
        toast({
          title: "登录已过期",
          description: "请重新登录",
          variant: "destructive",
        });
        // 可以调用登出方法
        // logout();
      } else if (error.message === "余额不足") {
        toast({
          title: "余额不足",
          description: "请充值后继续使用",
          variant: "destructive",
        });
        // 可以显示充值弹窗
        // showRechargeModal();
      } else {
        toast({
          title: "发送失败",
          description: error.message || "请重试",
          variant: "destructive",
        });
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "不支持的文件类型",
        description: "请选择图片文件（JPG、PNG、GIF）",
        variant: "destructive",
      });
      return;
    }

    // 验证文件大小（如：5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "图片大小不能超过5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // 显示预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 发送图片消息
      await sendImage(otherUser.imAccount!, file);

      setPreviewImage(null);
    } catch (error: any) {
      // 处理错误，类似文本消息的错误处理
      toast({
        title: "上传失败",
        description: error.message || "请重试",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEmojiSelect = (emojiCode: string) => {
    setInputMessage((prev) => prev + emojiCode);
  };

  // 处理发送金币
  const handleSendCoins = async (amount: number) => {
    try {
      // 发送系统消息
      await sendMessage(
        otherUser.imAccount!,
        `发送了 ${amount} 金币`,
        "custom",
        {
          type: "red-packet",
          amount: amount,
          note: "",
          platform: "web",
        },
      );

      setShowCoinModal(false);

      await sendCoinsMutation.mutateAsync({
        recipientId: otherUser.userId!,
        amount,
      });

      toast({
        title: "发送成功",
        description: `成功向 ${otherUser.name} 发送 ${amount} 金币`,
      });
    } catch (error: any) {
      toast({
        title: "发送失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col bg-[#D5D4EE]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#9997C5]/20 p-4">
        <div className="flex items-center">
          <h2 className="text-base font-medium text-gray-800">
            {otherUser.name}
          </h2>
          <span
            className={`ml-2 text-xs ${otherUser.onlineState == 0 ? "text-green-600" : "bg-[#737674]"}`}
          >
            {otherUser.onlineState == 0 ? "在线" : "离线"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100/20"
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>
      </div>

      {/* Messages */}
      <div ref={messageListRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            otherUser={otherUser}
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Preview Image */}
      {previewImage && (
        <div className="border-t border-[#9997C5]/20 p-4">
          <div className="relative h-20 w-20">
            <img
              src={previewImage}
              alt="preview"
              className="h-full w-full rounded object-cover"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-[#9997C5]/20">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                // console.log(e.target.files);
                // return
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
            <button
              className="rounded-lg p-2 hover:bg-[#9997C5]/20"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <ImageIcon className="h-5 w-5 text-gray-600" />
            </button>
            {/* <button className="p-2 hover:bg-[#9997C5]/20 rounded-lg">
              <Camera className="w-5 h-5 text-gray-600" />
            </button> */}
            <a
              className="rounded-lg p-2 hover:bg-[#9997C5]/20"
              href={`/mall?userId=${otherUser.userId}`}
            >
              <Gift className="h-5 w-5 text-gray-600" />
            </a>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            <button
              className="rounded-lg p-2 hover:bg-[#9997C5]/20"
              onClick={() => setShowCoinModal(true)}
            >
              <BadgeDollarSign className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          {showCoinModal && (
            <SendCoinsModal
              onClose={() => setShowCoinModal(false)}
              recipientName={otherUser.name!}
              recipientAvatar={otherUser.avatar!}
              userBalance={currentUser?.userAccount?.goldCoin || "0"}
              onSend={handleSendCoins}
            />
          )}
          {/* Language Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center rounded border border-[#9997C5]/50 px-3 py-1 text-[#9997C5] hover:bg-[#9997C5]/10">
                {language === "zh-CN" ? "简体中文" : "English"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-36" side="top" align="start">
              <div className="flex flex-col">
                <button
                  className="rounded px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => setLanguage("zh-CN")}
                >
                  简体中文
                </button>
                <button
                  className="rounded px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => setLanguage("en")}
                >
                  English
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Input Area */}
        <div className="p-4">
          <MessageInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            multiline={true}
          />
        </div>
      </div>
    </div>
  );
};

export default UserChatPanel;
