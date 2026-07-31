"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/children", label: "아동 관리", icon: "👶" },
  { href: "/dashboard/calendar", label: "아동 스케줄", icon: "📅" },
  { href: "/dashboard/records", label: "치료 기록", icon: "📝" },
  { href: "/dashboard/payments", label: "납부 관리", icon: "💳" },
  { href: "/dashboard/therapists", label: "치료사 관리", icon: "👩‍⚕️" },
  { href: "/dashboard/notice", label: "공지사항", icon: "📢" },
  { href: "/dashboard/forms", label: "자료실", icon: "📂" },
  { href: "/dashboard/accounting", label: "회계 관리", icon: "📊" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-emerald-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard/children" className="flex items-center gap-2 font-bold text-xl">
            <span>🌿</span>
            <span>나무링크</span>
            <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded text-emerald-200 font-normal">
              대전점
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <span className="bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-600/40 text-emerald-100">
              👩‍⚕️ 박하은 (행정관리자)
            </span>
            <Link
              href="/login"
              className="text-emerald-200 hover:text-white transition-colors"
            >
              로그아웃
            </Link>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="bg-emerald-900/90 border-t border-emerald-700/50">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? "border-emerald-400 text-white bg-emerald-800/50"
                      : "border-transparent text-emerald-200/70 hover:text-white hover:bg-emerald-800/30"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © 2026 자라는나무 아동발달센터 · 나무링크 (namulink.kr)
      </footer>
    </div>
  );
}
