"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Program } from "@/types";
import { FAVORITES_UPDATED_EVENT, getFavorites } from "@/lib/storage";
import ProgramCard from "@/components/ProgramCard";

interface FavoritesClientProps {
  allPrograms: Program[];
}

export default function FavoritesClient({
  allPrograms,
}: FavoritesClientProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavoriteIds(getFavorites());
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = () => {
      setFavoriteIds(getFavorites());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(FAVORITES_UPDATED_EVENT, handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleStorageChange);
    };
  }, [mounted]);

  const favoritePrograms = allPrograms.filter((p) =>
    favoriteIds.includes(p.id)
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">选校清单</h1>
        <p className="text-textSecondary">
          已收藏 <span className="font-semibold text-primary">{favoritePrograms.length}</span> 个专业
        </p>
      </div>

      {favoritePrograms.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-text mb-2">选校清单为空</h2>
          <p className="text-textSecondary mb-6">
            去专业搜索页面找到感兴趣的专业并收藏它们吧
          </p>
          <Link
            href="/programs"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            浏览专业
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoritePrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}
