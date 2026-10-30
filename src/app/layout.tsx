import {siteUrl} from "@/lib/site-url";
import type { Metadata } from "next";
import "./globals.css";
import CompareTray from "@/components/CompareTray";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "留学Hub | 九万里AI 全球留学选校与AI申请平台",
  description: "全球院校数据库、AI选校、AI文书、AI面试训练平台",
  keywords: "留学 AI选校 QS大学 AI文书 AI面试",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProvider>
          <Navbar />
          {children}
          <CompareTray />
          <footer className="mx-auto max-w-7xl px-4 py-6 text-xs text-gray-500"><a href="/privacy" className="underline">数据使用说明</a> · <a href="/terms" className="underline">使用条款</a></footer>
        </AppProvider>
      </body>
    </html>
  );
}
