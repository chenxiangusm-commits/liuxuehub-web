import {siteUrl} from "@/lib/site-url";
import type { Metadata } from "next";
import "./globals.css";
import CompareTray from "@/components/CompareTray";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "九万里留学库｜全球院校与硕士选校方案",
  description: "面向中国学生与留学顾问，查询招生批次、官网要求、申请参考与选校方案",
  keywords: "留学 院校库 硕士申请 QS排名 选校方案",
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
          <footer className="design-container py-6 text-xs text-gray-500"><div className="mb-3 flex flex-wrap gap-4"><a href="/about">九万里留学库</a><a href="/references">行业申请参考</a><a href="/favorites">我的清单</a><a href="/contact">联系顾问</a><span>www.liuxueku.cn</span></div><a href="/privacy" className="underline">数据使用说明</a> · <a href="/terms" className="underline">使用条款</a></footer>
        </AppProvider>
      </body>
    </html>
  );
}
