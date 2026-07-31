"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChildrenPage() {
  const supabase = createClient();
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newInflow, setNewInflow] = useState("본인");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchChildren = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setChildrenList(data);
      } else {
        setChildrenList([]);
      }
    } catch {
      setChildrenList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newName || !newBirth) return;

    // 1차 시도: parent_phone 포함 insert
    const insertObj: any = {
      name: newName.trim(),
      birth_date: newBirth,
      status: "ACTIVE",
      address: newAddress.trim(),
      inflow_channel: newInflow,
    };

    if (newPhone.trim()) {
      insertObj.parent_phone = newPhone.trim();
    }

    let { error } = await supabase.from("children").insert([insertObj]);

    // 스키마 캐시 컬럼 에러(parent_phone 컬럼 없음) 발생 시 호환 커버리지 2차 시도
    if (error && error.message.includes("parent_phone")) {
      delete insertObj.parent_phone;
      const res2 = await supabase.from("children").insert([insertObj]);
      error = res2.error;
    }

    if (error) {
      setErrorMsg(`DB 저장 실패: ${error.message}`);
    } else {
      setIsModalOpen(false);
      setNewName("");
      setNewBirth("");
      setNewPhone("");
      setNewAddress("");
      await fetchChildren();
    }
  };

  const filteredChildren = childrenList.filter((c) => {
    const matchesSearch = c.name && c.name.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👶</span> 아동 관리 목록
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supabase DB children 스키마 실시간 조회 및 안전 저장
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setErrorMsg("");
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          + 신규 아동 등록
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="아동명 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs w-64 focus:outline-none focus:border-emerald-500"
        />

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          {[
            { key: "all", label: "전체" },
            { key: "ACTIVE", label: "치료중" },
            { key: "PAUSED", label: "휴식" },
            { key: "TERMINATED", label: "종결" },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                statusFilter === st.key
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-3.5">아동명</th>
              <th className="p-3.5">생년월일</th>
              <th className="p-3.5">보호자 연락처</th>
              <th className="p-3.5">유입경로</th>
              <th className="p-3.5">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Supabase DB 데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : filteredChildren.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  DB에 등록된 아동이 없습니다. 우측 상단 [+ 신규 아동 등록]으로 등록해 주세요.
                </td>
              </tr>
            ) : (
              filteredChildren.map((c, idx) => (
                <tr key={c.id || c.child_id || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="p-3.5 font-mono">{c.birth_date}</td>
                  <td className="p-3.5 font-mono">{c.parent_phone || "-"}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {c.inflow_channel || "본인"}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {c.status || "ACTIVE"}
                    </span>
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
              <h3 className="font-bold text-slate-800">👶 Supabase DB 아동 신규 등록</h3>
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
                <label className="block font-semibold mb-1">보호자 연락처</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full p-2 border rounded-lg"
                />
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
                  Supabase DB 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
