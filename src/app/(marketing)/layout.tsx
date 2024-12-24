"use client";
import { useUserStore } from "~/store/user";
import { useAuth } from "@clerk/nextjs";
import { type PropsWithChildren, useEffect, useState } from "react";
import { api } from "~/trpc/react";

export default function MarketingLayout({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);
  const { userId } = useAuth();
  console.log("layout", userId);
  const { data } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!userId && isClient, // 只在userId存在时查询
  });
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (data && isClient) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 服务端渲染时返回loading状态或基础UI
  if (!isClient) {
    return <div>{children}</div>;
  }

  return <main className="marketing-layout">{children}</main>;
}
