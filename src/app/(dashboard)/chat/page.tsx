'use client';
import React, { useState } from 'react';
import { Search, X, Circle, Send, Image,Smile,
  Gift,
  Camera,
  ChevronDown } from 'lucide-react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import NavigationSidebar from '@/components/chat/NavigationSidebar'
import MessagePanel from '@/components/chat/MessagePanel'
import FriendRequestList from '@/components/chat/FriendRequestList'
import NotificationsPanel from '@/components/chat/NotificationsPanel'
import AnnouncementPanel from '@/components/chat/AnnouncementPanel'
import CustomerChatPanel from '@/components/chat/CustomerChatPanel'
import UserChatPanel from '@/components/chat/UserChatPanel'
import ContactPanel from '@/components/chat/ContactPanel'
import { ChatMessage,FriendRequest,Announcement,Notification,PanelType } from '@/lib/chatType';



// MainDialog Component Update
const MainDialog: React.FC = () => {
  // chatUser?: {
  //   id: string;
  //   name: string;
  //   avatar: string;
  // };

  const [activePanel, setActivePanel] = React.useState('requests');
  const [selectedUser, setSelectedUser] = React.useState<ChatMessage | null>(null);  
  const [activeBar, setActiveBar] = React.useState(0);

  const [messages] = React.useState<ChatMessage[]>([
    {
      id: 1,
      avatar: '/images/9c0e2873e9abde3d76ee276194dc6409.png',
      name: 'Lisa',
      message: '自定义设置一下自定义设置一下',
      online: true,
      unread: 1
    },
    // ... other messages
  ]);
    

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const handleAccept = (id: number) => {
    console.log('Accept request:', id);
  };

  const handleReject = (id: number) => {
    console.log('Reject request:', id);
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'requests':
        return (
          <FriendRequestList
            onAccept={handleAccept}
            onReject={handleReject}
            onClose={onClose}
          />
        );
      case 'notifications':
        return (
          <NotificationsPanel
            onClose={onClose}
          />
        );
      case 'announcements':
        return (
          <AnnouncementPanel
            onClose={onClose}
          />
        );
      case 'customerService':
        return <CustomerChatPanel onClose={onClose} />;
      case 'chat':
        if (!selectedUser) return null;
        const user ={
          id: selectedUser?.id.toString(),
          name: selectedUser?.name,
          avatar: selectedUser?.avatar
        }
        return <UserChatPanel onClose={onClose} otherUser={user} />;
      default:
        return (
          <FriendRequestList
            onAccept={handleAccept}
            onReject={handleReject}
            onClose={onClose}
          />
        );
    }
  };

  const handlePanelChange = (panel: PanelType) => {
    // You might want to lift this state up to parent component
    console.log('Change to panel:', panel);
    setActivePanel(panel);
    setSelectedUser(null);
    renderActivePanel()
  };

  const onClose = () => {
    // Close the dialog
    window.history.back();
  };

  const handleUserClick = (msg: ChatMessage) => {
    setSelectedUser(msg);
    setActivePanel('chat');
    renderActivePanel()
  };

  const handleNavClick = (index: number)=>{
    setActiveBar(index);
  }

  const handleChatStart = () => {
    // setSelectedUser(msg);
    // setActivePanel('chat');
    // renderActivePanel()
  };

  const handleViewProfile = () => {
  };

  const handleSendGift = () => { };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[870px] h-[653px] bg-[#D5D4EE] rounded-lg flex overflow-hidden">
        <NavigationSidebar activeBar={activeBar} onNavigationClick={handleNavClick} />
        {activeBar === 0?
              <MessagePanel messages={messages} onSearch={handleSearch} 
              onPanelChange={handlePanelChange} activePanel={activePanel} 
              onMessageClick={handleUserClick} activeMessage={selectedUser} />
        :
          <ContactPanel onClose={onClose} onChatStart={handleChatStart} onViewProfile={handleViewProfile} onSendGift={handleSendGift} />
        }
          {activeBar === 0 && renderActivePanel()}
      </div>
    </div>
  );
};

export default MainDialog;