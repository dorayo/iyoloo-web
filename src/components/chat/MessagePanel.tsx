'use client'

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { ChatMessage,PanelType } from '@/lib/chatType';

interface MessagePanelProps {
  messages: ChatMessage[];
  onSearch: (query: string) => void;
  onPanelChange: (panel: PanelType) => void;
  activePanel: string;
  onMessageClick: (msg: ChatMessage) => void;
  activeMessage: ChatMessage | null;
}

// MessagePanel Component
export const MessagePanel: React.FC<MessagePanelProps> = ({
  messages,
  onSearch,
  onPanelChange,
  activePanel,
  onMessageClick,
  activeMessage
}) => {
  
  return (
  <div className="w-[250px] h-full bg-[#9997C5]/50">
    <div className="p-4">
      <div className="relative">
        <Input 
          placeholder="搜索" 
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 bg-white/20 border-[#9996C4] text-[#9996C4] placeholder:text-[#9996C4]"
        />
        <Search className="w-4 h-4 absolute left-3 top-3 text-[#9996C4]" />
      </div>
    </div>

    <div className="px-4 space-y-3">
      {[
        { icon: "/images/96376a9c5a7c08beac4617d0bb377896.png", text: "好友申请", panel: 'requests' as PanelType, badge: 3 },
        { icon: "/images/9fb9b0e447144868abd222ee2c02d392.png", text: "公告", panel: 'announcements' as PanelType },
        { icon: "/images/88db4342956cc4e43b88693c99e5d982.png", text: "互动通知", panel: 'notifications' as PanelType },
        { icon: "/images/b8dda92523a3954ae27b5e3785e85110.png", text: "专属客服", panel: 'customerService' as PanelType}
      ].map((item, index) => (
        <div key={index} className={`flex items-center px-2 py-3 rounded ${
              activePanel === item.panel 
                ? 'bg-[#9997C5]/30' 
                : 'hover:bg-[#9997C5]/20'
            } cursor-pointer`}  onClick={() => onPanelChange(item.panel)}>
          <img src={item.icon} alt="" className="w-[42px] h-[42px]" />
          <span className="ml-2 text-gray-800">{item.text}</span>
            {item.badge && (
            <div className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {item.badge}
            </div>)}
        </div>
      ))}
    </div>

    <div className="my-3 border-t border-[#9997C5]/20" />

    <div className="px-4 space-y-6 overflow-y-auto max-h-[calc(100vh-350px)]">
      {messages.map(message => (
        <div key={message.id} className={`flex items-start space-x-3 px-2 py-3 rounded cursor-pointer ${
          activeMessage && activeMessage.id === message.id 
                ? 'bg-[#9997C5]/30' 
                : 'hover:bg-[#9997C5]/30'
            }`} onClick={() => onMessageClick(message)}>
          <div className="relative">
            <Avatar className="h-[42px] w-[42px]">
              <AvatarImage src={message.avatar} alt={message.name} />
            </Avatar>
            {message.online && (
              <div className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 bg-[#38B865] rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{message.name}</span>
              {message.unread > 0 && (
                <div className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {message.unread}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 opacity-70 truncate">{message.message}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)};

export default MessagePanel;