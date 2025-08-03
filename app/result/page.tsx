"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateScores, TechStack, Answer } from "@/lib/scoring";
import ResultCard from "@/components/ResultCard";

export default function ResultPage() {
  const router = useRouter();
  const [results, setResults] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("stackAdvisorAnswers");
    if (!savedAnswers) {
      router.push("/");
      return;
    }

    const answers = JSON.parse(savedAnswers) as Answer[];
    if (answers.length < 20) {
      router.push("/");
      return;
    }

    const calculatedResults = calculateScores(answers);
    setResults(calculatedResults);
    setIsLoading(false);

    // URLクエリパラメータに結果を設定（シェア機能用）
    const shareData = {
      top: calculatedResults[0]?.id || "",
      score: calculatedResults[0]?.score || 0,
    };
    const params = new URLSearchParams(shareData as any);
    window.history.replaceState(null, "", `/result?${params.toString()}`);
  }, [router]);

  const handleRestart = () => {
    if (confirm("新しい診断を開始しますか？")) {
      localStorage.removeItem("stackAdvisorAnswers");
      router.push("/");
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "Stack Advisor - 技術スタック診断結果",
        text: `私の推奨技術スタックは「${results[0]?.name}」でした！`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("URLをクリップボードにコピーしました！");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">結果を分析中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            診断結果
          </h1>
          <p className="text-gray-600">
            あなたのプロジェクトに最適な技術スタックはこちらです
          </p>
        </header>

        <div className="space-y-6">
          {results.map((stack, index) => (
            <ResultCard
              key={stack.id}
              stack={stack}
              rank={index + 1}
              isTop={index === 0}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={handleRestart}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            もう一度診断する
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            結果をシェア
          </button>
        </div>
      </div>
    </div>
  );
}