"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { type MessageInputProps } from "~/types/chatType";

export const MessageInput = ({
  value,
  onChange,
  onSend,
  placeholder = "请输入...",
  multiline = false,
  className,
}: MessageInputProps) => {
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
        placeholder={placeholder}
        className={cn(
          "border-[#9997C5]/50 bg-[#9997C5]/30 text-gray-800 placeholder:text-gray-500",
          multiline && "min-h-[80px] resize-none py-2",
          className,
        )}
      />
      <Button
        onClick={onSend}
        className="bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] text-white hover:opacity-90"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
