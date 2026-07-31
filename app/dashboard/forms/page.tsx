"use client";

import { useState } from "react";

export default function FormsPage() {
  const [forms] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📂</span> 자료실 및 문서 양식 (Supabase DB 전용)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            정부 서식, 각종 동의서 및 신규 등록 서류 관리
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500">
          + 서식 업로드
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-3.5">카테고리</th>
              <th className="p-3.5">파일명</th>
              <th className="p-3.5">용량</th>
              <th className="p-3.5">등록자</th>
              <th className="p-3.5">등록일</th>
              <th className="p-3.5 text-right">다운로드</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {forms.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  Supabase DB에 등록된 문서 서식이 없습니다. 우측 상단 [+ 서식 업로드]로 등록해 주세요.
                </td>
              </tr>
            ) : (
              forms.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">{f.category}</td>
                  <td className="p-3.5 font-bold text-slate-900">{f.name}</td>
                  <td className="p-3.5 font-mono text-slate-500">{f.size}</td>
                  <td className="p-3.5">{f.uploader}</td>
                  <td className="p-3.5 font-mono text-slate-500">{f.date}</td>
                  <td className="p-3.5 text-right">
                    <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold">
                      ⬇ 다운로드
                    </button>
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
