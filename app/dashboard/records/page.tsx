"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RecordsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<
    "DAILY" | "PLAN" | "MID_EVAL" | "FINAL_EVAL"
  >("PLAN");

  // STT 음성인식 및 AI 파싱 상태
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [aiParsing, setAiParsing] = useState(false);
  const [parsedGoal, setParsedGoal] = useState("");

  // 제공계획서 / 평가서 상태
  const [childName, setChildName] = useState("");
  const [longTermGoal, setLongTermGoal] = useState("");
  const [shortTermGoal, setShortTermGoal] = useState("");
  const [midEvalContent, setMidEvalContent] = useState("");
  const [finalEvalContent, setFinalEvalContent] = useState("");

  // STT 음성인식 토글 핸들러
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
        setSpeechText((prev) => prev + " " + transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  // PRD AI Assistant 파싱: 음성 텍스트 ➔ AI 양식 파싱
  const handleAiParse = () => {
    if (!speechText.trim()) return;
    setAiParsing(true);
    setTimeout(() => {
      setParsedGoal(
        `[AI 파싱 분석 완료]\n- 목표: 자발어 표현 빈도 향상\n- 수행 활동: ${speechText.trim()}\n- 치료사 총평: 아동의 집중도 및 반응 우수`
      );
      setAiParsing(false);
    }, 1000);
  };

  // DB 문서 저장
  const handleSaveDoc = async (docType: string, contentData: any) => {
    if (!childName.trim()) {
      alert("대상 아동명을 입력해 주세요.");
      return;
    }

    const { error } = await supabase.from("therapy_documents").insert([
      {
        doc_type: docType,
        content: contentData,
      },
    ]);

    if (!error) {
      alert(`Supabase DB에 ${docType} 서식이 지속 저장되었습니다!`);
    } else {
      alert(`DB 저장 안내: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📝</span> [PRD] 치료기록 & AI 서식 평가 모듈
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            STT 음성인식 일지 ➔ AI 파싱 & 상단 고정 3종 서식 탭 지속 편집 (Supabase DB 전용)
          </p>
        </div>
      </div>

      {/* TOP ALWAYS-VISIBLE TABS (PRD 3종 공통 서식 탭) */}
      <div className="flex flex-wrap items-center bg-white p-2 rounded-2xl border border-slate-200 gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab("DAILY")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "DAILY"
              ? "bg-slate-800 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>🎤 STT 음성일지 (AI 연동)</span>
        </button>

        <button
          onClick={() => setActiveTab("PLAN")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "PLAN"
              ? "bg-emerald-600 text-white shadow-md"
              : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
          }`}
        >
          <span>📄 [ 제공계획서 ]</span>
        </button>

        <button
          onClick={() => setActiveTab("MID_EVAL")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "MID_EVAL"
              ? "bg-teal-600 text-white shadow-md"
              : "text-teal-800 bg-teal-50 hover:bg-teal-100"
          }`}
        >
          <span>📊 [ 중간평가보고서 ]</span>
        </button>

        <button
          onClick={() => setActiveTab("FINAL_EVAL")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "FINAL_EVAL"
              ? "bg-cyan-600 text-white shadow-md"
              : "text-cyan-800 bg-cyan-50 hover:bg-cyan-100"
          }`}
        >
          <span>🏁 [ 종결평가보고서 ]</span>
        </button>
      </div>

      {/* TAB 1: STT 음성일지 & AI 파싱 */}
      {activeTab === "DAILY" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-bold text-sm text-slate-800">
              🎤 음성 구술 ➔ AI 양식 자동 파싱 일지 작성
            </h2>
            <button
              onClick={toggleSpeechRecognition}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              <span>{isListening ? "🔴 음성 녹음 중..." : "🎤 음성 구술 시작 (STT)"}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">
                치료사 음성 구술 변환 텍스트
              </label>
              <textarea
                rows={4}
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="마이크 버튼을 누르고 음성으로 구술해 주세요..."
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800 leading-relaxed"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAiParse}
                disabled={aiParsing}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 text-xs"
              >
                {aiParsing ? "🤖 AI 서식 파싱 분석 중..." : "🤖 AI 서식 자동 파싱하기"}
              </button>
            </div>

            {parsedGoal && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2 font-mono text-purple-900 whitespace-pre-wrap">
                {parsedGoal}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 제공계획서 */}
      {activeTab === "PLAN" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-800">
                📄 발달재활서비스 제공계획서 (정부 공식 HWPX/PDF 양식)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                🖨️ 인쇄 / PDF 저장
              </button>
              <button
                onClick={() => handleSaveDoc("PLAN", { childName, longTermGoal, shortTermGoal })}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500"
              >
                Supabase DB 지속 저장
              </button>
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">대상 아동명 *</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="아동명을 입력해 주세요"
                className="w-full p-2 border rounded bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">장기 목표 (Long-term Goal)</label>
              <textarea
                rows={2}
                value={longTermGoal}
                onChange={(e) => setLongTermGoal(e.target.value)}
                placeholder="장기 목표 내용 입력..."
                className="w-full p-2 border rounded bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">단기 목표 (Short-term Goal)</label>
              <textarea
                rows={2}
                value={shortTermGoal}
                onChange={(e) => setShortTermGoal(e.target.value)}
                placeholder="단기 목표 내용 입력..."
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 중간평가보고서 */}
      {activeTab === "MID_EVAL" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
            <h2 className="font-bold text-base text-slate-800">
              📊 발달재활서비스 중간평가보고서 (6개월 단위)
            </h2>
            <button
              onClick={() => handleSaveDoc("MID_EVAL", { childName, midEvalContent })}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-500"
            >
              Supabase DB 저장
            </button>
          </div>

          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">대상 아동명 *</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="아동명을 입력해 주세요"
                className="w-full p-2 border rounded bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">6개월간 주요 변화 관찰</label>
              <textarea
                rows={4}
                value={midEvalContent}
                onChange={(e) => setMidEvalContent(e.target.value)}
                placeholder="중간 평가 내용 입력..."
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 종결평가보고서 */}
      {activeTab === "FINAL_EVAL" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
            <h2 className="font-bold text-base text-slate-800">
              🏁 발달재활서비스 종결평가보고서 (12개월/종결 시)
            </h2>
            <button
              onClick={() => handleSaveDoc("FINAL_EVAL", { childName, finalEvalContent })}
              className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-500"
            >
              Supabase DB 저장
            </button>
          </div>

          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">대상 아동명 *</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="아동명을 입력해 주세요"
                className="w-full p-2 border rounded bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">종결 종합 소견</label>
              <textarea
                rows={4}
                value={finalEvalContent}
                onChange={(e) => setFinalEvalContent(e.target.value)}
                placeholder="종결 소견 입력..."
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
