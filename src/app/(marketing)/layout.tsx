"use client";
import { useUserStore } from "~/store/user";
import { useAuth,useUser } from "@clerk/nextjs";
import { type PropsWithChildren, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation'

export default function MarketingLayout({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);

  const { userId, isLoaded: isAuthLoaded } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()
  const setUser = useUserStore((state) => state.setUser)
  const router = useRouter()

  const { data:userData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!userId && isClient, // 只在userId存在时查询
  });

  useEffect(() => {
    if(userData){
      setUser(userData);
    }
  }, [userData, setUser, isClient,isAuthLoaded,isUserLoaded,router,user]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <main className="marketing-layout">{children}</main>;
}
