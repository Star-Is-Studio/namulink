"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface PaymentRecord {
  id: string;
  childName: string;
  supportType: string;
  therapistName: string;
  amount: number;
  status: "완납" | "미납" | "부분납부";
  paidDate?: string;
  depositorName?: string;
  isLocked: boolean;
}

export default function PaymentsPage() {
  const supabase = createClient();
  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*");

      if (!error && data) {
        const mapped: PaymentRecord[] = data.map((p: any) => ({
          id: p.payment_id,
          childName: p.child_id || "아동",
          supportType: p.support_type || "발달재활",
          therapistName: "담당치료사",
          amount: p.total_amount || 0,
          status: p.pay_status === "paid" ? "완납" : "미납",
          paidDate: p.paid_date,
          depositorName: p.depositor_name,
          isLocked: p.is_locked || false,
        }));
        setPayments(mapped);
      } else {
        setPayments([]);
      }
    } catch {
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>💳</span> 월별 납부 & 바우처 정산 관리 (Supabase DB 전용)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supabase DB public.payments 실제 데이터만 조회 및 마감
          </p>
        </div>
        <div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-3.5">아동명</th>
              <th className="p-3.5">지원 사업 유형</th>
              <th className="p-3.5">담당 치료사</th>
              <th className="p-3.5 text-right">청구 금액</th>
              <th className="p-3.5">납부 상태</th>
              <th className="p-3.5">입금자명 (대사)</th>
              <th className="p-3.5">완납확인일</th>
              <th className="p-3.5 text-right">마감 상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400">
                  Supabase DB에서 납부 데이터를 로딩 중입니다...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400">
                  Supabase DB에 저장된 납부 내역이 없습니다.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{p.childName}</td>
                  <td className="p-3.5 font-medium">{p.supportType}</td>
                  <td className="p-3.5">{p.therapistName}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    {p.amount.toLocaleString()}원
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        p.status === "완납"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium">{p.depositorName || "-"}</td>
                  <td className="p-3.5 font-mono text-slate-500">{p.paidDate || "-"}</td>
                  <td className="p-3.5 text-right">
                    {p.isLocked ? (
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        🔒 완납 마감
                      </span>
                    ) : (
                      <button className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-50 text-[11px]">
                        완납 처리
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
