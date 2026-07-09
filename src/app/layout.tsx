import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linh Số - Tìm Số Điện Thoại Phong Thủy",
  description: "Phần mềm tìm kiếm số điện thoại phù hợp dựa trên quy tắc Từ Trường (Linh Số) và Kinh Dịch.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
