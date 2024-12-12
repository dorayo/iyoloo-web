// components/chat/CustomerServiceChat.tsx
'use client'
import React, { useState } from 'react';
import { X, Image as ImageIcon, Smile } from 'lucide-react';
import { useMessages } from '~/hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import type { Message } from '~/lib/chatType';

interface CustomerServiceChatProps {
  onClose: () => void;
}

 const CustomerChatPanel: React.FC<CustomerServiceChatProps> = ({ onClose }) => {
  const { messages, addMessage } = useMessages();
  const [inputMessage, setInputMessage] = useState("");

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

    // 模拟客服回复
    setTimeout(() => {
      const response: Message = {
        id: Date.now() + 1,
        content: "您好，请问有什么可以帮助您的？",
        timestamp: new Date().toLocaleTimeString(),
        isUser: false,
        avatar: "/images/56c2a684a347508388305c5f51628b42.png",
        type: 'text'
      };
      addMessage(response);
    }, 1000);
  };

  return (
    <div className="flex-1 bg-[#D5D4EE] h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#9997C5]/20">
        <h2 className="text-base font-medium text-gray-800">专属客服</h2>
        <button onClick={onClose} className="hover:bg-gray-100/20 p-1 rounded-full">
          <X className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#9997C5]/20">
        <div className="mb-2">
          <button className="p-2 hover:bg-[#9997C5]/20 rounded-lg">
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-[#9997C5]/20 rounded-lg">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
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