'use client'
import React, { useState, useMemo } from 'react';
import { X, ChevronDown, Search, Filter } from 'lucide-react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { api } from "~/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

interface ContactsPanelProps {
  onClose: () => void;
  onChatStart?: (contact: any) => void;
  onViewProfile?: (contact: any) => void;
  onSendGift?: (contact: any) => void;
}

const filterOptions = [
  { value: 'all', label: '全部好友' },
  { value: 'online', label: '在线好友' },
  { value: 'vip', label: 'VIP好友' },
  { value: 'svip', label: 'SVIP好友' }
];

const ContactsPanel: React.FC<ContactsPanelProps> = ({
  onClose,
  onChatStart,
  onViewProfile,
  onSendGift
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const router = useRouter();
  const { 
    data: friendData, 
    isLoading, 
    error 
  } = api.relation.getFriendList.useQuery({
    page: 1,
    pageSize: 50
  });

  // 过滤和搜索好友列表
  const filteredFriends = useMemo(() => {
    if (!friendData?.friends) return [];

    return friendData.friends.filter(friend => {
      const nameMatch = friend?.friendUser?.nickname?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 根据筛选条件过滤
      const typeMatch = filterType === 'all' || 
        (filterType === 'online' && friend?.friendUser?.onlineState === 1) ||
        (filterType === 'vip' && friend?.friendUser?.userAccount?.vipLevel === 1) ||
        (filterType === 'svip' && friend?.friendUser?.userAccount?.vipLevel === 2);

      return nameMatch && typeMatch;
    });
  }, [friendData, searchTerm, filterType]);

  // 处理加载和错误状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p>加载好友列表...</p>
      </div>
    );
  }

  if (error) {
    toast({
      title: "加载失败",
      description: "无法获取好友列表，请稍后重试",
      variant: "destructive"
    });

    return (
      <div className="flex items-center justify-center h-full w-full">
        <p>加载好友列表出错</p>
      </div>
    );
  }

  // 处理好友列表为空的情况
  if (!friendData?.friends || friendData.friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
        <p className="text-gray-500 mb-4">您还没有好友，快去添加吧！</p>
        {/* <Button 
          variant="outline" 
        >
          添加好友
        </Button> */}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#D5D4EE] h-full flex">
      {/* 联系人列表 */}
      <div className="w-[250px] bg-[#9997C5]/50 h-full flex flex-col">
        {/* 搜索和筛选区域 */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Input 
              placeholder="搜索好友" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/20 border-[#9996C4] text-[#9996C4] placeholder:text-[#9996C4]"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#9996C4]" />
          </div>
        </div>

        {/* 好友列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.map((contact) => (
            <div
              key={contact?.friendUser?.id}
              className={`p-3 flex items-center hover:bg-[#9997C5]/30 cursor-pointer 
                ${selectedContact?.friendUser.id === contact?.friendUser?.id ? 'bg-[#9997C5]/30' : ''}`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="relative">
                <Avatar className="h-[45px] w-[45px]">
                  <AvatarImage 
                    src={contact?.friendUser?.avatar || '/default-avatar.png'} 
                  />
                </Avatar>
                {contact?.friendUser?.onlineState === 1 && (
                  <div className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 bg-[#38B865] rounded-full" />
                )}
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <span className="text-gray-800 font-medium">
                    {contact?.friendUser?.nickname}
                  </span>
                  {contact?.friendUser?.userAccount?.vipLevel === 1 && (
                    <div className="ml-2 px-2 py-0.5 bg-gray-600 rounded-full text-xs font-bold">
                      VIP
                    </div>
                  )}
                  {contact?.friendUser?.userAccount?.vipLevel === 2 && (
                    <div className="ml-2 px-2 py-0.5 bg-yellow-400 rounded-full text-xs font-bold">
                      SVIP
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {contact.remarkName?.friendRemarkName || contact?.friendUser?.regionName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 好友详情 */}
      {selectedContact && (
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-medium text-gray-800">通讯录</h2>
            <button onClick={onClose} className="hover:bg-gray-100/20 p-1 rounded-full">
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          {/* 好友信息 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-[126px] w-[126px] border-[3px] border-yellow-400">
                <AvatarImage 
                  src={selectedContact.friendUser.avatar || '/default-avatar.png'} 
                  alt={selectedContact.friendUser.nickname} 
                />
              </Avatar>
              {selectedContact.friendUser.userAccount?.vipLevel === 1 && (
                <div className="absolute -right-2 -bottom-1 px-3 py-1 bg-gray-600 rounded-full">
                  <span className="text-xs font-bold">VIP</span>
                </div>
              )}
              {selectedContact.friendUser.userAccount?.vipLevel === 2 && (
                <div className="absolute -right-2 -bottom-1 px-3 py-1 bg-yellow-400 rounded-full">
                  <span className="text-xs font-bold">SVIP</span>
                </div>
              )}
            </div>

            <h3 className="mt-4 text-xl font-bold">
              {selectedContact.friendUser.nickname}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              ID：{selectedContact.friendUser.account}
            </p>
            
            <div className="flex gap-4 mt-4">
              <span className="text-sm text-gray-600">
                {selectedContact.friendUser.regionName}
              </span>
              <span className="text-sm text-gray-600">
                {selectedContact.friendUser.languageName}
              </span>
              {selectedContact.friendUser.onlineState === 1 && (
                <span className="text-sm text-green-600">在线</span>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                className="bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90"
                onClick={() => onSendGift?.(selectedContact.friendUser)}
              >
                送金币
              </Button>
              <Button 
                className="bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                onClick={() => {
                  router.push(`/homepage?id=${selectedContact.friendUser.id}`);
                }}
              >
                进入主页
              </Button>
              <Button
                className="bg-[#4F46E5]/10 px-3"
                onClick={() => onChatStart?.(selectedContact.friendUser)}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 fill-current text-[#4F46E5]"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPanel;