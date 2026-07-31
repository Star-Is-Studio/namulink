"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [role, setRole] = useState<"staff" | "parent">("staff");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [centerCode, setCenterCode] = useState("daejeon_jarana");
  const [error, setError] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !username || !password || !phone) {
      setError("모든 필수 입력항목을 작성해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 회원가입 유저 목록에 저장
    const newUser = {
      name,
      role: role === "staff" ? ("admin" as const) : ("parent" as const),
      username,
      password_hash: password,
      phone,
      centerName: "자라는나무 아동발달센터 대전점",
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("namulink_registered_users") || "[]"
      );
      localStorage.setItem(
        "namulink_registered_users",
        JSON.stringify([...existing, newUser])
      );
    } catch {
      // ignore
    }

    // 회원가입 성공 및 세션 저장
    signup(newUser);

    if (role === "staff") {
      router.push("/dashboard/children");
    } else {
      router.push("/parent-home");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <span className="text-3xl">🌿</span>
          <h1 className="text-2xl font-bold text-white">나무링크 회원가입</h1>
          <p className="text-xs text-emerald-200/70">
            신규 계정 생성 및 자라는나무 아동발달센터 연동
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
            👩‍⚕️ 직원 (관리자/치료사)
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
            👨‍👩‍👧 학부모
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-emerald-100 mb-1">
              성함 *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-emerald-100 mb-1">
              {role === "staff" ? "로그인 아이디 *" : "학부모 휴대폰 번호 *"}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === "staff" ? "예: hong123" : "010-0000-0000"}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-emerald-100 mb-1">
              연락처 (휴대폰) *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-emerald-100 mb-1">
                비밀번호 *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-emerald-100 mb-1">
                비밀번호 확인 *
              </label>
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 확인"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-emerald-100 mb-1">
              소속 센터 코드
            </label>
            <input
              type="text"
              value={centerCode}
              onChange={(e) => setCenterCode(e.target.value)}
              placeholder="daejeon_jarana"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-200/40 text-xs focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-lg mt-2 ${
              role === "staff"
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50"
                : "bg-teal-600 hover:bg-teal-500 shadow-teal-900/50"
            }`}
          >
            회원가입 완료 및 서비스 시작
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-emerald-200/60 pt-3 border-t border-white/10">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-emerald-300 font-bold underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
