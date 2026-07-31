"use client";

import Link from "next/link";

export default function ParentHomePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* Mobile Header */}
        <div className="bg-teal-700 text-white p-6 text-center space-y-1">
          <span className="text-2xl">👨‍👩‍👧</span>
          <h1 className="font-bold text-lg">학부모 전용 포털</h1>
          <p className="text-xs text-teal-100">자라는나무 아동발달센터 (이지호 아동)</p>
        </div>

        {/* Action Menu */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center justify-between">
              <span>📝 치료기록지 열람</span>
              <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded font-bold">
                최근 2달 항시 열람
              </span>
            </h2>
            <p className="text-slate-600">
              담당 치료사가 작성한 최신 2개월 치료 기록 및 피드백을 확인하실 수 있습니다.
            </p>
            <button className="w-full py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500">
              기록지 열람하기
            </button>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center justify-between">
              <span>💳 납부 내역 확인</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                8월 완납
              </span>
            </h2>
            <p className="text-slate-600">
              이번 달 본인부담금 및 바우처 결제 완료 상태입니다.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <h2 className="font-bold text-slate-800 text-sm">
              ⚡ 결석 처리 & 빈시간 보강 신청
            </h2>
            <p className="text-slate-600">
              담당 치료사의 빈 타임을 확인하고 결석/보강을 직접 신청하실 수 있습니다.
            </p>
            <button className="w-full py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500">
              보강 가능 시간대 확인
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 text-center">
          <Link href="/login?role=parent" className="text-xs text-slate-400 hover:text-slate-600">
            ← 로그아웃
          </Link>
        </div>
      </div>
    </div>
  );
}
