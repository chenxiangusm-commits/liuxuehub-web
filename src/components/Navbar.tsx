"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { maskPhone } from "@/lib/auth";
import { useApp } from "@/context/AppContext";

const navLinks = [
  { name: "首页", href: "/" },
  { name: "院校库", href: "/schools" },
  { name: "AI智能定校", href: "/ai/school-match" },
  { name: "AI留学规划", href: "/ai/study-plan" },
  { name: "AI面试官", href: "/ai/interview" },
  { name: "AI文书", href: "/ai" },
  { name: "关于我们", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favoriteCount, user, logout } = useApp();

  const isActiveLink = (href: string) => {
    if (href === "/ai/school-match") return pathname === "/ai/school-match";
    if (href === "/ai/interview") return pathname === "/ai/interview";
    if (href === "/ai/study-plan") return pathname.startsWith("/ai/study-plan");
    if (href === "/ai") {
      return (
        pathname === "/ai" ||
        pathname.startsWith("/ai/resume") ||
        pathname.startsWith("/ai/ps") ||
        pathname.startsWith("/ai/recommendation-letter") ||
        pathname.startsWith("/ai/motivation-letter") ||
        pathname.startsWith("/ai/essay")
      );
    }
    return pathname === href;
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
                <span className="text-lg font-bold text-white">留</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-800">留学Hub | 九万里AI</span>
              </div>
            </Link>
          </div>

          <div className="hidden items-center space-x-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.name}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActiveLink(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center space-x-3 lg:flex">
            <Link
              href="/favorites"
              className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
              aria-label="查看收藏"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-2 py-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {user.loginMethod === "wechat" ? "微" : "用"}
                </div>
                <span className="max-w-32 truncate text-sm font-medium text-blue-700">
                  {user.phone ? maskPhone(user.phone) : user.nickname}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full px-2 py-1 text-xs font-medium text-blue-600 hover:bg-white"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                登录
              </Link>
            )}
          </div>

          <div className="flex items-center lg:hidden">
            <Link href="/favorites" className="relative mr-2 p-2 text-gray-600 hover:text-blue-600" aria-label="查看收藏">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              aria-label="打开导航菜单"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 lg:hidden">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    isActiveLink(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="space-y-3 px-4">
                    <div className="text-sm font-medium text-gray-700">
                      当前账号：{user.phone ? maskPhone(user.phone) : user.nickname}
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
                    >
                      退出登录
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    登录 / 注册
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
