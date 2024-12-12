import { cn } from "~/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { Message } from '@/lib/chatType';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUserMessage = message.isUser;

  return (
    <div
      className={cn(
        "flex items-start gap-3 mb-4",
        isUserMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-[42px] w-[42px]">
        <AvatarImage src={message.avatar} alt="avatar" />
      </Avatar>
      
      <div
        className={cn(
          "max-w-[60%] px-4 py-2 rounded-lg",
          isUserMessage
            ? "bg-[#2D1B69] text-white rounded-tr-none"
            : "bg-white text-[#2D1B69] rounded-tl-none"
        )}
      >
        {message.content}
      </div>
    </div>
  );
};
