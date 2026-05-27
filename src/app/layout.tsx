import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
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
    <html lang="zh-CN">
      <body>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
