// ============================================================
// constants.ts - Bảng Dữ Liệu Tĩnh cho Phần Mềm Linh Số
// ============================================================

// 2.1 Bảng Đầu Số Nhà Mạng
export const CARRIERS: Record<string, string[]> = {
  Viettel: [
    "032","033","034","035","036",
    "037","038","039","086","096",
    "097","098"
  ],
  Vinaphone: [
    "081","082","083","084","085",
    "088","091","094"
  ],
  Mobifone: [
    "076","077","078","079",
    "089","093"
  ]
};

// 2.2 Bảng Từ Trường (Cặp Số)
export const TU_TRUONG: Record<string, string[]> = {
  // === CÁT TINH ===
  "Sinh Khí":      ["14","41","39","93","67","76","28","82"],
  "Thiên Y":       ["13","31","68","86","49","94","27","72"],
  "Diên Niên Nhỏ": ["26","62","34","43"],
  "Diên Niên Lớn": ["19","91","78","87"],

  // === HUNG TINH ===
  "Tuyệt Mệnh":   ["12","21","37","73","48","84","69","96"],
  "Ngũ Quỷ":       ["18","81","24","42","36","63","79","97"],
  "Họa Hại":       ["17","71","23","32","46","64","89","98"],
  "Lục Sát":       ["16","61","29","92","38","83","47","74"]
};

export const CAT_TINH = ["Sinh Khí", "Thiên Y", "Diên Niên Nhỏ", "Diên Niên Lớn"];
export const HUNG_TINH = ["Tuyệt Mệnh", "Ngũ Quỷ", "Họa Hại", "Lục Sát"];

// Viết tắt cho UI
export const TU_TRUONG_SHORT: Record<string, string> = {
  "Sinh Khí": "SK",
  "Thiên Y": "TY",
  "Diên Niên Nhỏ": "DNN",
  "Diên Niên Lớn": "DNL",
  "Tuyệt Mệnh": "TM",
  "Ngũ Quỷ": "NQ",
  "Họa Hại": "HH",
  "Lục Sát": "LS",
};

export const SHORT_TO_FULL: Record<string, string> = {
  "SK": "Sinh Khí",
  "TY": "Thiên Y",
  "DNN": "Diên Niên Nhỏ",
  "DNL": "Diên Niên Lớn",
  "TM": "Tuyệt Mệnh",
  "NQ": "Ngũ Quỷ",
  "HH": "Họa Hại",
  "LS": "Lục Sát",
};

// Map ngược: từ cặp số -> tên từ trường
function buildPairMap(tuTruong: Record<string, string[]>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [name, pairs] of Object.entries(tuTruong)) {
    for (const pair of pairs) {
      map[pair] = name;
    }
  }
  return map;
}

export const PAIR_MAP = buildPairMap(TU_TRUONG);

// 2.3 Bảng Kinh Dịch
export interface QuaiInfo {
  name: string;
  element: string;
  binary: number[];
}

export const BAT_QUAI: Record<number, QuaiInfo> = {
  1: { name: "Càn",  element: "Kim",  binary: [1,1,1] },
  2: { name: "Đoài", element: "Kim",  binary: [1,1,0] },
  3: { name: "Ly",   element: "Hỏa", binary: [1,0,1] },
  4: { name: "Chấn", element: "Mộc",  binary: [1,0,0] },
  5: { name: "Tốn",  element: "Mộc",  binary: [0,1,1] },
  6: { name: "Khảm", element: "Thủy", binary: [0,1,0] },
  7: { name: "Cấn",  element: "Thổ",  binary: [0,0,1] },
  0: { name: "Khôn", element: "Thổ",  binary: [0,0,0] }
};

// Bảng 64 Quẻ Kép - Key: "Thượng_Hạ"
export const QUE_64: Record<string, string> = {
  // Càn (Thượng)
  "Càn_Càn":   "Thuần Càn",
  "Càn_Đoài":  "Thiên Trạch Lý",
  "Càn_Ly":    "Thiên Hỏa Đồng Nhân",
  "Càn_Chấn":  "Thiên Lôi Vô Vọng",
  "Càn_Tốn":   "Thiên Phong Cấu",
  "Càn_Khảm":  "Thiên Thủy Tụng",
  "Càn_Cấn":   "Thiên Sơn Độn",
  "Càn_Khôn":  "Thiên Địa Bĩ",

  // Đoài (Thượng)
  "Đoài_Càn":   "Trạch Thiên Quải",
  "Đoài_Đoài":  "Thuần Đoài",
  "Đoài_Ly":    "Trạch Hỏa Cách",
  "Đoài_Chấn":  "Trạch Lôi Tùy",
  "Đoài_Tốn":   "Trạch Phong Đại Quá",
  "Đoài_Khảm":  "Trạch Thủy Khốn",
  "Đoài_Cấn":   "Trạch Sơn Hàm",
  "Đoài_Khôn":  "Trạch Địa Tụy",

  // Ly (Thượng)
  "Ly_Càn":   "Hỏa Thiên Đại Hữu",
  "Ly_Đoài":  "Hỏa Trạch Khuê",
  "Ly_Ly":    "Thuần Ly",
  "Ly_Chấn":  "Hỏa Lôi Phệ Hạp",
  "Ly_Tốn":   "Hỏa Phong Đỉnh",
  "Ly_Khảm":  "Hỏa Thủy Vị Tế",
  "Ly_Cấn":   "Hỏa Sơn Lữ",
  "Ly_Khôn":  "Hỏa Địa Tấn",

  // Chấn (Thượng)
  "Chấn_Càn":   "Lôi Thiên Đại Tráng",
  "Chấn_Đoài":  "Lôi Trạch Quy Muội",
  "Chấn_Ly":    "Lôi Hỏa Phong",
  "Chấn_Chấn":  "Thuần Chấn",
  "Chấn_Tốn":   "Lôi Phong Hằng",
  "Chấn_Khảm":  "Lôi Thủy Giải",
  "Chấn_Cấn":   "Lôi Sơn Tiểu Quá",
  "Chấn_Khôn":  "Lôi Địa Dự",

  // Tốn (Thượng)
  "Tốn_Càn":   "Phong Thiên Tiểu Súc",
  "Tốn_Đoài":  "Phong Trạch Trung Phu",
  "Tốn_Ly":    "Phong Hỏa Gia Nhân",
  "Tốn_Chấn":  "Phong Lôi Ích",
  "Tốn_Tốn":   "Thuần Tốn",
  "Tốn_Khảm":  "Phong Thủy Hoán",
  "Tốn_Cấn":   "Phong Sơn Tiệm",
  "Tốn_Khôn":  "Phong Địa Quan",

  // Khảm (Thượng)
  "Khảm_Càn":   "Thủy Thiên Nhu",
  "Khảm_Đoài":  "Thủy Trạch Tiết",
  "Khảm_Ly":    "Thủy Hỏa Ký Tế",
  "Khảm_Chấn":  "Thủy Lôi Truân",
  "Khảm_Tốn":   "Thủy Phong Tỉnh",
  "Khảm_Khảm":  "Thuần Khảm",
  "Khảm_Cấn":   "Thủy Sơn Kiển",
  "Khảm_Khôn":  "Thủy Địa Tỷ",

  // Cấn (Thượng)
  "Cấn_Càn":   "Sơn Thiên Đại Súc",
  "Cấn_Đoài":  "Sơn Trạch Tổn",
  "Cấn_Ly":    "Sơn Hỏa Bí",
  "Cấn_Chấn":  "Sơn Lôi Di",
  "Cấn_Tốn":   "Sơn Phong Cổ",
  "Cấn_Khảm":  "Sơn Thủy Mông",
  "Cấn_Cấn":   "Thuần Cấn",
  "Cấn_Khôn":  "Sơn Địa Bác",

  // Khôn (Thượng)
  "Khôn_Càn":   "Địa Thiên Thái",
  "Khôn_Đoài":  "Địa Trạch Lâm",
  "Khôn_Ly":    "Địa Hỏa Minh Di",
  "Khôn_Chấn":  "Địa Lôi Phục",
  "Khôn_Tốn":   "Địa Phong Thăng",
  "Khôn_Khảm":  "Địa Thủy Sư",
  "Khôn_Cấn":   "Địa Sơn Khiêm",
  "Khôn_Khôn":  "Thuần Khôn"
};

// Map binary [x,y,z] -> quai index
export function binaryToQuaiIndex(binary: number[]): number {
  for (const [key, quai] of Object.entries(BAT_QUAI)) {
    if (quai.binary[0] === binary[0] &&
        quai.binary[1] === binary[1] &&
        quai.binary[2] === binary[2]) {
      return Number(key);
    }
  }
  return 0;
}

// Get carrier name from phone number
export function getCarrierName(phoneNumber: string): string {
  const prefix = phoneNumber.substring(0, 3);
  for (const [carrier, prefixes] of Object.entries(CARRIERS)) {
    if (prefixes.includes(prefix)) {
      return carrier;
    }
  }
  return "Không xác định";
}
