"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NoticePage() {
  const supabase = createClient();
  const [notices, setNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.from("notices").select("*");
      setNotices(data || []);
    } catch {
      setNotices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📢</span> 공지사항 관리 (Supabase DB 전용)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supabase DB에 등록된 센터 알림
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500">
          + 공지 작성
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-xs text-slate-400 text-center py-10 bg-white rounded-2xl border">
            Supabase DB에서 공지를 로딩 중입니다...
          </p>
        ) : notices.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-10 bg-white rounded-2xl border">
            Supabase DB에 등록된 공지사항이 없습니다. [+ 공지 작성]을 눌러 등록해 주세요.
          </p>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
            >
              <h2 className="font-bold text-sm text-slate-900 mb-2">{n.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{n.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
