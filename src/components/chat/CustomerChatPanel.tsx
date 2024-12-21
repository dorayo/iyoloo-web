// components/chat/CustomerServiceChat.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import type { Conversation } from "~/types/chatType";
import { api } from "~/trpc/react";
import { useEasemob } from "~/providers/EasemobProvider";
import { useToast } from "@/hooks/use-toast";
import { EmojiPicker } from "@/components/ui/EmojiPicker";

interface CustomerServiceChatProps {
  onClose: () => void;
}

const CustomerChatPanel: React.FC<CustomerServiceChatProps> = ({ onClose }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [language, setLanguage] = useState("zh-CN");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: currentUser } = api.user.getCurrentUser.useQuery();
  const { isConnected, messages, loadHistoryMessages, sendMessage, sendImage } =
    useEasemob();

  const customServer: Conversation = {
    imAccount: "iyolooservice001",
    avatar: "/images/b8dda92523a3954ae27b5e3785e85110.png",
    name: "专属客服",
  };

  // 加载历史消息
  useEffect(() => {
    if (isConnected) {
      loadHistoryMessages(customServer.imAccount!);
    }
  }, [isConnected, customServer.imAccount]);

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
        customServer.imAccount!,
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
      await sendImage(customServer.imAccount!, file);

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

  return (
    <div className="flex h-full flex-1 flex-col bg-[#D5D4EE]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#9997C5]/20 p-4">
        <h2 className="text-base font-medium text-gray-800">专属客服</h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100/20"
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            otherUser={customServer}
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#9997C5]/20 p-4">
        <div className="mb-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
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
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
        <MessageInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          placeholder="请输入您的问题..."
          multiline={true}
        />
      </div>
    </div>
  );
};

export default CustomerChatPanel;
