// ============================================================
// blacklist.ts - CRUD Black List via localStorage
// Since this is a self-contained app, we use localStorage
// as the primary storage for the blacklist.
// GitHub integration is optional (when token is provided).
// ============================================================

const BL_CACHE_KEY = "bl_cache";
const BL_CACHE_TIME_KEY = "bl_cache_time";
const BL_UPDATED_AT_KEY = "bl_updated_at";

export interface BlacklistData {
  blacklist: string[];
  updatedAt: string;
}

// === ĐỌC BLACK LIST ===
export function getBlacklist(): string[] {
  if (typeof window === "undefined") return [];
  const cache = localStorage.getItem(BL_CACHE_KEY);
  if (cache) {
    try {
      return JSON.parse(cache);
    } catch {
      return [];
    }
  }
  return [];
}

// === GET UPDATED AT ===
export function getBlacklistUpdatedAt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(BL_UPDATED_AT_KEY);
}

// === THÊM SỐ VÀO BLACK LIST ===
export function addToBlacklist(numbers: string[]): void {
  if (typeof window === "undefined") return;
  const current = getBlacklist();
  const merged = [...new Set([...current, ...numbers])];
  const now = new Date().toISOString();
  
  localStorage.setItem(BL_CACHE_KEY, JSON.stringify(merged));
  localStorage.setItem(BL_CACHE_TIME_KEY, Date.now().toString());
  localStorage.setItem(BL_UPDATED_AT_KEY, now);
}

// === XÓA SỐ KHỎI BLACK LIST ===
export function removeFromBlacklist(number: string): void {
  if (typeof window === "undefined") return;
  const current = getBlacklist();
  const filtered = current.filter(n => n !== number);
  const now = new Date().toISOString();
  
  localStorage.setItem(BL_CACHE_KEY, JSON.stringify(filtered));
  localStorage.setItem(BL_CACHE_TIME_KEY, Date.now().toString());
  localStorage.setItem(BL_UPDATED_AT_KEY, now);
}

// === XÓA TOÀN BỘ BLACK LIST ===
export function clearBlacklist(): void {
  if (typeof window === "undefined") return;
  const now = new Date().toISOString();
  
  localStorage.setItem(BL_CACHE_KEY, JSON.stringify([]));
  localStorage.setItem(BL_CACHE_TIME_KEY, Date.now().toString());
  localStorage.setItem(BL_UPDATED_AT_KEY, now);
}

// === EXPORT BLACK LIST AS JSON ===
export function exportBlacklistJSON(): string {
  const bl = getBlacklist();
  const updatedAt = getBlacklistUpdatedAt() || new Date().toISOString();
  return JSON.stringify({ blacklist: bl, updatedAt }, null, 2);
}

// === IMPORT BLACK LIST FROM JSON ===
export function importBlacklistJSON(json: string): number {
  try {
    const data = JSON.parse(json);
    const numbers: string[] = data.blacklist || data;
    if (Array.isArray(numbers)) {
      addToBlacklist(numbers.filter((n: string) => /^\d{10}$/.test(n)));
      return numbers.length;
    }
    return 0;
  } catch {
    return 0;
  }
}
