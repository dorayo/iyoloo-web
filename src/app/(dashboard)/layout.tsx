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
        <main className="mt-20 flex-1">
          <div className="mx-auto max-w-[1920px] px-[30px]">
            <div className="flex gap-[20px] justify-center">
              <div className="w-[230px] flex-shrink-0">
                <Sidebar /> 
              </div>
              <div className="w-[980px]">
                {children}
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </EasemobProvider>
  );
}
