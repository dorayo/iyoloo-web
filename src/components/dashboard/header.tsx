"use client";

import { ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { UserButton } from "@clerk/nextjs";
import { LanguageSelect } from "@/components/ui/LanguageSelect";
import { useState } from "react";
export default function Header() {
  const [searchId, setSearchId] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const id = searchId.trim();
      if (id && /^\d+$/.test(id)) {
        // Validate numeric ID
        window.location.href = `/homepage?id=${id}`;
        setSearchId(""); // Clear input after search
      }
    }
  };

  return (
    <header className="bg-[#1E1247] px-[348px] py-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-poppins text-2xl font-bold tracking-tight text-white">
            iyoloo
          </span>
          <div className="ml-[172px] flex space-x-12">
            <a href="/meet" className="text-sm text-[#9996C4]">
              偶遇
            </a>
            {/* <span className="text-[#9996C4] text-sm">动态</span> */}
            <a href="/mall" className="text-sm text-[#9996C4]">
              商城
            </a>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center rounded border border-white/40 bg-white/10 px-1.5 py-1">
            <Input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="请输入您要搜索的用户ID"
              className="h-7 w-[200px] border-none bg-transparent text-xs text-[#BBBCBF] focus:outline-none"
            />
            <ChevronDown color="white" />
            {/* <img src="/api/placeholder/16/16" alt="search" className="ml-[85px]" /> */}
          </div>
          {/* <span className="ml-6 text-white text-sm">简体中文</span> */}
          <LanguageSelect />
          <img
            src="/images/be56af9852fa810252d998dfb0fa2a20.png"
            alt="lang"
            className="ml-1"
          />
          {/* <Bolt color="white" /> */}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
