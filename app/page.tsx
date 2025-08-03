"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { Answer } from "@/lib/scoring";
import Question from "@/components/Question";
import ProgressBar from "@/components/ProgressBar";

export default function Home() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const currentQuestion = questions[currentQuestionIndex];

  // ローカルストレージから回答を読み込む
  useEffect(() => {
    const savedAnswers = localStorage.getItem("stackAdvisorAnswers");
    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers) as Answer[];
      setAnswers(parsed);
      // 最後に回答した質問の次から開始
      const lastAnsweredIndex = parsed.length;
      setCurrentQuestionIndex(Math.min(lastAnsweredIndex, questions.length - 1));
    }
  }, []);

  // 回答が変更されたらローカルストレージに保存
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem("stackAdvisorAnswers", JSON.stringify(answers));
    }
  }, [answers]);

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedOption,
    };

    // 既存の回答を更新または追加
    const existingAnswerIndex = answers.findIndex(
      (a) => a.questionId === currentQuestion.id
    );
    
    let newAnswers: Answer[];
    if (existingAnswerIndex >= 0) {
      newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = newAnswer;
    } else {
      newAnswers = [...answers, newAnswer];
    }
    
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 最後の質問なら結果画面へ
      router.push("/result");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // 前の回答を選択状態にする
      const previousAnswer = answers.find(
        (a) => a.questionId === questions[currentQuestionIndex - 1].id
      );
      if (previousAnswer) {
        setSelectedOption(previousAnswer.selectedOption);
      }
    }
  };

  const handleReset = () => {
    if (confirm("回答をリセットしてもよろしいですか？")) {
      localStorage.removeItem("stackAdvisorAnswers");
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Stackwise
          </h1>
          <p className="text-gray-600">
            20個の質問に答えて、最適な技術スタックを見つけましょう
          </p>
        </header>

        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
        />

        <Question
          question={currentQuestion}
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
          >
            戻る
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg transition-all duration-200 hover:bg-gray-100"
          >
            リセット
          </button>

          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md hover:shadow-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
          >
            {currentQuestionIndex === questions.length - 1
              ? "結果を見る"
              : "次へ"}
          </button>
        </div>
      </div>
    </div>
  );
}