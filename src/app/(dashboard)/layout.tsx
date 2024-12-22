"use client";

import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import Sidebar from "@/components/dashboard/sidebar";

import { Toaster } from "@/components/ui/toaster";
import { EasemobProvider } from "~/providers/EasemobProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EasemobProvider>
      <div className="flex min-h-screen flex-col bg-[#2D1B69]">
        <Header />
        <main className="mt-20 flex flex-1 gap-5 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto w-full">
          <Sidebar />
          <div className="flex-1 min-w-0 overflow-auto">
            {children}
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </EasemobProvider>
  );
}
