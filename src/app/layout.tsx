import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { PropsWithChildren } from "react";

// export const metadata = {
//   title: 'iyoloo - 遇见心灵伴侣',
//   description: '全球首个面向不婚主义者的高端社交平台，让每个人都能找到志同道合的伴侣，共创理想生活。',
// }

export const metadata = {
  title: 'iyoloo - Meet Your Soulmate',
  description: "The world's first premium social platform for those single by choice, designed to connect like-minded individuals and co-create their ideal lifestyle.",
}

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en" className={`${poppins.variable} ${notoSansSC.variable} ${notoSansJP.variable}`}>
//       <body className="min-h-screen bg-white font-sans">
//         <TRPCReactProvider>{children}</TRPCReactProvider>
//       </body>
//     </html>
//   );
// }

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden  bg-white font-sans">
        {children}
      </body>
    </html>
  );
}