"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import {
  type Message,
  type Conversation,
} from "~/types/chatType";

// 动态导入环信SDK，避免服务端渲染问题
let WebIM: any;
if (typeof window !== "undefined") {
  WebIM = require("easemob-websdk").default;
  WebIM.config = {
    socketServer:
      (window.location.protocol === "https:" ? "https:" : "http:") +
      "//im-api-v2.easemob.com",

    restServer:
      (window.location.protocol === "https:" ? "https:" : "http:") +
      "//a1.easemob.com",

    appkey: "1130220622140887#iyoloo", //正式
    // appkey: '1130220622140887#demo', // 测试
    Host: "easemob.com",

    https: true,

    isHttpDNS: true,

    isMultiLoginSessions: true,

    isSandBox: true, //内部测试环境，集成时设为false

    isDebug: true,

    autoReconnectNumMax: 10,

    isWebRTC:
      window.RTCPeerConnection && /^https\:$/.test(window.location.protocol),

    useOwnUploadFun: false,
    /**
     *  cn: chinese
     *  us: english
     */
    i18n: "cn",

    isAutoLogin: false,

    p2pMessageCacheSize: 500,

    delivery: true,

    groupMessageCacheSize: 200,

    loglevel: "ERROR",

    enableLocalStorage: true,

    deviceId: "webim",

    AgoraAppId: "15cb0d28b87b425ea613fc46f7c9f974",
  };
}

interface EasemobContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  currentConversation: string | null;
  messages: Message[];
  conversations: Conversation[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshConversations: () => Promise<void>;
  setCurrentConversation: (conversationId: string | null) => void;
  sendMessage: (
    to: string,
    content: string,
    type: string,
    ext?: any,
  ) => Promise<void>;
  sendImage: (to: string, file: File) => Promise<void>;
  loadHistoryMessages: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  markMessageAsRead: (messageId: string, from: string) => Promise<void>;
}

const EasemobContext = createContext<EasemobContextType | null>(null);

export function EasemobProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [conn, setConn] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // 获取用户信息
  const { data: currentUser } = api.user.getCurrentUser.useQuery();

  // 初始化环信连接
  useEffect(() => {
    if (!userId || !currentUser || typeof window === "undefined") return;

    const initEasemob = async () => {
      try {
        // 创建连接实例
        const connection = new WebIM.connection({
          appKey: process.env.NEXT_PUBLIC_EASEMOB_APP_KEY,
          url: "wss://im-api-wechat.easemob.com/websocket",
          apiUrl: "https://a1.easemob.com",
          heartBeatWait: 30000,
          autoReconnectNumMax: 5,
          delivery: true,
        });

        connection.addEventHandler("messageHandler", {
          onConnected: () => {
            setIsConnected(true);
            setIsLoading(false);
          },
          onDisconnected: () => {
            setIsConnected(false);
            handleReconnect();
          },
          onTextMessage: (message: any) => {
            handleNewMessage(message);
          },
          onError: (error: any) => {
            setError(error.message || "Connection error");
            handleError(error);
          },
        });

        setConn(connection);

        // 登录
        await connection.open({
          user: "iyoloo" + currentUser.account,
          pwd: currentUser.password,
        });
      } catch (error: any) {
        console.error("Easemob initialization failed:", error);
        setError(error.message || "Failed to initialize chat");
        setIsLoading(false);
      }
    };

    initEasemob();

    // return () => {
    //   if (conn) {
    //     conn.close();
    //   }
    // };
  }, [userId, currentUser]);

  // 登录
  const login = async (username: string, password: string) => {
    if (!conn) throw new Error("Connection not initialized");

    try {
      await conn.open({
        user: username,
        pwd: password,
      });
    } catch (error: any) {
      setError(error.message || "Login failed");
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    if (!conn) return;
    await conn.close();
    setIsConnected(false);
    setMessages([]);
    setConversations([]);
    setCurrentConversation(null);
  };

  // 获取会话列表
  const refreshConversations = async () => {
    if (!conn || !isConnected) {
      throw new Error("Not connected to chat service");
    }

    try {
      const result = await conn.getConversationlist({
        pageNum: 1,
        pageSize: 20,
        needLastMessage: true,
      });

      const formattedConversations =
        result.data?.channel_infos.map((conv: any) => ({
          conversationId: conv.channel_id,
          type: "singleChat",
          unreadCount: conv.unread_num || 0,
          lastMessage: conv.lastMessage && {
            id: conv.lastMessage.id,
            type: conv.lastMessage.type,
            msg: conv.lastMessage.msg,
            time: conv.lastMessage.time,
            status: conv.lastMessage.status,
          },
          timestamp: conv.lastMessage?.time || Date.now(),
        })) || [];

      setConversations(
        formattedConversations.sort((a, b) => b.timestamp - a.timestamp),
      );
    } catch (error) {
      console.error("Failed to get conversation list:", error);
      throw error;
    }
  };

  // providers/EasemobProvider.tsx 中的消息发送方法需要修改：

  // 在 EasemobProvider 中添加或修改 sendMessage 方法 // 发送消息
  const sendMessage = async (
    to: string,
    content: string,
    type = "txt",
    ext?: any,
  ) => {
    if (!conn || !isConnected) {
      throw new Error("Not connected to chat service");
    }
    try {
      const option = {
        type: type,
        msg: content,
        to: to,
        chatType: "singleChat",
        ext: ext,
        customExts: ext,
      };
      console.log("Sending message:", option);
      const msgObj = WebIM.message.create(option);
      const result = await conn.send(msgObj);
      handleNewMessage({
        id: msgObj.id,
        to: to,
        msg: content,
        type: type,
        ext: ext,
        time: Date.now(),
        status: "sent",
      });

      return result;
    } catch (error) {
      console.error("Send message failed:", error);
      handleMessageFailed(error);
      throw error;
    }
  };

  // 发送图片
  const sendImage = async (to: string, file: File) => {
    if (!conn || !isConnected) {
      throw new Error("Not connected to chat service");
    }

    const allowType = ["jpg", "gif", "png", "bmp", "jpeg"];
    const fileType = file.type.split("/")[1];

    if (!allowType.includes(fileType)) {
      throw new Error("Unsupported image type");
    }
    console.log("222222", file);
    const file1 = {
      data: file, //file 对象。
      filename: file.name, //文件名称。
      filetype: file.type, //文件类型。
    };
    try {
      const option = {
        type: "img",
        file: file1,
        to: to,
        chatType: "singleChat",
        platform: "Web",
        onFileUploadProgress: (progress: number) => {
          console.log("Upload progress:", progress);
        },
      };

      const msgObj = WebIM.message.create(option);
      const result = await conn.send(msgObj);
      handleNewMessage({
        id: msgObj.id,
        to: to,
        type: "img",
        url: URL.createObjectURL(file),
        time: Date.now(),
        status: "sent",
      });

      return result;
    } catch (error) {
      console.error("Send image failed:", error);
      handleMessageFailed(error);
      throw error;
    }
  };

  // 加载历史消息
  const loadHistoryMessages = async (conversationId: string) => {
    if (!conn || !isConnected) {
      throw new Error("Not connected to chat service");
    }

    try {
      const response = await conn.getHistoryMessages({
        targetId: conversationId,
        pageSize: 20,
        chatType: "singleChat",
      });

      console.log("History messages:", response);
      const messages = response.messages.filter((e) => e.type != "cmd");
      const sortedMessages = messages.sort((a, b) => a.time - b.time);
      const formattedMessages =
        sortedMessages?.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.time).getTime(),
        })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to load history:", error);
      throw error;
    }
  };

  // 标记消息已读
  const markMessageAsRead = async (messageId: string, from: string) => {
    try {
      await conn.read({
        messageId: messageId,
        from: from,
      });

      setMessages((prev) => {
        return prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "read" } : msg,
        );
      });
    } catch (error) {
      console.error("Mark as read failed:", error);
      throw error;
    }
  };

  // 删除会话
  const deleteConversation = async (conversationId: string) => {
    try {
      await conn.deleteConversation({
        channel: conversationId,
        chatType: "singleChat",
        deleteRoam: true,
      });

      setConversations((prev) =>
        prev.filter((conv) => conv.conversationId !== conversationId),
      );

      setMessages((prev) => prev.filter((msg) => msg.to !== conversationId));
    } catch (error) {
      console.error("Delete conversation failed:", error);
      throw error;
    }
  };

  // 处理新消息
  const handleNewMessage = (message: Message) => {
    setMessages((prev) => {
      const existingIndex = prev.findIndex((msg) => msg.id === message.id);
      if (existingIndex > -1) {
        return prev;
      }
      return [...prev, message];
    });
    updateConversationList(message);
  };

  // 更新会话列表
  const updateConversationList = (message: Message) => {
    setConversations((prev) => {
      const existingIndex = prev.findIndex(
        (conv) => conv.conversationId === message.to,
      );
      const newConversation = {
        conversationId: message.to,
        type: "singleChat",
        unreadCount: 0,
        lastMessage: message,
        timestamp: message.time,
      };

      if (existingIndex > -1) {
        const newConversations = [...prev];
        newConversations[existingIndex] = {
          ...newConversations[existingIndex],
          lastMessage: message,
          timestamp: message.time,
        };
        return newConversations;
      }

      return [...prev, newConversation];
    });
  };

  // 错误处理
  const handleError = (error: any) => {
    if (error.type === "socket_error") {
      handleReconnect();
    }
  };

  // 重连机制
  const handleReconnect = async () => {
    if (!conn) return;

    try {
      await conn.reconnect();
    } catch (error) {
      console.error("Reconnect failed:", error);
      setTimeout(handleReconnect, 3000);
    }
  };

  // 处理消息发送失败
  const handleMessageFailed = (error: any) => {
    if (error.type === 502) {
      const data = JSON.parse(error.message);
      if (data.code === 105) {
        setError("Insufficient balance");
      }
    } else if (error.type === 39) {
      setError("Logged in on another device");
    } else {
      setError(error.message || "Failed to send message");
    }
  };

  const contextValue: EasemobContextType = {
    isConnected,
    isLoading,
    error,
    currentConversation,
    messages,
    conversations,
    login,
    logout,
    refreshConversations,
    setCurrentConversation,
    sendMessage,
    sendImage,
    loadHistoryMessages,
    deleteConversation,
    markMessageAsRead,
  };

  return (
    <EasemobContext.Provider value={contextValue}>
      {children}
    </EasemobContext.Provider>
  );
}

export const useEasemob = () => {
  const context = useContext(EasemobContext);
  if (!context) {
    throw new Error("useEasemob must be used within an EasemobProvider");
  }
  return context;
};
