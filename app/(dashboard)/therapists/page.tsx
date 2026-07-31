"use client";

import { useState } from "react";

interface TherapistPayrollSummary {
  id: string;
  name: string;
  employmentType: "프리랜서" | "근로계약";
  payRate: string;
  paidSessions: number;       // 결제 완료 회기 수 (납부관리)
  actualSessions: number;     // ★ 핵심: 실제 진행 완료 회기 수 (스케줄)
  unconductedSessions: number;// 미진행(결석/다음달 보강 예정) 회기 수
  sessionFee: number;
  calculatedSalary: number;   // 실제 진행 회기 × 회기단가
}

export default function TherapistsPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-08");

  const [therapists] = useState<TherapistPayrollSummary[]>([
    {
      id: "t1",
      name: "이채린",
      employmentType: "프리랜서",
      payRate: "60%",
      paidSessions: 16,
      actualSessions: 14,
      unconductedSessions: 2,
      sessionFee: 39000,
      calculatedSalary: 546000, // 14회 × 39,000원
    },
    {
      id: "t2",
      name: "정다혜",
      employmentType: "프리랜서",
      payRate: "65%",
      paidSessions: 20,
      actualSessions: 20,
      unconductedSessions: 0,
      sessionFee: 42250,
      calculatedSalary: 845000, // 20회 × 42,250원
    },
    {
      id: "t3",
      name: "신슬기",
      employmentType: "근로계약",
      payRate: "고정급+수당",
      paidSessions: 12,
      actualSessions: 10,
      unconductedSessions: 2,
      sessionFee: 35000,
      calculatedSalary: 350000, // 10회 × 35,000원
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👩‍⚕️</span> 치료사 관리 & 실제 진행회기 기반 급여 정산
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            결제회기 vs 스케줄 실진행회기 동기화 — 미진행 회기는 제외하고 실제 수행한 치료 회기만 정확하게 급여 산정
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

      {/* Rules Banner */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 space-y-1">
        <p className="font-bold flex items-center gap-1">
          <span>⚙️ 급여 정산 핵심 연동 규칙</span>
        </p>
        <p>• <b>결제회기 수</b>: [납부관리] 페이지에서 학부모가 납부 완료한 결제 회기 수</p>
        <p>• <b>실제 진행회기 수</b>: [스케줄] 캘린더에서 치료사가 실제로 진행 완료(`completed`)한 회기 수</p>
        <p>• <b>정산 원칙</b>: 결제는 되었으나 결석/연기로 미진행된 수업은 급여 정산에서 제외되며, <b>다음 달 보강 진행 완료 시 해당 월 급여에 합산 정산</b>됩니다.</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-3.5">치료사명</th>
              <th className="p-3.5">근무 형태</th>
              <th className="p-3.5">급여 비율</th>
              <th className="p-3.5 text-center">결제 회기수</th>
              <th className="p-3.5 text-center">★ 실제 진행 회기수</th>
              <th className="p-3.5 text-center">미진행 (보강예정)</th>
              <th className="p-3.5 text-right">회기당 산정 단가</th>
              <th className="p-3.5 text-right font-bold text-emerald-800">최종 급여 정산액</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {therapists.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">{t.name}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                    {t.employmentType}
                  </span>
                </td>
                <td className="p-3.5 font-medium">{t.payRate}</td>
                <td className="p-3.5 text-center font-mono">{t.paidSessions}회</td>
                <td className="p-3.5 text-center font-mono font-bold text-emerald-700 bg-emerald-50/50">
                  {t.actualSessions}회
                </td>
                <td className="p-3.5 text-center font-mono text-amber-700">
                  {t.unconductedSessions > 0 ? `${t.unconductedSessions}회 (이월)` : "-"}
                </td>
                <td className="p-3.5 text-right font-mono">
                  {t.sessionFee.toLocaleString()}원
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-sm text-emerald-800">
                  {t.calculatedSalary.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
