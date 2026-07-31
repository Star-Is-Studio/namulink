"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountingPage() {
  const supabase = createClient();
  const [selectedYear, setSelectedYear] = useState("2026");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounting = async () => {
    setIsLoading(true);
    try {
      const { data: payData } = await supabase.from("payments").select("total_amount").eq("pay_status", "paid");
      if (payData) {
        const sum = payData.reduce((acc: number, curr: any) => acc + (curr.total_amount || 0), 0);
        setTotalIncome(sum);
      } else {
        setTotalIncome(0);
      }

      const { data: rollData } = await supabase.from("therapist_payrolls").select("net_amount");
      if (rollData) {
        const expSum = rollData.reduce((acc: number, curr: any) => acc + (curr.net_amount || 0), 0);
        setTotalExpense(expSum);
      } else {
        setTotalExpense(0);
      }
    } catch {
      setTotalIncome(0);
      setTotalExpense(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounting();
  }, [selectedYear]);

  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📊</span> 회계 관리 & 수입/지출 손익 리포트 (Supabase DB 전용)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supabase DB 실제 완납 수입 및 정산 지출 집계
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
          <div className="text-xs text-emerald-200">총 수입 (Supabase DB 완납분)</div>
          <div className="text-2xl font-extrabold font-mono">
            {isLoading ? "로딩 중..." : `${totalIncome.toLocaleString()} 원`}
          </div>
          <div className="text-[11px] text-emerald-300">실제 DB payments 집계</div>
        </div>

        <div className="p-6 bg-rose-700 text-white rounded-2xl shadow-sm space-y-2">
          <div className="text-xs text-rose-200">총 지출 (Supabase DB 급여)</div>
          <div className="text-2xl font-extrabold font-mono">
            {isLoading ? "로딩 중..." : `${totalExpense.toLocaleString()} 원`}
          </div>
          <div className="text-[11px] text-rose-300">실제 DB therapist_payrolls 집계</div>
        </div>

        <div className="p-6 bg-slate-800 text-white rounded-2xl shadow-sm space-y-2">
          <div className="text-xs text-slate-400">당월 순익 (Net Profit)</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {isLoading ? "로딩 중..." : `${netProfit.toLocaleString()} 원`}
          </div>
          <div className="text-[11px] text-slate-400">실제 DB 손익</div>
        </div>
      </div>
    </div>
  );
}
