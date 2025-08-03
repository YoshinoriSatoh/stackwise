export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
}

export const questions: Question[] = [
  {
    id: 1,
    category: "プロジェクト基本",
    question: "予想されるMAU（月間アクティブユーザー）は？",
    options: ["1,000人未満", "1,000-10,000人", "10,000-100,000人", "100,000人以上"]
  },
  {
    id: 2,
    category: "プロジェクト基本",
    question: "開発期間は？",
    options: ["1ヶ月", "3ヶ月", "6ヶ月", "1年以上"]
  },
  {
    id: 3,
    category: "プロジェクト基本",
    question: "予算規模は？",
    options: ["100万円未満", "100-500万円", "500-1000万円", "1000万円以上"]
  },
  {
    id: 4,
    category: "プロジェクト基本",
    question: "プロジェクトタイプは？",
    options: ["MVP/PoC", "新規開発", "リプレイス", "機能追加"]
  },
  {
    id: 5,
    category: "ビジネス要件",
    question: "B2B or B2C？",
    options: ["B2B", "B2C", "B2B2C", "社内ツール"]
  },
  {
    id: 6,
    category: "チーム状況",
    question: "チーム規模は？",
    options: ["1-2人", "3-5人", "6-10人", "10人以上"]
  },
  {
    id: 7,
    category: "チーム状況",
    question: "チームの主要スキルは？",
    options: ["フロントエンド寄り", "バックエンド寄り", "フルスタック", "混在"]
  },
  {
    id: 8,
    category: "チーム状況",
    question: "クラウド経験は？",
    options: ["AWS精通", "GCP精通", "Azure精通", "初心者"]
  },
  {
    id: 9,
    category: "チーム状況",
    question: "コンテナ/k8s経験は？",
    options: ["本番運用経験あり", "開発で使用", "学習中", "未経験"]
  },
  {
    id: 10,
    category: "チーム状況",
    question: "チームの技術的チャレンジ志向は？",
    options: ["保守的", "バランス型", "チャレンジ好き", "最新技術追求"]
  },
  {
    id: 11,
    category: "技術要件",
    question: "リアルタイム性の要求は？",
    options: ["不要", "一部必要", "重要", "必須"]
  },
  {
    id: 12,
    category: "技術要件",
    question: "SEOの重要度は？",
    options: ["不要", "あれば良い", "重要", "最重要"]
  },
  {
    id: 13,
    category: "技術要件",
    question: "モバイルアプリの予定は？",
    options: ["なし", "将来的に", "同時開発", "モバイルファースト"]
  },
  {
    id: 14,
    category: "技術要件",
    question: "データ分析の重要度は？",
    options: ["基本的な集計のみ", "定期レポート必要", "リアルタイム分析", "ML/AI活用"]
  },
  {
    id: 15,
    category: "技術要件",
    question: "外部連携の複雑さは？",
    options: ["なし", "数個のAPI", "多数のAPI", "レガシーシステム連携"]
  },
  {
    id: 16,
    category: "非機能要件",
    question: "可用性の要求は？",
    options: ["ベストエフォート", "営業時間内", "99.9%", "99.99%"]
  },
  {
    id: 17,
    category: "非機能要件",
    question: "セキュリティ要件は？",
    options: ["標準的", "金融機関レベル", "医療機関レベル", "政府機関レベル"]
  },
  {
    id: 18,
    category: "非機能要件",
    question: "コンプライアンス要件は？",
    options: ["なし", "GDPR", "HIPAA", "複数の規制"]
  },
  {
    id: 19,
    category: "非機能要件",
    question: "データの地理的要件は？",
    options: ["制限なし", "国内保存必須", "特定リージョン", "マルチリージョン"]
  },
  {
    id: 20,
    category: "非機能要件",
    question: "スケーラビリティの優先度は？",
    options: ["当面不要", "段階的に対応", "最初から考慮", "最重要課題"]
  }
];