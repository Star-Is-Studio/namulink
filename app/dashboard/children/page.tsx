"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface DBChild {
  child_id: string;
  mgmt_no: string;
  name: string;
  birth_date: string;
  gender: string;
  status: string;
  inflow_channel?: string;
  created_at?: string;
}

export default function ChildrenPage() {
  const supabase = createClient();
  const [childrenList, setChildrenList] = useState<DBChild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [newGender, setNewGender] = useState("남");
  const [newInflow, setNewInflow] = useState("본인");
  const [errorMsg, setErrorMsg] = useState("");

  // Supabase DB public.children에서만 실제 데이터 로드
  const fetchChildren = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("DB Fetch Error:", error.message);
        setChildrenList([]);
      } else {
        setChildrenList(data || []);
      }
    } catch (e: any) {
      console.error(e);
      setChildrenList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const filteredChildren = childrenList.filter((c) => {
    const matchesSearch =
      c.name.includes(searchTerm) || (c.mgmt_no && c.mgmt_no.includes(searchTerm));
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // DB 저장(INSERT) 성공 시에만 DB를 다시 읽어와 화면에 반영
  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newName || !newBirth) return;

    const newMgmtNo = `202601자라는${String(childrenList.length + 1).padStart(3, "0")}`;

    const { error } = await supabase.from("children").insert([
      {
        tenant_id: "daejeon_jarana",
        mgmt_no: newMgmtNo,
        name: newName.trim(),
        birth_date: newBirth,
        gender: newGender,
        status: "치료중",
        inflow_channel: newInflow,
      },
    ]);

    if (error) {
      setErrorMsg(`DB 저장 실패: ${error.message}`);
    } else {
      setIsModalOpen(false);
      setNewName("");
      setNewBirth("");
      // DB 실제 저장 완료 후 DB 재조회로 표출
      await fetchChildren();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👶</span> 아동 관리 목록 (Supabase DB 전용)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supabase DB public.children 실제 레코드만 실시간 조회 및 저장
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setErrorMsg("");
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-all"
        >
          + 신규 아동 등록
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="아동명 또는 관리자번호 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs w-64 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          {["all", "치료중", "휴식", "종결"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                statusFilter === st
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st === "all" ? "전체 보기" : st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-3.5">관리자번호</th>
              <th className="p-3.5">아동명</th>
              <th className="p-3.5">생년월일 / 성별</th>
              <th className="p-3.5">유입경로</th>
              <th className="p-3.5">상태</th>
              <th className="p-3.5 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  Supabase DB에서 실제 아동 데이터를 로딩 중입니다...
                </td>
              </tr>
            ) : filteredChildren.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  Supabase DB에 저장된 아동이 없습니다. [+ 신규 아동 등록]을 눌러 DB에 등록해 주세요.
                </td>
              </tr>
            ) : (
              filteredChildren.map((c) => (
                <tr key={c.child_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-emerald-700">
                    {c.mgmt_no}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="p-3.5">
                    {c.birth_date} ({c.gender})
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {c.inflow_channel || "본인"}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        c.status === "치료중"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.status === "휴식"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 text-[11px]">
                      프로필
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800">👶 Supabase DB 신규 아동 등록</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddChild} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">아동명 *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="예: 김현우"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">생년월일 *</label>
                  <input
                    type="date"
                    required
                    value={newBirth}
                    onChange={(e) => setNewBirth(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">성별</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">유입 경로</label>
                <select
                  value={newInflow}
                  onChange={(e) => setNewInflow(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="아웃리치">아웃리치</option>
                  <option value="본인">본인 직접 신청</option>
                  <option value="소개">의뢰/소개</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                  {errorMsg}
                </p>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500"
                >
                  Supabase DB에 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
