import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import InstallPWA from "@/components/InstallPWA";

export const metadata: Metadata = {
  title: "Linh Số - Tìm Số Điện Thoại Phong Thủy",
  description: "Phần mềm tìm kiếm số điện thoại phù hợp dựa trên quy tắc Từ Trường (Linh Số) và Kinh Dịch.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Linh Số",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Linh Số" />
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased">
        {children}
        <InstallPWA />
      </body>
    </html>
  );
}
