"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface PRDScheduleEvent {
  id: string;
  child_id: string;
  childName?: string;
  therapistName?: string;
  support_type?: string;
  scheduled_at: string;
  status: "ATTENDED" | "ABSENT" | "MAKEUP_NEEDED" | "MAKEUP_COMPLETED";
  is_makeup: boolean;
  handoff_note?: string;
}

export default function CalendarPage() {
  const supabase = createClient();
  const [currentMonth, setCurrentMonth] = useState("2026-08");
  const [schedules, setSchedules] = useState<PRDScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Supabase DB schedules 및 children 조인 조회
  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select("*, children(name)");

      if (!error && data) {
        const mapped: PRDScheduleEvent[] = data.map((s: any) => ({
          id: s.id,
          child_id: s.child_id,
          childName: s.children?.name || "아동",
          therapistName: "담당치료사",
          support_type: s.support_type || "발달재활",
          scheduled_at: s.scheduled_at,
          status: s.status || "ATTENDED",
          is_makeup: s.is_makeup || false,
          handoff_note: s.handoff_note,
        }));
        setSchedules(mapped);
      } else {
        setSchedules([]);
      }
    } catch {
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [currentMonth]);

  // 스케줄 상태 변경 (PRD 보강 자동 감지 트레이스)
  const handleStatusUpdate = async (scheduleId: string, newStatus: string) => {
    let statusToUpdate = newStatus;
    if (newStatus === "ABSENT") {
      // 결석 선택 시 즉시 '보강 필요(MAKEUP_NEEDED)' 상태로 트래킹
      statusToUpdate = "MAKEUP_NEEDED";
    }

    const { error } = await supabase
      .from("schedules")
      .update({ status: statusToUpdate })
      .eq("id", scheduleId);

    if (!error) {
      fetchSchedules();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📅</span> [PRD] 스케줄 & 보강 자동화 모듈
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            4주/5주차 자동 회기, 결석 시 보강감지 트레이스 & [인계] 뱃지 연동 (Supabase DB 전용)
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

      {/* Rules Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-800 space-y-1">
        <p className="font-bold flex items-center gap-1">
          <span>💡 PRD 핵심 보강 및 인수인계 자동 제어 규칙</span>
        </p>
        <p>• <b>보강 자동 감지</b>: 결석/휴무 발생 시 즉시 [MAKEUP_NEEDED] 상태로 자동 전환 및 명단 인입</p>
        <p>• <b>발달재활 본사업 (발본)</b>: 당월 내 보강 원칙 / <b>발추 및 센터 수업</b>: 다음 달 이월 허용</p>
        <p>• <b>치료사 인수인계 뱃지</b>: 인수인계 지정 아동은 스케줄 표 상 아동명 뒤 <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">[인계]</span> 뱃지가 1개월간 자동 노출 후 소멸</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Schedule Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-sm text-slate-800 flex items-center justify-between">
            <span>🗓 이번 주 회기 일정</span>
            <span className="text-xs text-slate-400 font-normal">총 {schedules.length}건</span>
          </h2>

          {isLoading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Supabase DB 스케줄 로딩 중...</p>
          ) : schedules.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Supabase DB에 등록된 스케줄이 없습니다.</p>
          ) : (
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
                      {s.handoff_note && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">
                          [인계] {s.handoff_note}
                        </span>
                      )}
                      {s.is_makeup && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          ⚡ 보강 수업
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {new Date(s.scheduled_at).toLocaleString("ko-KR")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusUpdate(s.id, e.target.value)}
                      className="text-xs p-2 rounded-lg border bg-white font-semibold"
                    >
                      <option value="ATTENDED">진행 완료</option>
                      <option value="ABSENT">결석 (보강필요 전환)</option>
                      <option value="MAKEUP_NEEDED">보강 필요 명단</option>
                      <option value="MAKEUP_COMPLETED">보강 완료</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Makeup Tracking List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <span>⚡ 보강(Make-up) 자동 감지 트레이스</span>
          </h2>
          <p className="text-xs text-slate-500">
            결석 또는 휴무로 인해 보강 일정을 잡아야 하는 아동 명단입니다.
          </p>

          {schedules.filter((s) => s.status === "MAKEUP_NEEDED").length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              현재 DB에 보강이 필요한 아동이 없습니다.
            </p>
          ) : (
            schedules
              .filter((s) => s.status === "MAKEUP_NEEDED")
              .map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-900">{s.childName}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                      보강 필요
                    </span>
                  </div>
                  <button
                    onClick={() => handleStatusUpdate(s.id, "MAKEUP_COMPLETED")}
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px]"
                  >
                    보강 일자 완료 처리
                  </button>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
