export interface AuthUser {
  id: string;
  phone?: string;
  nickname: string;
  avatar?: string;
  loginMethod: "sms" | "wechat";
  loggedInAt: string;
}

export const AUTH_USER_STORAGE_KEY = "liuxuehub_auth_user";
export const AUTH_UPDATED_EVENT = "liuxuehub-auth-updated";

// Historical browser-only demo identities are not authenticated sessions.
export function getStoredUser(): AuthUser | null { return null; }

export function storeUser(user: AuthUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

export function maskPhone(phone?: string) {
  if (!phone || phone.length < 7) return "已登录用户";
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
