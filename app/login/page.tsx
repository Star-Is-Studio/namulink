"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth, UserSession } from "@/lib/context/AuthContext";

// 기본 등록된 유저 샘플 데이터베이스 (DB / LocalStorage 회원가입 유저와 동시 검증)
const INITIAL_USERS: (UserSession & { password_hash: string })[] = [
  {
    name: "박하은",
    role: "admin",
    username: "박하은2607",
    password_hash: "0315",
    phone: "010-8807-5299",
    centerName: "자라는나무 아동발달센터 대전점",
  },
  {
    name: "이채린",
    role: "therapist",
    username: "이채린2504",
    password_hash: "0412",
    phone: "010-2465-4705",
    centerName: "자라는나무 아동발달센터 대전점",
  },
  {
    name: "박운지",
    role: "parent",
    username: "010-8807-5299",
    password_hash: "1234",
    phone: "010-8807-5299",
    centerName: "자라는나무 아동발달센터 대전점",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
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

    // 로컬스토리지에 저장된 신규 회원가입 유저 목록 불러오기
    let registeredUsers: (UserSession & { password_hash: string })[] = [...INITIAL_USERS];
    try {
      const customUsers = localStorage.getItem("namulink_registered_users");
      if (customUsers) {
        registeredUsers = [...registeredUsers, ...JSON.parse(customUsers)];
      }
    } catch {
      // ignore
    }

    // 유저 검증 (등록된 유저인지 확인)
    const foundUser = registeredUsers.find((u) => {
      const matchUsername =
        u.username.trim().toLowerCase() === username.trim().toLowerCase() ||
        (u.phone && u.phone.trim() === username.trim());
      const matchPassword = u.password_hash === password.trim();

      if (role === "staff") {
        return matchUsername && matchPassword && (u.role === "admin" || u.role === "therapist" || u.role === "staff");
      } else {
        return matchUsername && matchPassword && u.role === "parent";
      }
    });

    if (!foundUser) {
      setError(
        "❌ 등록되지 않은 계정이거나 아이디 또는 비밀번호가 올바르지 않습니다. 회원가입 후 진행해 주세요."
      );
      return;
    }

    // 로그인 성공 시 세션 생성 및 이동
    login({
      name: foundUser.name,
      role: foundUser.role,
      username: foundUser.username,
      phone: foundUser.phone,
      centerName: foundUser.centerName || "자라는나무 아동발달센터 대전점",
    });

    if (foundUser.role === "parent") {
      router.push("/parent-home");
    } else {
      router.push("/dashboard/children");
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
          onClick={() => {
            setRole("staff");
            setError("");
          }}
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
          onClick={() => {
            setRole("parent");
            setError("");
          }}
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
                : "예: 010-8807-5299"
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
                ? "비밀번호 (예: 0315)"
                : "비밀번호 (예: 1234)"
            }
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-300 bg-rose-950/60 p-3 rounded-xl border border-rose-500/40 font-medium leading-relaxed">
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

      {/* Sample Accounts Notice for Guide */}
      <div className="mt-4 p-3 bg-black/20 rounded-xl text-[11px] text-emerald-200/80 space-y-1">
        <p className="font-bold text-emerald-300">💡 등록된 로그인 테스트 계정</p>
        <p>• <b>직원 관리자</b>: 아이디 <code className="text-white">박하은2607</code> / 암호 <code className="text-white">0315</code></p>
        <p>• <b>치료사 계정</b>: 아이디 <code className="text-white">이채린2504</code> / 암호 <code className="text-white">0412</code></p>
        <p>• <b>학부모 계정</b>: 전화 <code className="text-white">010-8807-5299</code> / 암호 <code className="text-white">1234</code></p>
      </div>

      <div className="mt-4 text-center text-xs text-emerald-200/60 border-t border-white/10 pt-3 flex justify-between">
        <span>미등록 계정이신가요?</span>
        <Link href="/signup" className="text-emerald-300 font-bold underline">
          회원가입하기 ➔
        </Link>
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
