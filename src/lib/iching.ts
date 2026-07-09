// ============================================================
// iching.ts - Tính Quẻ Kinh Dịch cho Số Điện Thoại
// ============================================================

import { BAT_QUAI, QUE_64, binaryToQuaiIndex } from "./constants";

export interface IChingResult {
  queChinh: string;
  queHo: string;
  queBien: string;
  menh: string;
  thuongQuaiName: string;
  haQuaiName: string;
}

export function calculateIChing(phoneNumber: string): IChingResult {
  // Tách thành mảng 10 số
  const digits = phoneNumber.split("").map(Number);
  // VD: "0931728725" -> [0,9,3,1,7,2,8,7,2,5]

  // === THƯỢNG QUÁI (5 số đầu) ===
  const sumTop = digits[0] + digits[1] + digits[2] + digits[3] + digits[4];
  const thuongQuaiKey = sumTop % 8;

  // === HẠ QUÁI (5 số cuối) ===
  const sumBot = digits[5] + digits[6] + digits[7] + digits[8] + digits[9];
  const haQuaiKey = sumBot % 8;

  // === QUẺ CHÍNH ===
  const thuongQuai = BAT_QUAI[thuongQuaiKey];
  const haQuai = BAT_QUAI[haQuaiKey];
  const thuongName = thuongQuai.name;
  const haName = haQuai.name;
  const queChinhName = QUE_64[`${thuongName}_${haName}`] || "Không xác định";

  // === MỆNH (Ngũ Hành) ===
  const menh = thuongQuai.element;

  // === HÀO ĐỘNG ===
  const totalSum = sumTop + sumBot;
  let haoDong = totalSum % 6;
  if (haoDong === 0) haoDong = 6;

  // === SIX LINES (6 hào) ===
  // QUAN TRỌNG: Hào đếm từ DƯỚI LÊN TRÊN (hào 1 -> hào 6)
  // Nên HẠ QUÁI phải đứng TRƯỚC, THƯỢNG QUÁI đứng SAU
  // Index 0,1,2 = Hạ Quái (hào 1,2,3)
  // Index 3,4,5 = Thượng Quái (hào 4,5,6)
  const originalSixLines = [...haQuai.binary, ...thuongQuai.binary];

  // === QUẺ BIẾN ===
  const bienSixLines = [...originalSixLines];
  // Lật hào động (hào 1 = index 0, hào 6 = index 5)
  bienSixLines[haoDong - 1] = bienSixLines[haoDong - 1] === 0 ? 1 : 0;

  // Tách lại: newHa = 3 phần tử ĐẦU (index 0,1,2), newThuong = 3 phần tử CUỐI (index 3,4,5)
  const newHaIdx = binaryToQuaiIndex(bienSixLines.slice(0, 3));
  const newThuongIdx = binaryToQuaiIndex(bienSixLines.slice(3, 6));
  const newHaName = BAT_QUAI[newHaIdx].name;
  const newThuongName = BAT_QUAI[newThuongIdx].name;
  const queBienName = QUE_64[`${newThuongName}_${newHaName}`] || "Không xác định";

  // === QUẺ HỖ ===
  // Hạ Quái Hỗ (Nội Hỗ) - Hào 2,3,4: index [1,2,3]
  // Thượng Quái Hỗ (Ngoại Hỗ) - Hào 3,4,5: index [2,3,4]
  const hoHaBinary = [originalSixLines[1], originalSixLines[2], originalSixLines[3]];
  const hoThuongBinary = [originalSixLines[2], originalSixLines[3], originalSixLines[4]];

  const hoHaIdx = binaryToQuaiIndex(hoHaBinary);
  const hoThuongIdx = binaryToQuaiIndex(hoThuongBinary);
  const hoHaName = BAT_QUAI[hoHaIdx].name;
  const hoThuongName = BAT_QUAI[hoThuongIdx].name;
  const queHoName = QUE_64[`${hoThuongName}_${hoHaName}`] || "Không xác định";

  return {
    queChinh: queChinhName,
    queHo: queHoName,
    queBien: queBienName,
    menh,
    thuongQuaiName: thuongName,
    haQuaiName: haName,
  };
}
