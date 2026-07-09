// ============================================================
// exportCSV.ts - Xuất file CSV
// ============================================================

import type { PhoneResult } from "./coreEngine";

export function exportToCSV(results: PhoneResult[]): void {
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const header = "STT,Nhà Mạng,Số Điện Thoại,Mệnh,Quẻ Chính,Quẻ Hỗ,Quẻ Biến";
  const rows: string[] = [];

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const row = [
      i + 1,
      r.carrier,
      r.phoneNumber,
      r.iching.menh,
      r.iching.queChinh,
      r.iching.queHo,
      r.iching.queBien
    ].join(",");
    rows.push(row);
  }

  const csvContent = BOM + header + "\n" + rows.join("\n");

  // Tạo file download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  link.href = URL.createObjectURL(blob);
  link.download = `linh_so_${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function formatPhoneDisplay(phone: string): string {
  // Format: 098.267.2558
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 3)}.${phone.slice(3, 6)}.${phone.slice(6, 10)}`;
}
