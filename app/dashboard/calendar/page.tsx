"use client";

import { useState } from "react";

interface ScheduleEvent {
  id: string;
  childName: string;
  therapistName: string;
  supportType: string;
  timeSlot: string;
  dayOfWeek: string;
  status: "scheduled" | "completed" | "absent_child" | "makeup_needed" | "makeup_done";
  isMakeup: boolean;
  handoffNote?: string;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("2026-08");

  const [schedules] = useState<ScheduleEvent[]>([
    {
      id: "s1",
      childName: "이지호",
      therapistName: "이채린",
      supportType: "발달재활서비스 (발본)",
      timeSlot: "14:00~14:40",
      dayOfWeek: "월",
      status: "scheduled",
      isMakeup: false,
    },
    {
      id: "s2",
      childName: "김지우",
      therapistName: "신슬기",
      supportType: "방과후활동비",
      timeSlot: "15:00~15:40",
      dayOfWeek: "화",
      status: "makeup_needed",
      isMakeup: true,
      handoffNote: "신슬기→박하은 인수인계 중",
    },
    {
      id: "s3",
      childName: "서승현",
      therapistName: "정다혜",
      supportType: "센터비용",
      timeSlot: "16:00~16:40",
      dayOfWeek: "수",
      status: "completed",
      isMakeup: false,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📅</span> 아동 회기 스케줄 & 보강 관리
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            월별 스케줄 자동 배치, 아동 결석/치료사 휴가에 따른 보강 명단 관리 (발본 당월 / 발추·센터 이월 연동)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white"
          />
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-800 space-y-1">
        <p className="font-bold flex items-center gap-1">
          <span>💡 회기 및 보강 자동 제어 규칙</span>
        </p>
        <p>• <b>발달재활 본인부담 (발본)</b>: 당월 내 보강 원칙 (미진행 시 이월 불가)</p>
        <p>• <b>발달재활 추가 (발추) 및 센터 수업</b>: 이월 보강 가능 (다음 달 보강 탭으로 자동 연동)</p>
        <p>• <b>치료사 휴가 및 인수인계</b>: 치료사 휴가 시 수업 자동 휴무 및 보강 필요 탭에 배치되며, 인수인계 아동은 1달간 인계 표기 노출</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-sm text-slate-800 flex items-center justify-between">
            <span>🗓 이번 주 수업 일정</span>
            <span className="text-xs text-slate-400 font-normal">총 {schedules.length}건</span>
          </h2>

          <div className="space-y-2">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {s.childName}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({s.therapistName} 치료사)
                    </span>
                    {s.handoffNote && (
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">
                        🤝 {s.handoffNote}
                      </span>
                    )}
                    {s.isMakeup && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        ⚡ 보강 수업
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>{s.supportType}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      {s.dayOfWeek}요일 {s.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    defaultValue={s.status}
                    className="text-xs p-2 rounded-lg border bg-white font-semibold"
                  >
                    <option value="scheduled">예정</option>
                    <option value="completed">정상 진행 완료</option>
                    <option value="absent_child">아동 결석</option>
                    <option value="makeup_needed">보강 필요</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <span>⚡ 보강 관리 & 미진행 수업</span>
          </h2>
          <p className="text-xs text-slate-500">
            결석 또는 치료사 휴무로 보강 일정을 잡아야 하는 아동 명단입니다.
          </p>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-900">김지우 (방과후활동비)</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                이월 가능
              </span>
            </div>
            <p className="text-amber-800">
              결석 사유: 개인 사정 결석 (7/28)
            </p>
            <button className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px]">
              보강 일자 지정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
