import { Question as QuestionType } from "@/lib/questions";

interface QuestionProps {
  question: QuestionType;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
}

export default function Question({
  question,
  selectedOption,
  onSelectOption,
}: QuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full mb-3">
          {question.category}
        </span>
        <h2 className="text-xl font-semibold text-gray-900">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedOption === index
                ? "border-blue-600 bg-blue-50 text-blue-900"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedOption === index
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selectedOption === index && (
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                )}
              </div>
              <span className="text-gray-800">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}