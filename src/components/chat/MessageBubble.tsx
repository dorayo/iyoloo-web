"use client";
import { cn, formatTime } from "~/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { Message, Conversation } from "~/types/chatType";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MessageBubbleProps {
  message: Message;
  otherUser: Conversation;
  currentUser: any;
}

// Emoji mapping object
const emojiMap = {
  "[):]": "ee_1.png",
  "[:D]": "ee_2.png",
  "[;)]": "ee_3.png",
  "[:-o]": "ee_4.png",
  "[:p]": "ee_5.png",
  "[(H)]": "ee_6.png",
  "[:@]": "ee_7.png",
  "[:s]": "ee_8.png",
  "[:$]": "ee_9.png",
  "[:(]": "ee_10.png",
  "[:'(]": "ee_11.png",
  "[:|]": "ee_18.png",
  "[(a)]": "ee_13.png",
  "[8o|]": "ee_14.png",
  "[8-|]": "ee_15.png",
  "[+o(]": "ee_16.png",
  "[<o)]": "ee_12.png",
  "[|-)]": "ee_17.png",
  "[*-)]": "ee_19.png",
  "[:-#]": "ee_20.png",
  "[:-*]": "ee_22.png",
  "[^o)]": "ee_21.png",
  "[8-)]": "ee_23.png",
  "[(|)]": "ee_24.png",
  "[(u)]": "ee_25.png",
  "[(S)]": "ee_26.png",
  "[(*)]": "ee_27.png",
  "[(#)]": "ee_28.png",
  "[(R)]": "ee_29.png",
  "[({)]": "ee_30.png",
  "[(})]": "ee_31.png",
  "[(k)]": "ee_32.png",
  "[(F)]": "ee_33.png",
  "[(W)]": "ee_34.png",
  "[(D)]": "ee_35.png",
  // Add other emoji mappings...
};

export const MessageBubble = ({
  message,
  otherUser,
  currentUser,
}: MessageBubbleProps) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const isUserMessage = message.from != otherUser.imAccount;

  // Render emoji in text
  const renderTxt = (text = "") => {
    const parts: string[] = [];
    let start = 0;
    const regex = /(\[.*?\])/g;
    let match;

    while ((match = regex.exec(text))) {
      const index = match.index;
      if (index > start) {
        parts.push(text.substring(start, index));
      }

      // Convert emoji code to image if it exists in mapping
      if (match[1] in emojiMap) {
        parts.push(
          `<img src="https://file.iyoloo.net/emoji/${emojiMap[match[1]]}" style="width:20px; display:inline-block; vertical-align:middle"/>`,
        );
      } else {
        parts.push(match[1]);
      }
      start = index + match[1].length;
    }

    parts.push(text.substring(start));
    return <div dangerouslySetInnerHTML={{ __html: parts.join("") }} />;
  };

  return (
    <>
      <div className="my-4 text-center">
        <span className="text-xs text-gray-400">
          {formatTime(message.time!)}
        </span>
      </div>
      <div
        className={cn(
          "mb-4 flex items-start gap-3",
          isUserMessage ? "flex-row-reverse" : "flex-row",
        )}
      >
        <Avatar className="h-[42px] w-[42px]">
          <AvatarImage
            src={isUserMessage ? currentUser.avatar : otherUser.avatar}
            alt="avatar"
          />
        </Avatar>

        {/* Text Message */}
        {message.type === "txt" && (
          <div
            className={cn(
              "max-w-[60%] rounded-lg px-4 py-2",
              isUserMessage
                ? "rounded-tr-none bg-[#2D1B69] text-white"
                : "rounded-tl-none bg-white text-[#2D1B69]",
            )}
          >
            {renderTxt(message.msg)}
            {message.ext?.translation && (
              <div
                className={cn(
                  "mt-2 border-t border-white/10 pt-2 text-sm",
                  isUserMessage ? "text-white/70" : "text-gray-500",
                )}
              >
                {renderTxt(message.ext.translation)}
              </div>
            )}
          </div>
        )}

        {/* Image Message */}
        {message.type === "img" && (
          <>
            <div
              className="max-w-[200px] cursor-pointer"
              onClick={() => setShowImageDialog(true)}
            >
              <img
                src={message.url || message.msg}
                alt="message"
                className="h-auto w-full rounded-lg"
              />
            </div>

            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogContent className="max-w-[80vw] border-0 bg-transparent p-0">
                <img
                  src={message.url || message.msg}
                  alt="fullscreen"
                  className="h-auto w-full"
                />
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Gift Message */}
        {message.type === "custom" && message.ext?.type === "gift" && (
          <div className="h-auto w-[100px]">
            <img src={message.ext.url} alt="gift" className="h-auto w-full" />
          </div>
        )}
        {message.type === "custom" &&
          message.ext?.type === "burn-after-read" && (
            <div className="h-auto w-[100px]">
              <img
                src="/images/burn.png"
                alt="gift"
                className="h-auto w-full"
              />
            </div>
          )}

        {/* Red Packet Message */}
        {message.type === "custom" && message.ext?.type === "red-packet" && (
          <div className="w-[244px] rounded-lg bg-white shadow">
            <div className="flex items-center rounded-t-lg bg-[#fa9d3b] p-4">
              <img
                src="/images/7290811ab47f8a8663f1d797a1ace224.png"
                alt="red packet"
                className="h-12 w-12"
              />
              <div className="ml-3 text-white">
                <div>{message.ext?.note}</div>
                <div>{message.ext.amount} 金币</div>
              </div>
            </div>
            <div className="p-2 text-gray-600">
              {isUserMessage ? currentUser.name : otherUser.name}赠送
            </div>
          </div>
        )}
      </div>
    </>
  );
};
