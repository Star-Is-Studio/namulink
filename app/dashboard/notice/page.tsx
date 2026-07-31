"use client";

import { useState } from "react";

export default function NoticePage() {
  const [notices] = useState([
    {
      id: "n1",
      category: "공지",
      title: "🌿 8월 센터 휴관일 및 보강 일정 안내",
      author: "행정실",
      date: "2026-07-31",
      isPinned: true,
      content: "광복절 휴관으로 인한 차주 수업은 이월 보강 처리됩니다.",
    },
    {
      id: "n2",
      category: "이벤트",
      title: "8월 발달재활서비스 초기 평가 이벤트",
      author: "박하은",
      date: "2026-07-28",
      isPinned: false,
      content: "신규 아동 진입점 초기 상담지를 작성해 주시기 바랍니다.",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📢</span> 공지사항 관리
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            치료사 및 학부모 모바일 포털에 노출되는 센터 주요 알림
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500">
          + 공지 작성
        </button>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl bg-white border shadow-sm transition-all hover:border-emerald-300 ${
              n.isPinned ? "border-emerald-300 bg-emerald-50/20" : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {n.isPinned && (
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  📌 상단 고정
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                {n.category}
              </span>
              <h2 className="font-bold text-sm text-slate-900">{n.title}</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">{n.content}</p>
            <div className="text-[11px] text-slate-400 font-mono">
              작성자: {n.author} · {n.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
