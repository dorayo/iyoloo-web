'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { MessageInputProps } from '@/lib/chatType'

export const MessageInput = ({
  value,
  onChange,
  onSend,
  placeholder = "请输入...",
  multiline = false,
  className
}: MessageInputProps) => {
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
        placeholder={placeholder}
        className={cn(
          "bg-[#9997C5]/30 border-[#9997C5]/50 text-gray-800 placeholder:text-gray-500",
          multiline && "min-h-[80px] py-2 resize-none",
          className
        )}
        multiline={multiline}
      />
      <Button
        onClick={onSend}
        className="bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] text-white hover:opacity-90"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};