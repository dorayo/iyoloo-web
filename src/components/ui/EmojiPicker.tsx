// Import at the top of your file
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Emoji mapping (you can put this in a separate file)
const emojis = {
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
  // ... add more emojis as needed
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-lg p-2 hover:bg-[#9997C5]/20">
          <Smile className="h-5 w-5 text-gray-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="mb-2 w-[280px] p-2"
        sideOffset={10}
      >
        <div className="grid grid-cols-8 gap-1">
          {Object.entries(emojis).map(([code, src]) => (
            <button
              key={code}
              className="rounded p-1 hover:bg-[#9997C5]/20"
              onClick={() => onEmojiSelect(code)}
            >
              <img src={"/faces/" + src} alt={code} className="h-6 w-6" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
