"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";

export default function ParentHomePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"logs" | "payments" | "makeup">("logs");

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* Mobile Header */}
        <div className="bg-teal-700 text-white p-6 text-center space-y-1">
          <span className="text-3xl">👨‍👩‍👧</span>
          <h1 className="font-bold text-lg">[PRD] 학부모 모바일 PWA 포털</h1>
          <p className="text-xs text-teal-100">
            자라는나무 대전점 · {user?.name || "보호자"} 님
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-50 border-b border-slate-200 p-1 text-xs">
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === "logs"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📝 2달 기록지
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === "payments"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            💳 납부 내역
          </button>
          <button
            onClick={() => setActiveTab("makeup")}
            className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === "makeup"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ⚡ 결석/보강 신청
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4 text-xs">
          {activeTab === "logs" && (
            <div className="space-y-3">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">
                    📝 최근 2개월 치료 기록지 열람
                  </span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                    상시 오픈
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  담당 치료사가 작성한 회차별 발달 관찰 및 가정 연계 피드백이 실시간 표출됩니다.
                </p>
                <div className="p-3 bg-white rounded-xl border text-[11px] text-slate-500">
                  등록된 2개월 이내 치료 기록이 없습니다.
                </div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">
                    💳 당월 본인부담금 & 바우처 수납 상태
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  매달 납부 내역 및 완납 완료 상태를 모바일에서 실시간 확인하실 수 있습니다.
                </p>
                <div className="p-3 bg-white rounded-xl border text-[11px] text-slate-500 text-center">
                  Supabase DB에 수납 내역이 조회됩니다.
                </div>
              </div>
            </div>
          )}

          {activeTab === "makeup" && (
            <div className="space-y-3">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <span className="font-bold text-amber-900 text-sm">
                  ⚡ 빈 타임(Empty Time-slot) 조회 및 보강 신청
                </span>
                <p className="text-amber-800 leading-relaxed">
                  • <b>발본</b>: 당월 내 보강 원칙<br />
                  • <b>발추 및 센터</b>: 다음 달 이월 보강 신청 가능
                </p>
                <button
                  onClick={() => alert("담당 치료사의 빈 타임스케줄을 확인하여 신청이 접수됩니다.")}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  담당 치료사 빈 타임 스케줄 조회
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ← 로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
