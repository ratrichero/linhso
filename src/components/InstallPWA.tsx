"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type DeviceType = "ios" | "android" | "desktop" | "unknown";

export default function InstallPWA() {
  const [deviceType, setDeviceType] = useState<DeviceType>("unknown");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches 
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    if (isIOS) {
      setDeviceType("ios");
    } else if (isAndroid) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    // Listen for install prompt (Android/Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deviceType === "ios") {
      setShowModal(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Install Button */}
      <button
        onClick={handleInstallClick}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-semibold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">Cài đặt App</span>
        <span className="sm:hidden">Cài App</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🔮</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Cài đặt Linh Số</h3>
              <p className="text-sm text-slate-500 mt-1">Thêm vào màn hình chính để truy cập nhanh</p>
            </div>

            {deviceType === "ios" ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 font-medium text-center">
                  Trên {deviceType === "ios" ? "iPhone/iPad" : "thiết bị của bạn"}:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Nhấn nút Chia sẻ</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        Biểu tượng 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        ở thanh dưới Safari
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Chọn &quot;Thêm vào MH chính&quot;</p>
                      <p className="text-xs text-slate-500 mt-0.5">Cuộn xuống để tìm tùy chọn này</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">3</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Nhấn &quot;Thêm&quot;</p>
                      <p className="text-xs text-slate-500 mt-0.5">App sẽ xuất hiện trên màn hình chính</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : deviceType === "android" ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 font-medium text-center">
                  Trên Android:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Nhấn menu ⋮</p>
                      <p className="text-xs text-slate-500 mt-0.5">Góc trên bên phải của Chrome</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Chọn &quot;Thêm vào MH chính&quot;</p>
                      <p className="text-xs text-slate-500 mt-0.5">Hoặc &quot;Cài đặt ứng dụng&quot;</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">3</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Xác nhận &quot;Thêm&quot;</p>
                      <p className="text-xs text-slate-500 mt-0.5">App sẽ xuất hiện trên màn hình chính</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 font-medium text-center">
                  Trên máy tính (Chrome):
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Nhấn biểu tượng cài đặt</p>
                      <p className="text-xs text-slate-500 mt-0.5">Ở góc phải thanh địa chỉ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Chọn &quot;Cài đặt&quot;</p>
                      <p className="text-xs text-slate-500 mt-0.5">App sẽ mở như ứng dụng riêng</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
