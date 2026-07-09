"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  getBlacklist,
  addToBlacklist,
  removeFromBlacklist,
  clearBlacklist,
  getBlacklistUpdatedAt,
} from "@/lib/blacklist";

const ITEMS_PER_PAGE = 20;

export default function BlacklistPage() {
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setBlacklist(getBlacklist());
    setUpdatedAt(getBlacklistUpdatedAt());
  }, []);

  const refreshData = useCallback(() => {
    setBlacklist(getBlacklist());
    setUpdatedAt(getBlacklistUpdatedAt());
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return blacklist;
    return blacklist.filter((n) => n.includes(searchQuery.trim()));
  }, [blacklist, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAdd = () => {
    const raw = textInput.trim();
    if (!raw) return;

    const numbers = raw
      .split(/[\n,\s]+/)
      .map((s) => s.trim().replace(/\D/g, ""))
      .filter((s) => s.length === 10);

    if (numbers.length === 0) {
      alert("Không tìm thấy số điện thoại hợp lệ (phải đúng 10 chữ số).");
      return;
    }

    addToBlacklist(numbers);
    setTextInput("");
    refreshData();
    setCurrentPage(1);
  };

  const handleRemove = (number: string) => {
    if (confirm(`Xóa ${number} khỏi Black List?`)) {
      removeFromBlacklist(number);
      refreshData();
    }
  };

  const handleClearAll = () => {
    if (confirm("Xóa toàn bộ Black List? Hành động này không thể hoàn tác.")) {
      clearBlacklist();
      refreshData();
      setCurrentPage(1);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString("vi-VN");
    } catch {
      return isoStr;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-4 sm:py-6 px-3 sm:px-4 pb-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            QUẢN LÝ BLACK LIST
          </h1>
        </div>

        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg shadow text-slate-600 text-xs sm:text-sm font-semibold hover:shadow-md transition-all"
          >
            🔙 Quay lại
          </Link>
        </div>

        {/* Add Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-sm font-bold text-slate-700 mb-2 sm:mb-3">
            Thêm số vào Black List:
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-500 mb-2">
            Mỗi số 1 dòng, hoặc phân tách bằng dấu phẩy / dấu cách (10 chữ số)
          </p>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={"0931728725\n0982672558\n0359367268, 0981234567"}
            className="w-full border border-slate-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] sm:min-h-[120px] resize-y"
          />
          <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
            <button
              onClick={handleAdd}
              className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              ➕ Thêm
            </button>
            <button
              onClick={handleClearAll}
              disabled={blacklist.length === 0}
              className="px-3 sm:px-5 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🗑️ Xóa tất cả
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-sm font-bold text-slate-700 mb-2 sm:mb-3">
            Danh sách ({blacklist.length} số):
          </h2>

          {/* Search */}
          <div className="mb-3 sm:mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="🔍 Tìm kiếm..."
              className="w-full border border-slate-300 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-slate-400 text-center py-4 sm:py-6 text-xs sm:text-sm">
              {blacklist.length === 0
                ? "Black List trống."
                : "Không tìm thấy số phù hợp."}
            </p>
          ) : (
            <>
              {/* Mobile List View */}
              <div className="sm:hidden space-y-2">
                {paginated.map((number, i) => (
                  <div
                    key={number}
                    className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-xs w-6">
                        {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                      </span>
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {number}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(number)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-2 px-3 text-slate-500 text-xs w-12">#</th>
                      <th className="text-left py-2 px-3 text-slate-500 text-xs">Số Điện Thoại</th>
                      <th className="text-center py-2 px-3 text-slate-500 text-xs w-16">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((number, i) => (
                      <tr
                        key={number}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-2 px-3 text-slate-400 text-xs">
                          {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">
                          {number}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => handleRemove(number)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-1 rounded bg-slate-100 text-slate-600 text-xs sm:text-sm disabled:opacity-40"
                  >
                    ‹
                  </button>
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-1 rounded bg-slate-100 text-slate-600 text-xs sm:text-sm disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-sm font-bold text-slate-700 mb-2 sm:mb-3">Thống kê:</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-slate-500">Tổng số trong BL</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">
                {blacklist.length}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-slate-500">Cập nhật cuối</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {updatedAt ? formatDate(updatedAt) : "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
