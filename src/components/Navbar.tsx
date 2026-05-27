"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

const navLinks = [
  { name: "首页", href: "/" },
  { name: "院校库", href: "/schools" },
  { name: "AI智能定校", href: "/ai/school-match" },
  { name: "AI留学规划书", href: "/ai/study-plan" },
  { name: "AI面试官", href: "/ai/interview" },
  { name: "AI文书", href: "/ai" },
  { name: "关于我们", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favoriteCount } = useApp();

  // 高亮判断逻辑
  const isActiveLink = (href: string) => {
    if (href === '/ai/school-match') {
      return pathname === '/ai/school-match';
    }
    if (href === '/ai/interview') {
      return pathname === '/ai/interview';
    }
    if (href === '/ai/study-plan') {
      return pathname.startsWith('/ai/study-plan');
    }
    if (href === '/ai') {
      // /ai 或以 /ai/resume、/ai/ps、/ai/recommendation-letter、/ai/motivation-letter、/ai/essay 开头
      return pathname === '/ai' ||
        pathname.startsWith('/ai/resume') ||
        pathname.startsWith('/ai/ps') ||
        pathname.startsWith('/ai/recommendation-letter') ||
        pathname.startsWith('/ai/motivation-letter') ||
        pathname.startsWith('/ai/essay');
    }
    return pathname === href;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo 区域 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">留</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-800">留学Hub | 九万里AI</span>
              </div>
            </Link>
          </div>

          {/* 桌面端导航 */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveLink(link.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 右侧功能区 */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* 收藏图标 */}
            <Link
              href="/favorites"
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </Link>

            {/* 登录按钮 */}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              登录
            </button>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center lg:hidden">
            <Link
              href="/favorites"
              className="relative p-2 mr-2 text-gray-600 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100"
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

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium ${
                    isActiveLink(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  登录
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
