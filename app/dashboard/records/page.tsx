"use client";

import { useState } from "react";

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<
    "logs" | "plan" | "mid_eval" | "final_eval"
  >("plan");

  const [isListening, setIsListening] = useState(false);
  const [activityText, setActivityText] = useState(
    "언어 치료 회기 진행: 발음 교정 및 단어 카드 맞추기 수행. 아동의 집중도가 높았으며 호응 반응이 매우 우수함."
  );

  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("현재 브라우저는 음성 인식을 지원하지 않습니다. Chrome 사용을 권장합니다.");
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "ko-KR";
      recognition.continuous = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setActivityText((prev) => prev + " " + transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📝</span> 치료 기록 및 서식 평가보고서
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            회차별 일반 치료기록 (STT 음성인식 지원) 및 3종 평가보고서 수시 수정 관리
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center bg-white p-2 rounded-2xl border border-slate-200 gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "logs"
              ? "bg-slate-800 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>✏️ 회차별 치료기록지</span>
        </button>

        <button
          onClick={() => setActiveTab("plan")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "plan"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
              : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
          }`}
        >
          <span>📄 [ 제공계획서 ]</span>
        </button>

        <button
          onClick={() => setActiveTab("mid_eval")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "mid_eval"
              ? "bg-teal-600 text-white shadow-md shadow-teal-900/20"
              : "text-teal-800 bg-teal-50 hover:bg-teal-100"
          }`}
        >
          <span>📊 [ 중간평가보고서 ]</span>
        </button>

        <button
          onClick={() => setActiveTab("final_eval")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "final_eval"
              ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/20"
              : "text-cyan-800 bg-cyan-50 hover:bg-cyan-100"
          }`}
        >
          <span>🏁 [ 종결평가보고서 ]</span>
        </button>
      </div>

      {activeTab === "logs" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-bold text-sm text-slate-800">
              ✍️ 회차별 치료 기록 작성 (음성 인식 STT 가능)
            </h2>
            <button
              onClick={toggleSpeechRecognition}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              <span>{isListening ? "🔴 음성 녹음 중..." : "🎤 음성으로 작성하기 (STT)"}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">
                주요 활동 내용 및 피드백 (음성 변환 지원)
              </label>
              <textarea
                rows={5}
                value={activityText}
                onChange={(e) => setActivityText(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 leading-relaxed"
              />
            </div>
            <div className="flex justify-end">
              <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 text-xs">
                기록지 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "plan" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-800">
                📄 발달재활서비스 제공계획서 (정부 공식 양식)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                언제든지 수시로 내용을 수정하고 단기/장기 목표를 업데이트 관리할 수 있습니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                🖨️ 인쇄 / PDF 저장
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500">
                저장 및 수시 업데이트
              </button>
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">대상 아동명</label>
                <input
                  type="text"
                  defaultValue="이지호 (202601자라는001)"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">담당 치료사</label>
                <input
                  type="text"
                  defaultValue="이채린 (언어재활)"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">장기 목표 (Long-term Goal)</label>
              <textarea
                rows={2}
                defaultValue="자발어 표현 빈도를 늘리고 자음 명확도를 80% 이상 개선한다."
                className="w-full p-2 border rounded bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">단기 목표 (Short-term Goal)</label>
              <textarea
                rows={2}
                defaultValue="주 2회 50분 회기 동안 단어 카드를 활용하여 2음절 단어 10개를 정확히 발음한다."
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "mid_eval" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-800">
                📊 발달재활서비스 중간평가보고서 (6개월 단위)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                6개월 치료 진행 후 변화 내용 및 달성도 평가
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                🖨️ 인쇄 / PDF 저장
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-500">
                중간평가 저장
              </button>
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">6개월간 주요 변화 및 발달 관찰</label>
              <textarea
                rows={4}
                defaultValue="초기 진단 대비 표정 반응 및 자발 표현력이 대폭 향상되었음."
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "final_eval" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-800">
                🏁 발달재활서비스 종결평가보고서 (12개월/종결 시)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                종결 시 최종 목표 달성도 및 종합 소견 작성
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                🖨️ 인쇄 / PDF 저장
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-500">
                종결평가 저장
              </button>
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">종결 종합 소견 및 추후 제언</label>
              <textarea
                rows={4}
                defaultValue="목표 발음 명확도 85% 달성하여 본 사업 종결을 추천함."
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
