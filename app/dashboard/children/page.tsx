"use client";

import { useState } from "react";

interface DummyChild {
  id: string;
  mgmt_no: string;
  name: string;
  birth: string;
  gender: string;
  guardian: string;
  phone: string;
  status: "치료중" | "휴식" | "종결";
  inflow_channel: string;
  therapies: { support: string; therapist: string; cycle: string; fee: number }[];
}

export default function ChildrenPage() {
  const [childrenList, setChildrenList] = useState<DummyChild[]>([
    {
      id: "ch_1",
      mgmt_no: "202601자라는001",
      name: "이지호",
      birth: "2023-09-03",
      gender: "남",
      guardian: "박운지(모)",
      phone: "010-8807-5299",
      status: "치료중",
      inflow_channel: "아웃리치",
      therapies: [
        { support: "발달재활서비스", therapist: "이채린", cycle: "월,수", fee: 65000 },
        { support: "센터비용", therapist: "정다혜", cycle: "금", fee: 50000 },
      ],
    },
    {
      id: "ch_2",
      mgmt_no: "202601자라는002",
      name: "김지우",
      birth: "2022-06-28",
      gender: "여",
      guardian: "이진실(모)",
      phone: "010-9496-7630",
      status: "치료중",
      inflow_channel: "소개",
      therapies: [
        { support: "방과후활동비", therapist: "신슬기", cycle: "화,목", fee: 60000 },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [newGender, setNewGender] = useState("남");
  const [newGuardian, setNewGuardian] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newInflow, setNewInflow] = useState("본인");

  const filteredChildren = childrenList.filter((c) => {
    const matchesSearch =
      c.name.includes(searchTerm) || c.mgmt_no.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBirth) return;

    const newMgmtNo = `202601자라는${String(childrenList.length + 1).padStart(3, "0")}`;
    const newChild: DummyChild = {
      id: `ch_${Date.now()}`,
      mgmt_no: newMgmtNo,
      name: newName,
      birth: newBirth,
      gender: newGender,
      guardian: newGuardian,
      phone: newPhone,
      status: "치료중",
      inflow_channel: newInflow,
      therapies: [],
    };

    setChildrenList([newChild, ...childrenList]);
    setIsModalOpen(false);
    setNewName("");
    setNewBirth("");
    setNewGuardian("");
    setNewPhone("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👶</span> 아동 관리 목록
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            신규 아동 상담/유입경로 등록부터 치료 과목 및 종결 이력 통합 관리
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
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
              <th className="p-3.5">보호자 / 연락처</th>
              <th className="p-3.5">유입경로</th>
              <th className="p-3.5">담당 치료 및 시간</th>
              <th className="p-3.5">상태</th>
              <th className="p-3.5 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredChildren.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400">
                  등록된 아동이 없습니다.
                </td>
              </tr>
            ) : (
              filteredChildren.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-emerald-700">
                    {c.mgmt_no}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="p-3.5">
                    {c.birth} ({c.gender})
                  </td>
                  <td className="p-3.5">
                    <div>{c.guardian}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.phone}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {c.inflow_channel}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {c.therapies.length === 0 ? (
                      <span className="text-slate-400">등록 과목 없음</span>
                    ) : (
                      <div className="space-y-1">
                        {c.therapies.map((t, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              {t.support}
                            </span>
                            <span className="text-slate-600">
                              {t.therapist} ({t.cycle})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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
              <h3 className="font-bold text-slate-800">👶 신규 아동 등록</h3>
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
                  placeholder="예: 홍길동"
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
                <label className="block font-semibold mb-1">보호자 성함 (관계)</label>
                <input
                  type="text"
                  value={newGuardian}
                  onChange={(e) => setNewGuardian(e.target.value)}
                  placeholder="예: 홍부모(모)"
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
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
