export interface Announcement {
  id: number;
  icon: string;
  content: string;
  date: string;
  time: string;
}

export interface FriendRequest {
  id: number;
  avatar: string;
  name: string;
  timestamp: string;
}

export interface ChatMessage {
  id: number;
  avatar: string;
  name: string;
  message: string;
  online: boolean;
  unread: number;
}

// export interface Message {
//   id: number;
//   content: string;
//   timestamp: string;
//   isUser: boolean;
//   avatar: string;
//   type: MessageType;
//   giftAmount?: number;
// }

export interface Notification {
  id: number;
  avatar: string;
  name: string;
  timestamp: string;
  date: string;
  type: "like" | "visit" | "follow";
}

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

export type PanelType =
  | "messages"
  | "requests"
  | "notifications"
  | "announcements"
  | "customerService"
  | "chat";

export interface Message {
  id?: string;
  type?: string;
  from?: string;
  to?: string;
  msg?: string;
  url?: string;
  onlineState?: number;
  ext?: {
    note?: string;
    type?: string;
    url?: string;
    amount?: number;
    translation?: string;
    platform?: string;
  };
  status?: "sent" | "delivered" | "read" | "failed";
  time?: number;
  translation?:string;
}

export interface Conversation {
  conversationId?: string;
  imAccount?: string;
  unreadCount?: number;
  lastMessage?: Message;
  userId?: number;
  name?: string;
  avatar?: string;
  onlineState?: number;
  timestamp?: number;
  unread_num?: number;
}

export interface iUser {
  id?: string;
  name?: string;
  avatar?: string;
  account?: string;
  imAccount?: string;
  onlineState?: boolean;
  unreadCount?: number;
  timestamp?: number;
}
