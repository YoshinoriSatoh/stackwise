import { TechStack } from "@/lib/scoring";

interface ResultCardProps {
  stack: TechStack;
  rank: number;
  isTop: boolean;
}

export default function ResultCard({ stack, rank, isTop }: ResultCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${
        isTop ? "ring-2 ring-blue-600 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
              isTop
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {rank}
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {stack.name}
            </h3>
            <p className="text-gray-600 mt-1">{stack.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{stack.score}%</div>
          <div className="text-sm text-gray-500">適合度</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          推奨技術スタック
        </h4>
        <div className="flex flex-wrap gap-2">
          {stack.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {stack.reasons.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            推奨理由
          </h4>
          <ul className="space-y-1">
            {stack.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}