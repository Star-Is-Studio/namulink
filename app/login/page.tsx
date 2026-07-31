"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const supabase = createClient();
  const initialRole = searchParams.get("role") || "staff";

  const [role, setRole] = useState<"staff" | "parent">(
    initialRole === "parent" ? "parent" : "staff"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // Supabase DB public.users 테이블에서 100% 조회 검증
      const { data: users, error: dbError } = await supabase
        .from("users")
        .select("*")
        .or(`username.eq.${username.trim()},phone.eq.${username.trim()}`)
        .eq("password_hash", password.trim());

      if (dbError) {
        throw new Error(`Supabase DB 조회 오류: ${dbError.message}`);
      }

      if (!users || users.length === 0) {
        setError(
          "❌ 등록되지 않은 계정이거나 아이디 또는 비밀번호가 올바르지 않습니다. 회원가입 후 진행해 주세요."
        );
        setIsLoading(false);
        return;
      }

      const foundUser = users[0];

      // 역할 검증
      if (role === "staff" && foundUser.role === "parent") {
        setError("직원 계정이 아닙니다. 학부모 로그인을 이용해 주세요.");
        setIsLoading(false);
        return;
      }

      // 로그인 성공 및 전역 세션 적용
      login({
        name: foundUser.name,
        role: foundUser.role,
        username: foundUser.username,
        phone: foundUser.phone,
        centerName: "자라는나무 아동발달센터 대전점",
      });

      if (foundUser.role === "parent") {
        router.push("/parent-home");
      } else {
        router.push("/dashboard/children");
      }
    } catch (err: any) {
      setError(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white">
      <div className="text-center space-y-2 mb-6">
        <span className="text-3xl">🌿</span>
        <h1 className="text-2xl font-bold text-white">나무링크 로그인</h1>
        <p className="text-xs text-emerald-200/70">
          Supabase DB 실시간 계정 인증
        </p>
      </div>

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

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-emerald-100 mb-1">
            {role === "staff" ? "로그인 아이디" : "학부모 휴대폰 번호"}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={
              role === "staff"
                ? "회원가입한 아이디 입력"
                : "예: 010-0000-0000"
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
            placeholder="비밀번호 입력"
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
          disabled={isLoading}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
            role === "staff"
              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50"
              : "bg-teal-600 hover:bg-teal-500 shadow-teal-900/50"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Supabase DB 조회 중..." : role === "staff" ? "직원 로그인" : "학부모 로그인"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-emerald-200/60 border-t border-white/10 pt-4 flex justify-between">
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
