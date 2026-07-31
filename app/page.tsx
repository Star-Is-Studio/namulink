import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <main className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-14 shadow-2xl flex flex-col items-center text-center space-y-8">
        
        {/* Logo & Title Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-medium">
            🌿 자라는나무 아동발달센터 웹 통합 관리 시스템
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            나무링크 <span className="text-emerald-400 font-normal text-3xl md:text-5xl">(NamuLink)</span>
          </h1>
          <p className="text-emerald-100/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            아동 관리, 회기 스케줄/보강, 바우처 결제, 치료기록지 및 3종 평가보고서를 한곳에서 관리하는 엔터프라이즈 스마트 포털
          </p>
        </div>

        {/* Action Buttons & Portal Entry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl pt-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-all hover:-translate-y-1 flex flex-col items-center justify-between text-center space-y-4">
            <div className="text-3xl">👩‍⚕️</div>
            <div>
              <h2 className="font-bold text-lg text-white">직원 / 관리자 포털</h2>
              <p className="text-xs text-emerald-200/70 mt-1">센터 행정, 스케줄, 결제, 정산</p>
            </div>
            <Link
              href="/login?role=staff"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm transition-colors shadow-lg shadow-emerald-900/40"
            >
              직원 로그인
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-all hover:-translate-y-1 flex flex-col items-center justify-between text-center space-y-4">
            <div className="text-3xl">👨‍👩‍👧</div>
            <div>
              <h2 className="font-bold text-lg text-white">학부모 포털 (PWA)</h2>
              <p className="text-xs text-emerald-200/70 mt-1">기록지 열람, 납부 확인, 보강 신청</p>
            </div>
            <Link
              href="/login?role=parent"
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 font-semibold text-sm transition-colors shadow-lg shadow-teal-900/40"
            >
              학부모 로그인
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-all hover:-translate-y-1 flex flex-col items-center justify-between text-center space-y-4">
            <div className="text-3xl">📊</div>
            <div>
              <h2 className="font-bold text-lg text-white">Supabase v2 DB</h2>
              <p className="text-xs text-emerald-200/70 mt-1">14개 엔터프라이즈 RDB 연결</p>
            </div>
            <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="pt-6 border-t border-white/10 w-full flex flex-wrap justify-center items-center gap-6 text-xs text-emerald-200/60">
          <span>✅ Next.js 14 App Router</span>
          <span>✅ Supabase RDB (v2.0)</span>
          <span>✅ Vercel Edge Deployment</span>
          <span>✅ STT 음성인식 지원</span>
        </div>

      </main>

      <footer className="mt-8 text-xs text-emerald-200/40 z-10">
        © 2026 자라는나무 아동발달센터 · 나무링크 (namulink.kr)
      </footer>
    </div>
  );
}
