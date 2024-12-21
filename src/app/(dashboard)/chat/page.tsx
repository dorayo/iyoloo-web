"use client";
import React, { useEffect, useState, useMemo } from "react";





import NavigationSidebar from "@/components/chat/NavigationSidebar";
import MessagePanel from "@/components/chat/MessagePanel";
import FriendRequestList from "@/components/chat/FriendRequestList";
import NotificationsPanel from "@/components/chat/NotificationsPanel";
import AnnouncementPanel from "@/components/chat/AnnouncementPanel";
import CustomerChatPanel from "@/components/chat/CustomerChatPanel";
import UserChatPanel from "@/components/chat/UserChatPanel";
import ContactPanel from "@/components/chat/ContactPanel";
import {
  type Conversation,
  type PanelType,
} from "~/types/chatType";

import { useEasemob } from "~/providers/EasemobProvider";
import { api } from "~/trpc/react";

interface UserSession {
  id?: number;
  nickname?: string | null; // 允许 null
  avatar?: string | null;   // 允许 null
  imAccount?: string;
  onlineState?: number;
  vipLevel?: number;
  language?: string | null; // 允许 null
  region?: string | null;   // 允许 null
}

const mergeConversationsWithUsers = (
  conversations: Conversation[],
  userSessions: UserSession[],
) => {
  console.log("Conversations:", conversations, userSessions);
  return conversations
    .map((conv) => {
      const pattern = /(\_)(.+)(\@)/;
      const matches = conv?.conversationId?.match(pattern);
      const imAccount = matches?.[0]?.replace("_", "").replace("@", "") ?? null;
      const userInfo = userSessions.find((u) => u.imAccount === imAccount);

      const lastMessage = conv.lastMessage && {
        content: conv.lastMessage.msg,
        time: conv.lastMessage.time,
        type: conv.lastMessage.type,
        translation: conv.lastMessage?.translation,
        status: conv.lastMessage.status,
      };

      return {
        conversationId: imAccount,
        imAccount: imAccount,
        type: "singleChat",
        unreadCount: conv?.unread_num || 0,
        lastMessage,
        userId: userInfo?.id,
        name: userInfo?.nickname,
        avatar: userInfo?.avatar,
        onlineState: userInfo?.onlineState,
        vipLevel: userInfo?.vipLevel,
        language: userInfo?.language,
        region: userInfo?.region,
        timestamp: lastMessage?.time || Date.now(),
      } as Conversation;
    })
    .filter(Boolean)
    .sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));
};

// MainDialog Component Update
const MainDialog: React.FC = () => {
  // chatUser?: {
  //   id: string;
  //   name: string;
  //   avatar: string;
  // };

  const [activePanel, setActivePanel] = React.useState("requests");
  const [selectedUser, setSelectedUser] = React.useState<Conversation | null>(
    null,
  );
  const [activeBar, setActiveBar] = React.useState(0);

  const { isConnected, conversations, refreshConversations } = useEasemob();
  const [conversationsList, setConversationsList] = useState<Conversation[]>([]);

  useEffect(() => {
    if (isConnected) {
      refreshConversations();
    }
  }, [isConnected]);

  // Extract IM accounts and fetch user info
  const imAccounts = useMemo(() => {
    return conversations
      .map((conv) => {
        const pattern = /(\_)(.+)(\@)/;
        const matches = conv?.conversationId?.match(pattern);
        return matches?.[0]?.replace("_", "").replace("@", "") ?? null;
      })
      .filter((a) => a != "iyolooservice001")
      .filter(Boolean) as string[]

    }, [conversations]);

  const { data: userSessions, isLoading: isLoadingUsers } =
    api.chat.getSessionUsers.useQuery(
      { imAccounts },
      {
        enabled: imAccounts.length > 0,
      },
    );

  // Process conversations when user data is available
  useEffect(() => {
    console.log("Processing conversations...", userSessions);
    if (!userSessions || !conversations.length) return;

    const conversationsList = mergeConversationsWithUsers(
      conversations,
      userSessions,
    );
    console.log("Processed conversations:", conversationsList);
    setConversationsList(conversationsList);
  }, [conversations, userSessions]);

  const refreshList = () => {
    refreshConversations();
  };

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  const handleAccept = (id: number) => {
    console.log("Accept request:", id);
  };

  const handleReject = (id: number) => {
    console.log("Reject request:", id);
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case "requests":
        return (
          <FriendRequestList
            onAccept={handleAccept}
            onReject={handleReject}
            onClose={onClose}
          />
        );
      case "notifications":
        return <NotificationsPanel onClose={onClose} />;
      case "announcements":
        return <AnnouncementPanel onClose={onClose} />;
      case "customerService":
        return <CustomerChatPanel onClose={onClose} />;
      case "chat":
        if (!selectedUser) return null;
        return (
          <UserChatPanel
            onClose={onClose}
            otherUser={selectedUser}
            onRefresh={refreshList}
          />
        );
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
    console.log("Change to panel:", panel);
    setActivePanel(panel);
    setSelectedUser(null);
    renderActivePanel();
  };

  const onClose = () => {
    // Close the dialog
    window.history.back();
  };

  const handleUserClick = (msg: Conversation) => {
    setSelectedUser(msg);
    setActivePanel("chat");
    renderActivePanel();
  };

  const handleNavClick = (index: number) => {
    setActiveBar(index);
  };

  const handleChatStart = (msg: any) => {
    setActiveBar(0);
    msg = {
      ...msg,
      imAccount: "iyoloo" + msg.account,
      userId: msg.id,
      name: msg.nickname,
    };
    setSelectedUser(msg);
    handleUserClick(msg);
    if (
      conversationsList.filter((a) => a?.imAccount == msg.imAccount).length == 0
    ) {
      conversationsList.unshift(msg);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="flex h-[653px] w-[870px] overflow-hidden rounded-lg bg-[#D5D4EE]">
        <NavigationSidebar
          activeBar={activeBar}
          onNavigationClick={handleNavClick}
        />
        {activeBar === 0 ? (
          <MessagePanel
            messages={conversationsList}
            onSearch={handleSearch}
            onPanelChange={handlePanelChange}
            activePanel={activePanel}
            onMessageClick={handleUserClick}
            activeMessage={selectedUser}
          />
        ) : (
          <ContactPanel onClose={onClose} onChatStart={handleChatStart} />
        )}
        {activeBar === 0 && renderActivePanel()}
      </div>
    </div>
  );
};

export default MainDialog;
