"use client";

import { useState } from "react";

export default function AccountingPage() {
  const [selectedYear, setSelectedYear] = useState("2026");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📊</span> 회계 관리 & 수입/지출 손익 리포트
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            월별 본인부담금/정부 바우처 수입, 치료사 급여 지출, 환불 내역 통산
          </p>
        </div>
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white"
          >
            <option value="2026">2026년도</option>
            <option value="2025">2025년도</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-700 text-white rounded-2xl shadow-sm space-y-2">
          <div className="text-xs text-emerald-200">총 수입 (완납분)</div>
          <div className="text-2xl font-extrabold font-mono">14,250,000 원</div>
          <div className="text-[11px] text-emerald-300">본인부담금 4.2M + 바우처 10.05M</div>
        </div>

        <div className="p-6 bg-rose-700 text-white rounded-2xl shadow-sm space-y-2">
          <div className="text-xs text-rose-200">총 지출 (치료사 급여/운영비)</div>
          <div className="text-2xl font-extrabold font-mono">8,940,000 원</div>
          <div className="text-[11px] text-rose-300">치료사 정산 7.4M + 운영비 1.54M</div>
        </div>

        <div className="p-6 bg-slate-800 text-white rounded-2xl shadow-sm space-y-2">
          <div className="text-xs text-slate-400">당월 순익 (Net Profit)</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            +5,310,000 원
          </div>
          <div className="text-[11px] text-slate-400">손익률 37.2%</div>
        </div>
      </div>
    </div>
  );
}
