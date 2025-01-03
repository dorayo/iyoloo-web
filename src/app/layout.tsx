import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";
import { type PropsWithChildren } from "react";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { type Metadata } from "next";

// export const metadata = {
//   title: 'iyoloo - 遇见心灵伴侣',
//   description: '全球首个面向不婚主义者的高端社交平台，让每个人都能找到志同道合的伴侣，共创理想生活。',
// }

export const metadata: Metadata = {
  title: "iyoloo - Meet Your Soulmate",
  description:
    "The world's first premium social platform for those single by choice, designed to connect like-minded individuals and co-create their ideal lifestyle.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden font-sans">
        <div suppressHydrationWarning>
          <ClerkProvider dynamic={true}>
            <TRPCReactProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
            </TRPCReactProvider>
          </ClerkProvider>
        </div>
        <div id="clerk-captcha" />
      </body>
    </html>
  );
}

// 'use client'
