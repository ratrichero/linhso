"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  CARRIERS,
  CAT_TINH,
  HUNG_TINH,
  TU_TRUONG_SHORT,
  SHORT_TO_FULL,
} from "@/lib/constants";
import {
  generatePhoneNumbers,
  type Condition,
  type PhoneResult,
} from "@/lib/coreEngine";
import { getBlacklist, addToBlacklist } from "@/lib/blacklist";
import { exportToCSV, formatPhoneDisplay } from "@/lib/exportCSV";

const ALL_CONDITIONS = [...CAT_TINH, ...HUNG_TINH];
const ITEMS_PER_PAGE = 50;

type CarrierOption = "Tất cả" | "Viettel" | "Vinaphone" | "Mobifone" | "Custom";

export default function HomePage() {
  // --- State ---
  const [carrierOption, setCarrierOption] = useState<CarrierOption>("Tất cả");
  const [customPrefixes, setCustomPrefixes] = useState("");
  const [conditions, setConditions] = useState<Condition[]>(
    Array.from({ length: 7 }, () => ["*"])
  );
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [results, setResults] = useState<PhoneResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasCalculated, setHasCalculated] = useState(false);

  // --- Derived ---
  const prefixes = useMemo(() => {
    switch (carrierOption) {
      case "Viettel":
        return CARRIERS.Viettel;
      case "Vinaphone":
        return CARRIERS.Vinaphone;
      case "Mobifone":
        return CARRIERS.Mobifone;
      case "Custom":
        return customPrefixes
          .trim()
          .split(/[\s,]+/)
          .filter((p) => /^0\d{2}$/.test(p));
      default:
        return [
          ...CARRIERS.Viettel,
          ...CARRIERS.Vinaphone,
          ...CARRIERS.Mobifone,
        ];
    }
  }, [carrierOption, customPrefixes]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- Handlers ---
  const handleConditionToggle = useCallback(
    (condName: string) => {
      if (activeSlot === null) return;

      setConditions((prev) => {
        const newConds = [...prev];
        const current = [...newConds[activeSlot]];

        if (condName === "*") {
          // Reset to wildcard
          newConds[activeSlot] = ["*"];
        } else {
          // Remove * if present
          const withoutStar = current.filter((c) => c !== "*");
          const idx = withoutStar.indexOf(condName);
          if (idx >= 0) {
            withoutStar.splice(idx, 1);
            newConds[activeSlot] = withoutStar.length === 0 ? ["*"] : withoutStar;
          } else {
            withoutStar.push(condName);
            newConds[activeSlot] = withoutStar;
          }
        }
        return newConds;
      });
    },
    [activeSlot]
  );

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setCurrentPage(1);
    setHasCalculated(true);

    // Use setTimeout to avoid blocking UI
    setTimeout(() => {
      try {
        const blacklist = getBlacklist();
        const blacklistSet = new Set(blacklist);
        const res = generatePhoneNumbers(prefixes, conditions, blacklistSet);
        setResults(res);
      } catch (err) {
        console.error("Generate error:", err);
        setResults([]);
      } finally {
        setIsCalculating(false);
      }
    }, 50);
  }, [prefixes, conditions]);

  const handleAddToBlacklist = useCallback(
    (phone: string) => {
      addToBlacklist([phone]);
      setResults((prev) => prev.filter((r) => r.phoneNumber !== phone));
    },
    []
  );

  const handleExportCSV = useCallback(() => {
    exportToCSV(results);
  }, [results]);

  // --- Slot Color ---
  const getSlotStyle = (conds: string[]) => {
    if (conds.length === 1 && conds[0] === "*") {
      return "bg-gray-100 border-gray-300 text-gray-500";
    }
    const hasCat = conds.some((c) => CAT_TINH.includes(c));
    const hasHung = conds.some((c) => HUNG_TINH.includes(c));
    if (hasCat && hasHung) return "bg-yellow-100 border-yellow-400 text-yellow-800";
    if (hasCat) return "bg-green-100 border-green-400 text-green-800";
    if (hasHung) return "bg-red-100 border-red-400 text-red-800";
    return "bg-gray-100 border-gray-300 text-gray-500";
  };

  const getSlotLabel = (conds: string[]) => {
    if (conds.length === 1 && conds[0] === "*") return "*";
    return conds.map((c) => TU_TRUONG_SHORT[c] || c).join("|");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LINH SỐ
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Tìm Số Điện Thoại Phong Thủy
          </p>
        </div>

        {/* Carrier Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Chọn nhà mạng:
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {(["Tất cả", "Viettel", "Vinaphone", "Mobifone", "Custom"] as CarrierOption[]).map(
              (opt) => (
                <button
                  key={opt}
                  onClick={() => setCarrierOption(opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    carrierOption === opt
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              )
            )}
          </div>
          {carrierOption === "Custom" && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Nhập đầu số (phân tách bằng dấu cách, VD: 091 093 098):
              </label>
              <input
                type="text"
                value={customPrefixes}
                onChange={(e) => setCustomPrefixes(e.target.value)}
                placeholder="091 093 098"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Structure Input - 7 Slots */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-4">
            Cấu trúc số:
          </label>

          {/* Slots Row */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs font-bold whitespace-nowrap shrink-0">
              ĐẦU SỐ
            </div>
            {conditions.map((conds, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlot(activeSlot === idx ? null : idx)}
                className={`min-w-[56px] px-2 py-2 rounded-lg border-2 text-xs font-semibold transition-all shrink-0 ${
                  getSlotStyle(conds)
                } ${
                  activeSlot === idx
                    ? "ring-2 ring-blue-500 ring-offset-1 scale-105"
                    : ""
                }`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5">Ô{idx + 1}</div>
                <div className="truncate max-w-[80px]">{getSlotLabel(conds)}</div>
              </button>
            ))}
          </div>

          {/* Condition Buttons - only show if a slot is selected */}
          {activeSlot !== null && (
            <div className="border-t pt-4">
              <p className="text-xs text-slate-500 mb-3">
                Chọn điều kiện cho <span className="font-bold text-blue-600">Ô {activeSlot + 1}</span>
                {" "}(click để thêm/bỏ):
              </p>

              {/* Cát Tinh */}
              <div className="mb-3">
                <span className="text-xs text-green-600 font-semibold mr-2">
                  Cát tinh:
                </span>
                <div className="inline-flex flex-wrap gap-2">
                  {CAT_TINH.map((name) => {
                    const short = TU_TRUONG_SHORT[name];
                    const isActive = conditions[activeSlot].includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => handleConditionToggle(name)}
                        title={name}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-green-50 text-green-700 border border-green-300 hover:bg-green-100"
                        }`}
                      >
                        {short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hung Tinh */}
              <div className="mb-3">
                <span className="text-xs text-red-600 font-semibold mr-2">
                  Hung tinh:
                </span>
                <div className="inline-flex flex-wrap gap-2">
                  {HUNG_TINH.map((name) => {
                    const short = TU_TRUONG_SHORT[name];
                    const isActive = conditions[activeSlot].includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => handleConditionToggle(name)}
                        title={name}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-red-500 text-white shadow-md"
                            : "bg-red-50 text-red-700 border border-red-300 hover:bg-red-100"
                        }`}
                      >
                        {short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wildcard */}
              <div>
                <button
                  onClick={() => handleConditionToggle("*")}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    conditions[activeSlot].length === 1 &&
                    conditions[activeSlot][0] === "*"
                      ? "bg-gray-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  * (Tất cả)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <div className="mb-6">
          <button
            onClick={handleCalculate}
            disabled={isCalculating || prefixes.length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang tính toán...
              </span>
            ) : (
              "🔍 TÍNH TOÁN"
            )}
          </button>
        </div>

        {/* Results */}
        {hasCalculated && !isCalculating && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                KẾT QUẢ ({results.length.toLocaleString()} số)
              </h2>
              {results.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                  📥 Xuất CSV
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Không tìm thấy số nào phù hợp với điều kiện.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-2 px-2 text-slate-500 text-xs">#</th>
                        <th className="text-left py-2 px-2 text-slate-500 text-xs">Nhà Mạng</th>
                        <th className="text-left py-2 px-2 text-slate-500 text-xs">Số ĐT</th>
                        <th className="text-left py-2 px-2 text-slate-500 text-xs">Mệnh</th>
                        <th className="text-left py-2 px-2 text-slate-500 text-xs">Q. Chính</th>
                        <th className="text-left py-2 px-2 text-slate-500 text-xs">Q. Hỗ</th>
                        <th className="text-left py-2 px-2 text-slate-500 text-xs">Q. Biến</th>
                        <th className="text-center py-2 px-2 text-slate-500 text-xs">BL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedResults.map((r, i) => (
                        <tr
                          key={r.phoneNumber}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-2 px-2 text-slate-400 text-xs">
                            {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                          </td>
                          <td className="py-2 px-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              r.carrier === "Viettel" ? "bg-red-100 text-red-700" :
                              r.carrier === "Vinaphone" ? "bg-blue-100 text-blue-700" :
                              r.carrier === "Mobifone" ? "bg-green-100 text-green-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {r.carrier}
                            </span>
                          </td>
                          <td className="py-2 px-2 font-mono font-bold text-slate-800">
                            {formatPhoneDisplay(r.phoneNumber)}
                          </td>
                          <td className="py-2 px-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              r.iching.menh === "Kim" ? "bg-yellow-100 text-yellow-800" :
                              r.iching.menh === "Mộc" ? "bg-green-100 text-green-800" :
                              r.iching.menh === "Thủy" ? "bg-blue-100 text-blue-800" :
                              r.iching.menh === "Hỏa" ? "bg-red-100 text-red-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {r.iching.menh}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-xs text-slate-600">{r.iching.queChinh}</td>
                          <td className="py-2 px-2 text-xs text-slate-600">{r.iching.queHo}</td>
                          <td className="py-2 px-2 text-xs text-slate-600">{r.iching.queBien}</td>
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => handleAddToBlacklist(r.phoneNumber)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Thêm vào Black List"
                            >
                              🚫
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-slate-100 text-slate-600 text-sm disabled:opacity-40 hover:bg-slate-200"
                    >
                      ‹
                    </button>
                    {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 10) {
                        pageNum = i + 1;
                      } else if (currentPage <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 4) {
                        pageNum = totalPages - 9 + i;
                      } else {
                        pageNum = currentPage - 5 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-slate-100 text-slate-600 text-sm disabled:opacity-40 hover:bg-slate-200"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Black List Link */}
        <div className="text-center">
          <Link
            href="/blacklist"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md text-slate-700 font-semibold hover:shadow-lg transition-all"
          >
            📋 Quản lý Black List
          </Link>
        </div>
      </div>
    </main>
  );
}
