// ============================================================
// phoneAnalysis.ts - Phân tích cặp số trong số điện thoại
// ============================================================

import { PAIR_MAP, HUNG_TINH, CAT_TINH } from "./constants";

export interface PhoneAnalysis {
  pairs: { pair: string; type: string }[];
  hungTinhTypes: string[];
  catTinhTypes: string[];
  hungCount: number;
  catCount: number;
}

/**
 * Phân tích tất cả các cặp số trong số điện thoại
 * Bao gồm cả 3 số đầu (prefix)
 */
export function analyzePhone(phoneNumber: string): PhoneAnalysis {
  const pairs: { pair: string; type: string }[] = [];
  const hungTinhSet = new Set<string>();
  const catTinhSet = new Set<string>();

  // Bỏ số 0 đầu
  let digits = phoneNumber.replace(/^0+/, "");

  let lastEffective: number | null = null;

  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i]);

    // Bỏ qua số 5 (không tạo cặp)
    if (digit === 5) continue;

    // Nếu chưa có lastEffective, set nó
    if (lastEffective === null) {
      lastEffective = digit;
      continue;
    }

    // Nếu digit trùng lastEffective, không tạo cặp mới
    if (digit === lastEffective) continue;

    // Tạo cặp
    const pair = `${lastEffective}${digit}`;
    const pairType = PAIR_MAP[pair];

    if (pairType) {
      pairs.push({ pair, type: pairType });

      if (HUNG_TINH.includes(pairType)) {
        hungTinhSet.add(pairType);
      } else if (CAT_TINH.includes(pairType)) {
        catTinhSet.add(pairType);
      }
    }

    // Cập nhật lastEffective
    lastEffective = digit;
  }

  return {
    pairs,
    hungTinhTypes: Array.from(hungTinhSet),
    catTinhTypes: Array.from(catTinhSet),
    hungCount: pairs.filter((p) => HUNG_TINH.includes(p.type)).length,
    catCount: pairs.filter((p) => CAT_TINH.includes(p.type)).length,
  };
}
