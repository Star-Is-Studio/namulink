"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "staff";

  const [role, setRole] = useState<"staff" | "parent">(
    initialRole === "parent" ? "parent" : "staff"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    if (role === "staff") {
      router.push("/dashboard/children");
    } else {
      router.push("/parent-home");
    }
  };

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <span className="text-3xl">🌿</span>
        <h1 className="text-2xl font-bold text-white">나무링크 로그인</h1>
        <p className="text-xs text-emerald-200/70">
          자라는나무 아동발달센터 통합 관리 시스템
        </p>
      </div>

      {/* Role Tab */}
      <div className="flex bg-black/20 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setRole("staff")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            role === "staff"
              ? "bg-emerald-600 text-white shadow-md"
              : "text-emerald-200/60 hover:text-white"
          }`}
        >
          👩‍⚕️ 직원 로그인
        </button>
        <button
          type="button"
          onClick={() => setRole("parent")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            role === "parent"
              ? "bg-teal-600 text-white shadow-md"
              : "text-emerald-200/60 hover:text-white"
          }`}
        >
          👨‍👩‍👧 학부모 로그인
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-emerald-100 mb-1">
            {role === "staff" ? "아이디 (또는 이름)" : "학부모 휴대폰 번호"}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={
              role === "staff"
                ? "예: 박하은2607 · 관리자"
                : "예: 010-1234-5678"
            }
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-emerald-100 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              role === "staff"
                ? "생년월일 4자리 (MMDD)"
                : "초기 비밀번호"
            }
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
            role === "staff"
              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50"
              : "bg-teal-600 hover:bg-teal-500 shadow-teal-900/50"
          }`}
        >
          {role === "staff" ? "직원 로그인" : "학부모 로그인"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-emerald-200/40 border-t border-white/10 pt-4">
        도움이 필요하신가요? 센터 행정실에 문의해 주세요.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-950 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">로딩 중...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
