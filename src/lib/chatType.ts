export interface  Announcement {
  id: number;
  icon: string;
  content: string;
  date: string;
  time: string;
};


export interface FriendRequest {
  id: number;
  avatar: string;
  name: string;
  timestamp: string;
};

export interface ChatMessage{
  id: number;
  avatar: string;
  name: string;
  message: string;
  online: boolean;
  unread: number;
};

export type MessageType = 'text' | 'image' | 'gift' | 'system';


export interface Message {
  id: number;
  content: string;
  timestamp: string;
  isUser: boolean;
  avatar: string;
  type: MessageType;
  giftAmount?: number;
}

export interface Notification {
  id: number;
  avatar: string;
  name: string;
  timestamp: string;
  date: string;
  type: 'like' | 'visit' | 'follow';
};

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}
 
export interface UserChatProps {
  onClose: () => void;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
  };
}

export type PanelType = 'messages' | 'requests' | 'notifications' | 'announcements' | 'customerService' | 'chat';
