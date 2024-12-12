// components/chat/UserChat.tsx

'use clinet'

import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Camera,
  Gift,
  Smile,
  ChevronDown 
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMessages } from '~/hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import type { Message, UserChatProps } from '~/lib/chatType';



const UserChatPanel: React.FC<UserChatProps> = ({ onClose, otherUser }) => {
  const { messages, addMessage } = useMessages();
  const [inputMessage, setInputMessage] = useState("");
  const [language, setLanguage] = useState("简体中文");

  // 发送消息
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      isUser: true,
      avatar: "/images/606d18e1ed6ef79895bd45fd7d384401.png",
      type: 'text'
    };

    addMessage(newMessage);
    setInputMessage("");
  };

  // 发送礼物
  const handleSendGift = () => {
    const giftMessage: Message = {
      id: Date.now(),
      content: "送出礼物",
      timestamp: new Date().toLocaleTimeString(),
      isUser: true,
      avatar: "/images/606d18e1ed6ef79895bd45fd7d384401.png",
      type: 'gift',
      giftAmount: 10
    };
    addMessage(giftMessage);
  };

  // 渲染礼物消息
  const renderGiftMessage = (message: Message) => (
    <div className="flex justify-center my-4">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <img
            src="/images/7290811ab47f8a8663f1d797a1ace224.png"
            alt="gift"
            className="w-8 h-8 mr-2"
          />
          <span>{message.giftAmount}金币</span>
        </div>
        <div className="text-yellow-800 text-sm">
          {message.isUser ? '你送出了礼物' : '收到礼物'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#D5D4EE] h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#9997C5]/20">
        <h2 className="text-base font-medium text-gray-800">{otherUser.name}</h2>
        <button onClick={onClose} className="hover:bg-gray-100/20 p-1 rounded-full">
          <X className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          message.type === 'gift' ? 
            renderGiftMessage(message) : 
            <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Toolbar and Input Area */}
      <div className="border-t border-[#9997C5]/20">
        {/* Toolbar */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-[#9997C5]/20 rounded-lg">
              <ImageIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-[#9997C5]/20 rounded-lg">
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              className="p-2 hover:bg-[#9997C5]/20 rounded-lg"
              onClick={handleSendGift}
            >
              <Gift className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-[#9997C5]/20 rounded-lg">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center px-3 py-1 text-[#9997C5] border border-[#9997C5]/50 rounded hover:bg-[#9997C5]/10">
                {language}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col">
                <button 
                  className="px-4 py-2 text-left hover:bg-gray-100 rounded"
                  onClick={() => setLanguage("简体中文")}
                >
                  简体中文
                </button>
                <button 
                  className="px-4 py-2 text-left hover:bg-gray-100 rounded"
                  onClick={() => setLanguage("English")}
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