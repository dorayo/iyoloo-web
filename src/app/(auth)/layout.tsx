'use client'
// import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import Navigation from "../(marketing)/_components/layout/Navigation";
import Footer from "../(marketing)/_components/layout/Footer";
import { Toaster } from "@/components/ui/toaster"
import { useAuth, useUser } from '@clerk/nextjs'
import { PropsWithChildren,useEffect,useState } from 'react';
import { api } from '~/trpc/react'
import { useUserStore } from '~/store/user'
import { useRouter } from 'next/navigation'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter()
  const { userId } = useAuth()
  
  // Get current user info
  const { data: userInfo, isLoading } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!userId, // Only run query if we have a userId
  })

  useEffect(() => {
    if (isLoading || !userId) return

    // If user has completed info, redirect to dashboard
    if (userInfo?.userInfo.gender && userInfo?.language && userInfo?.userInfo.birthday) {
      router.push('/homepage?id=' + userInfo.id)
    }
  }, [userInfo, isLoading, userId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
      <main className=" min-h-screen bg-[#2D1B69] pt-40">
        <Navigation />
        {/* Auth Form Container */}
        
            {children}
        <Footer />
        <Toaster />
      </main>
  );
}