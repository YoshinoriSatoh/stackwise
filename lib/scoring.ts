export interface TechStack {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  score: number;
  reasons: string[];
}

export interface Answer {
  questionId: number;
  selectedOption: number;
}

export const techStacks: TechStack[] = [
  {
    id: "startup",
    name: "スタートアップスタック",
    description: "MVP・小規模プロジェクトに最適な高速開発スタック",
    technologies: ["Next.js", "Vercel", "Supabase", "TypeScript", "Tailwind CSS"],
    score: 0,
    reasons: []
  },
  {
    id: "balanced",
    name: "バランススタック",
    description: "中規模プロジェクトに適したバランスの取れたスタック",
    technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
    score: 0,
    reasons: []
  },
  {
    id: "enterprise",
    name: "エンタープライズスタック",
    description: "大規模・高可用性が求められるプロジェクト向け",
    technologies: ["Java/Spring", "Kubernetes", "Oracle/PostgreSQL", "AWS/Azure", "Redis"],
    score: 0,
    reasons: []
  },
  {
    id: "modern",
    name: "モダンフルスタック",
    description: "最新技術を活用したフルスタック開発向け",
    technologies: ["Next.js", "tRPC", "Prisma", "PostgreSQL", "Vercel/Railway"],
    score: 0,
    reasons: []
  },
  {
    id: "simple",
    name: "シンプルスタック",
    description: "少人数チームで素早く開発するためのスタック",
    technologies: ["Ruby on Rails", "PostgreSQL", "Heroku", "Stimulus", "Tailwind CSS"],
    score: 0,
    reasons: []
  }
];

export function calculateScores(answers: Answer[]): TechStack[] {
  const stacks = JSON.parse(JSON.stringify(techStacks)) as TechStack[];
  
  stacks.forEach(stack => {
    stack.score = 0;
    stack.reasons = [];
  });

  answers.forEach(answer => {
    const { questionId, selectedOption } = answer;

    // MAU（月間アクティブユーザー）
    if (questionId === 1) {
      if (selectedOption === 0 || selectedOption === 1) {
        stacks[0].score += 3; // startup
        stacks[4].score += 3; // simple
        stacks[0].reasons.push("小規模なユーザー数に最適");
        stacks[4].reasons.push("小規模なユーザー数に最適");
      } else if (selectedOption === 2) {
        stacks[1].score += 3; // balanced
        stacks[3].score += 2; // modern
      } else {
        stacks[2].score += 3; // enterprise
        stacks[2].reasons.push("大規模ユーザーに対応可能");
      }
    }

    // 開発期間
    if (questionId === 2) {
      if (selectedOption === 0 || selectedOption === 1) {
        stacks[0].score += 3; // startup
        stacks[4].score += 3; // simple
        stacks[0].reasons.push("短期間開発に適している");
        stacks[4].reasons.push("Railsの高速開発が可能");
      } else if (selectedOption === 2) {
        stacks[1].score += 2; // balanced
        stacks[3].score += 2; // modern
      } else {
        stacks[2].score += 2; // enterprise
      }
    }

    // 予算規模
    if (questionId === 3) {
      if (selectedOption === 0 || selectedOption === 1) {
        stacks[0].score += 2; // startup
        stacks[4].score += 2; // simple
        stacks[0].reasons.push("低コストで運用可能");
      } else if (selectedOption === 3) {
        stacks[2].score += 2; // enterprise
        stacks[2].reasons.push("十分な予算で堅牢なシステム構築");
      }
    }

    // プロジェクトタイプ
    if (questionId === 4) {
      if (selectedOption === 0) { // MVP/PoC
        stacks[0].score += 3; // startup
        stacks[4].score += 2; // simple
        stacks[0].reasons.push("MVP開発に最適");
      } else if (selectedOption === 2) { // リプレイス
        stacks[2].score += 2; // enterprise
        stacks[1].score += 2; // balanced
      }
    }

    // B2B or B2C
    if (questionId === 5) {
      if (selectedOption === 0) { // B2B
        stacks[2].score += 2; // enterprise
        stacks[1].score += 1; // balanced
      } else if (selectedOption === 1) { // B2C
        stacks[0].score += 2; // startup
        stacks[3].score += 2; // modern
      }
    }

    // チーム規模
    if (questionId === 6) {
      if (selectedOption === 0 || selectedOption === 1) { // 1-5人
        stacks[0].score += 2; // startup
        stacks[4].score += 3; // simple
        stacks[4].reasons.push("少人数チームに最適");
      } else if (selectedOption === 3) { // 10人以上
        stacks[2].score += 2; // enterprise
        stacks[2].reasons.push("大規模チーム向けの構造");
      }
    }

    // チームスキル
    if (questionId === 7) {
      if (selectedOption === 0) { // フロントエンド寄り
        stacks[0].score += 2; // startup
        stacks[3].score += 2; // modern
      } else if (selectedOption === 1) { // バックエンド寄り
        stacks[2].score += 2; // enterprise
        stacks[1].score += 1; // balanced
      } else if (selectedOption === 2) { // フルスタック
        stacks[3].score += 3; // modern
        stacks[4].score += 2; // simple
        stacks[3].reasons.push("フルスタック開発に最適");
      }
    }

    // クラウド経験
    if (questionId === 8) {
      if (selectedOption === 0) { // AWS精通
        stacks[1].score += 2; // balanced
        stacks[2].score += 2; // enterprise
      } else if (selectedOption === 3) { // 初心者
        stacks[0].score += 2; // startup
        stacks[4].score += 2; // simple
        stacks[0].reasons.push("クラウド初心者でも扱いやすい");
      }
    }

    // コンテナ/k8s経験
    if (questionId === 9) {
      if (selectedOption === 0) { // 本番運用経験あり
        stacks[2].score += 3; // enterprise
        stacks[2].reasons.push("Kubernetes活用可能");
      } else if (selectedOption === 3) { // 未経験
        stacks[0].score += 2; // startup
        stacks[4].score += 2; // simple
      }
    }

    // 技術チャレンジ志向
    if (questionId === 10) {
      if (selectedOption === 0) { // 保守的
        stacks[1].score += 2; // balanced
        stacks[2].score += 1; // enterprise
      } else if (selectedOption === 2 || selectedOption === 3) { // チャレンジ好き
        stacks[3].score += 3; // modern
        stacks[0].score += 1; // startup
        stacks[3].reasons.push("最新技術を活用");
      }
    }

    // リアルタイム性
    if (questionId === 11) {
      if (selectedOption === 2 || selectedOption === 3) { // 重要/必須
        stacks[0].score += 2; // startup (Supabase)
        stacks[3].score += 2; // modern
        stacks[0].reasons.push("Supabaseのリアルタイム機能");
      }
    }

    // SEO
    if (questionId === 12) {
      if (selectedOption === 2 || selectedOption === 3) { // 重要/最重要
        stacks[0].score += 3; // startup (Next.js)
        stacks[3].score += 3; // modern (Next.js)
        stacks[0].reasons.push("Next.jsのSSR/SSGでSEO対策");
        stacks[3].reasons.push("Next.jsのSSR/SSGでSEO対策");
      }
    }

    // モバイルアプリ
    if (questionId === 13) {
      if (selectedOption === 2 || selectedOption === 3) { // 同時開発/モバイルファースト
        stacks[0].score += 2; // startup
        stacks[3].score += 2; // modern
        stacks[0].reasons.push("APIファーストで開発可能");
      }
    }

    // データ分析
    if (questionId === 14) {
      if (selectedOption === 2 || selectedOption === 3) { // リアルタイム分析/ML
        stacks[2].score += 2; // enterprise
        stacks[1].score += 1; // balanced
      }
    }

    // 外部連携
    if (questionId === 15) {
      if (selectedOption === 3) { // レガシーシステム連携
        stacks[2].score += 3; // enterprise
        stacks[2].reasons.push("レガシーシステムとの統合に対応");
      }
    }

    // 可用性
    if (questionId === 16) {
      if (selectedOption === 2 || selectedOption === 3) { // 99.9%/99.99%
        stacks[2].score += 3; // enterprise
        stacks[1].score += 1; // balanced
        stacks[2].reasons.push("高可用性を実現");
      }
    }

    // セキュリティ
    if (questionId === 17) {
      if (selectedOption >= 1) { // 金融機関レベル以上
        stacks[2].score += 3; // enterprise
        stacks[2].reasons.push("エンタープライズレベルのセキュリティ");
      }
    }

    // コンプライアンス
    if (questionId === 18) {
      if (selectedOption >= 1) { // 何らかの規制あり
        stacks[2].score += 2; // enterprise
        stacks[1].score += 1; // balanced
      }
    }

    // データ地理的要件
    if (questionId === 19) {
      if (selectedOption === 1) { // 国内保存必須
        stacks[1].score += 1; // balanced (AWS)
        stacks[2].score += 1; // enterprise
      } else if (selectedOption === 3) { // マルチリージョン
        stacks[2].score += 2; // enterprise
      }
    }

    // スケーラビリティ
    if (questionId === 20) {
      if (selectedOption === 2 || selectedOption === 3) { // 最初から考慮/最重要
        stacks[2].score += 3; // enterprise
        stacks[1].score += 2; // balanced
        stacks[0].score += 1; // startup (Vercel auto-scaling)
        stacks[2].reasons.push("高いスケーラビリティを実現");
      }
    }
  });

  // スコアを正規化（パーセンテージに変換）
  const maxScore = Math.max(...stacks.map(s => s.score));
  stacks.forEach(stack => {
    stack.score = maxScore > 0 ? Math.round((stack.score / maxScore) * 100) : 0;
  });

  // スコアの高い順にソート
  stacks.sort((a, b) => b.score - a.score);

  // 重複する理由を削除
  stacks.forEach(stack => {
    stack.reasons = [...new Set(stack.reasons)];
  });

  return stacks;
}