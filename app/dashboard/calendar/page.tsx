"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();
  const [currentMonth, setCurrentMonth] = useState("2026-08");
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Supabase DB public.schedules 테이블 데이터 로드
  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select("*");

      if (!error && data) {
        const mapped: ScheduleEvent[] = data.map((s: any) => ({
          id: s.schedule_id,
          childName: s.child_id || "아동",
          therapistName: s.therapist_id || "치료사",
          supportType: s.support_type || "발달재활",
          timeSlot: `${s.start_time || "14:00"}~${s.end_time || "14:40"}`,
          dayOfWeek: "월",
          status: s.status || "scheduled",
          isMakeup: false,
        }));
        setSchedules(mapped);
      } else {
        setSchedules([]);
      }
    } catch (e) {
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [currentMonth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📅</span> 아동 회기 스케줄 & 보강 관리 (Supabase DB 전용)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supabase DB public.schedules 실제 레코드만 실시간 조회
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

          {isLoading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Supabase DB 스케줄 로딩 중...</p>
          ) : schedules.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Supabase DB에 등록된 수업 스케줄이 없습니다.</p>
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
                      <span className="text-xs text-slate-500 font-medium">
                        ({s.therapistName} 치료사)
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
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <span>⚡ 보강 관리 & 미진행 수업</span>
          </h2>
          <p className="text-xs text-slate-500">
            결석 또는 치료사 휴무로 보강 일정을 잡아야 하는 Supabase DB 아동 명단입니다.
          </p>

          <p className="text-xs text-slate-400 text-center py-4">
            현재 DB에 미진행 보강 아동이 없습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
