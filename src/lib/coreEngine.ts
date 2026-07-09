// ============================================================
// coreEngine.ts - Generate + Phân Tích Số Điện Thoại
// ============================================================

import { PAIR_MAP, HUNG_TINH, getCarrierName } from "./constants";
import { calculateIChing, type IChingResult } from "./iching";

export interface PhoneResult {
  phoneNumber: string;
  carrier: string;
  iching: IChingResult;
}

export type Condition = string[]; // e.g. ["*"] or ["Sinh Khí", "Thiên Y"]

/**
 * Lấy số hiệu lực cuối cùng của đầu số.
 * Bỏ số 0 đầu, bỏ số 5, gộp số trùng liền nhau, lấy số cuối.
 */
export function getLastDigit(prefix: string): number {
  // Bỏ ký tự "0" ở đầu
  let cleaned = prefix.replace(/^0+/, "");
  
  // Bỏ tất cả "5"
  cleaned = cleaned.replace(/5/g, "");
  
  // Gộp số trùng liền nhau
  let deduped = "";
  for (let i = 0; i < cleaned.length; i++) {
    if (i === 0 || cleaned[i] !== cleaned[i - 1]) {
      deduped += cleaned[i];
    }
  }

  if (deduped.length === 0) {
    // Fallback: use the last non-zero digit of prefix
    for (let i = prefix.length - 1; i >= 0; i--) {
      if (prefix[i] !== "0" && prefix[i] !== "5") {
        return parseInt(prefix[i]);
      }
    }
    return 0;
  }

  return parseInt(deduped[deduped.length - 1]);
}

/**
 * Sinh danh sách số điện thoại hợp lệ.
 */
export function generatePhoneNumbers(
  prefixes: string[],
  conditions: Condition[],
  blacklistSet: Set<string>
): PhoneResult[] {
  const results: PhoneResult[] = [];

  for (const prefix of prefixes) {
    const lastEffective = getLastDigit(prefix);
    
    generateRecursive(
      prefix,
      lastEffective,
      0,
      conditions,
      [],
      0,
      results,
      blacklistSet
    );
  }

  return results;
}

function generateRecursive(
  prefix: string,
  lastEffective: number,
  currentIndex: number,
  conditions: Condition[],
  currentDigits: number[],
  hungCount: number,
  results: PhoneResult[],
  blacklistSet: Set<string>
): void {
  // === BASE CASE: Đã sinh đủ 7 số ===
  if (currentIndex === 7) {
    const fullNumber = prefix + currentDigits.join("");
    if (!blacklistSet.has(fullNumber)) {
      const carrier = getCarrierName(fullNumber);
      const iching = calculateIChing(fullNumber);
      results.push({ phoneNumber: fullNumber, carrier, iching });
    }
    return;
  }

  const condition = conditions[currentIndex];

  // Thử từng số từ 1 đến 9 (không bao giờ dùng số 0)
  for (let digit = 1; digit <= 9; digit++) {
    // ─── TRƯỜNG HỢP 1: digit = 5 ───
    if (digit === 5) {
      // Số 5 không tạo cặp, chỉ hợp lệ nếu ô có *
      if (condition.includes("*")) {
        generateRecursive(
          prefix,
          lastEffective, // KHÔNG ĐỔI
          currentIndex + 1,
          conditions,
          [...currentDigits, 5],
          hungCount, // KHÔNG ĐỔI
          results,
          blacklistSet
        );
      }
      continue;
    }

    // ─── TRƯỜNG HỢP 2: digit trùng lastEffective ───
    if (digit === lastEffective) {
      // Số trùng không tạo cặp, chỉ hợp lệ nếu ô có *
      if (condition.includes("*")) {
        generateRecursive(
          prefix,
          lastEffective, // KHÔNG ĐỔI
          currentIndex + 1,
          conditions,
          [...currentDigits, digit],
          hungCount, // KHÔNG ĐỔI
          results,
          blacklistSet
        );
      }
      continue;
    }

    // ─── TRƯỜNG HỢP 3: digit tạo cặp bình thường ───
    const pair = `${lastEffective}${digit}`;
    const pairType = PAIR_MAP[pair];

    if (!pairType) continue; // pair not recognized

    // Kiểm tra: cặp này có khớp điều kiện ô không?
    if (condition.includes("*") || condition.includes(pairType)) {
      let newHungCount = hungCount;
      if (HUNG_TINH.includes(pairType)) {
        newHungCount = hungCount + 1;
      }

      // PRUNING: Nếu > 2 hung tinh thì bỏ
      if (newHungCount > 2) {
        continue;
      }

      generateRecursive(
        prefix,
        digit, // CẬP NHẬT lastEffective
        currentIndex + 1,
        conditions,
        [...currentDigits, digit],
        newHungCount,
        results,
        blacklistSet
      );
    }
  }
}
