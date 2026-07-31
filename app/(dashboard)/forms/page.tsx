"use client";

import { useState } from "react";

export default function FormsPage() {
  const [forms] = useState([
    {
      id: "f1",
      name: "발달재활서비스 개인정보 제공 동의서.pdf",
      category: "서식",
      size: "240 KB",
      uploader: "박하은",
      date: "2026-07-25",
    },
    {
      id: "f2",
      name: "초기상담 및 평가 신청서 양식.docx",
      category: "양식",
      size: "1.2 MB",
      uploader: "이채린",
      date: "2026-07-20",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📂</span> 자료실 및 문서 양식
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
            {forms.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    {f.category}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-slate-900">{f.name}</td>
                <td className="p-3.5 font-mono text-slate-500">{f.size}</td>
                <td className="p-3.5">{f.uploader}</td>
                <td className="p-3.5 font-mono text-slate-500">{f.date}</td>
                <td className="p-3.5 text-right">
                  <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold">
                    ⬇ 다운로드
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
