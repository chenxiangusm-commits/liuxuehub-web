"use client";

export const FAVORITES_KEY = "liuxuehub_favorites";
export const FAVORITES_UPDATED_EVENT = "favoritesUpdated";
const LEGACY_FAVORITES_KEY = "favorites";

function notifyFavoritesUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
}

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    const legacySaved = localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (legacySaved) {
      const legacyFavorites = JSON.parse(legacySaved);
      saveFavorites(legacyFavorites);
      localStorage.removeItem(LEGACY_FAVORITES_KEY);
      return legacyFavorites;
    }

    return [];
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    notifyFavoritesUpdated();
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

export function addFavorite(programId: string): void {
  const favorites = getFavorites();
  if (!favorites.includes(programId)) {
    favorites.push(programId);
    saveFavorites(favorites);
  }
}

export function removeFavorite(programId: string): void {
  const favorites = getFavorites();
  const newFavorites = favorites.filter(id => id !== programId);
  saveFavorites(newFavorites);
}

export function isFavorite(programId: string): boolean {
  return getFavorites().includes(programId);
}

export function toggleFavorite(programId: string): boolean {
  const favorited = isFavorite(programId);
  if (favorited) {
    removeFavorite(programId);
    return false;
  }

  addFavorite(programId);
  return true;
}
