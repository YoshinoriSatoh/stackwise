📋 Claude Code用 デザイン評価・改善指示書
以下をClaude Codeに貼り付けてください：
markdown# Stack Advisorのデザイン評価と改善

## 🎯 タスク
Stack Advisorのデザインを評価し、モダンでプロフェッショナルなUIに改善する

## 📊 現状評価スクリプトの作成

以下の評価スクリプトを作成してください：

### ファイル: scripts/analyze-design.js

```javascript
import { chromium } from 'playwright';
import fs from 'fs/promises';

async function analyzeDesign() {
  console.log('🎨 Stack Advisorのデザイン分析を開始...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // URLは引数で指定可能に
  const url = process.argv[2] || 'http://localhost:3000';
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  
  // 詳細なデザイン情報を収集
  const designAnalysis = await page.evaluate(() => {
    const analysis = {
      colors: {
        background: [],
        text: [],
        buttons: [],
        all: new Map()
      },
      typography: {
        fonts: new Set(),
        sizes: new Set(),
        weights: new Set()
      },
      spacing: {
        margins: new Set(),
        paddings: new Set(),
        gaps: new Set()
      },
      buttons: [],
      layout: {
        maxWidth: '',
        alignment: ''
      },
      issues: []
    };
    
    // 全要素を解析
    const elements = document.querySelectorAll('*');
    
    elements.forEach(el => {
      const styles = getComputedStyle(el);
      
      // 色の収集
      if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        analysis.colors.all.set(styles.backgroundColor, 
          (analysis.colors.all.get(styles.backgroundColor) || 0) + 1
        );
      }
      
      // タイポグラフィ
      if (styles.fontFamily) analysis.typography.fonts.add(styles.fontFamily);
      if (styles.fontSize) analysis.typography.sizes.add(styles.fontSize);
      if (styles.fontWeight) analysis.typography.weights.add(styles.fontWeight);
      
      // スペーシング
      if (styles.margin && styles.margin !== '0px') {
        analysis.spacing.margins.add(styles.margin);
      }
      if (styles.padding && styles.padding !== '0px') {
        analysis.spacing.paddings.add(styles.padding);
      }
    });
    
    // ボタンの詳細分析
    document.querySelectorAll('button').forEach((btn, idx) => {
      const rect = btn.getBoundingClientRect();
      const styles = getComputedStyle(btn);
      const hoverStyles = {
        hasHoverEffect: false
      };
      
      // ホバー効果の検出（簡易版）
      btn.addEventListener('mouseenter', () => {
        const hovered = getComputedStyle(btn);
        if (hovered.backgroundColor !== styles.backgroundColor) {
          hoverStyles.hasHoverEffect = true;
        }
      });
      
      analysis.buttons.push({
        index: idx,
        text: btn.textContent.trim(),
        size: {
          width: rect.width,
          height: rect.height
        },
        styles: {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderRadius: styles.borderRadius,
          border: styles.border,
          boxShadow: styles.boxShadow,
          padding: styles.padding,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          transition: styles.transition,
          cursor: styles.cursor
        },
        hoverStyles
      });
    });
    
    // 問題点の自動検出
    // 1. ボタンの問題
    analysis.buttons.forEach(btn => {
      if (btn.styles.borderRadius === '0px') {
        analysis.issues.push({
          type: 'button',
          severity: 'high',
          message: `ボタン「${btn.text}」に角丸がない`,
          suggestion: 'rounded-lg または rounded-xl を追加'
        });
      }
      
      if (btn.styles.boxShadow === 'none') {
        analysis.issues.push({
          type: 'button',
          severity: 'medium',
          message: `ボタン「${btn.text}」に影がない`,
          suggestion: 'shadow-md hover:shadow-lg を追加'
        });
      }
      
      if (!btn.styles.transition || btn.styles.transition === 'none') {
        analysis.issues.push({
          type: 'button',
          severity: 'medium',
          message: `ボタン「${btn.text}」にトランジションがない`,
          suggestion: 'transition-all duration-200 を追加'
        });
      }
    });
    
    // 2. 色の問題
    if (analysis.colors.all.size > 10) {
      analysis.issues.push({
        type: 'color',
        severity: 'high',
        message: `色が多すぎる（${analysis.colors.all.size}色使用）`,
        suggestion: 'メインカラー、サブカラー、アクセントカラーの3-5色に絞る'
      });
    }
    
    // 3. タイポグラフィの問題
    if (analysis.typography.fonts.size > 2) {
      analysis.issues.push({
        type: 'typography',
        severity: 'medium',
        message: `フォントファミリーが多すぎる（${analysis.typography.fonts.size}種類）`,
        suggestion: 'システムフォントスタック1つに統一'
      });
    }
    
    // 4. スペーシングの問題
    if (analysis.spacing.paddings.size > 10) {
      analysis.issues.push({
        type: 'spacing',
        severity: 'low',
        message: 'パディングの値がバラバラ',
        suggestion: 'Tailwindのスペーシングスケール（p-2, p-4, p-6...）に統一'
      });
    }
    
    // データを整形
    return {
      colors: {
        all: Array.from(analysis.colors.all.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10), // 上位10色
        count: analysis.colors.all.size
      },
      typography: {
        fonts: Array.from(analysis.typography.fonts),
        sizes: Array.from(analysis.typography.sizes),
        weights: Array.from(analysis.typography.weights)
      },
      spacing: {
        margins: Array.from(analysis.spacing.margins),
        paddings: Array.from(analysis.spacing.paddings)
      },
      buttons: analysis.buttons,
      issues: analysis.issues,
      score: Math.max(0, 100 - analysis.issues.length * 5)
    };
  });
  
  // スクリーンショット撮影
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  await page.screenshot({ 
    path: `screenshots/design-${timestamp}.png`, 
    fullPage: true 
  });
  
  // モバイル表示もチェック
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ 
    path: `screenshots/design-mobile-${timestamp}.png`, 
    fullPage: true 
  });
  
  // レポート生成
  const report = {
    url,
    timestamp,
    analysis: designAnalysis,
    recommendations: generateRecommendations(designAnalysis)
  };
  
  // ファイルに保存
  await fs.mkdir('design-reports', { recursive: true });
  await fs.mkdir('screenshots', { recursive: true });
  await fs.writeFile(
    `design-reports/report-${timestamp}.json`, 
    JSON.stringify(report, null, 2)
  );
  
  // コンソール出力
  console.log('📊 デザインスコア:', designAnalysis.score + '/100\n');
  
  console.log('🎨 使用されている色 (上位5色):');
  designAnalysis.colors.all.slice(0, 5).forEach(([color, count]) => {
    console.log(`   ${color}: ${count}回`);
  });
  
  console.log('\n⚠️  検出された問題:');
  designAnalysis.issues
    .sort((a, b) => {
      const severity = { high: 0, medium: 1, low: 2 };
      return severity[a.severity] - severity[b.severity];
    })
    .forEach(issue => {
      const icon = issue.severity === 'high' ? '🔴' : 
                   issue.severity === 'medium' ? '🟡' : '🟢';
      console.log(`   ${icon} ${issue.message}`);
      console.log(`      → ${issue.suggestion}\n`);
    });
  
  await browser.close();
  
  return report;
}

function generateRecommendations(analysis) {
  const recommendations = [];
  
  // カラーパレットの提案
  recommendations.push({
    category: 'カラーパレット',
    current: `${analysis.colors.count}色を使用`,
    suggestion: `
以下のカラーパレットに統一することを推奨:
- Primary: #3B82F6 (blue-500)
- Primary Dark: #2563EB (blue-600)
- Secondary: #10B981 (emerald-500)
- Background: #FFFFFF
- Text: #111827 (gray-900)
- Muted: #6B7280 (gray-500)
    `
  });
  
  // ボタンスタイルの提案
  if (analysis.buttons.length > 0) {
    recommendations.push({
      category: 'ボタンデザイン',
      current: '基本的なスタイルのみ',
      suggestion: `
モダンなボタンスタイル:
<button className="
  bg-gradient-to-r from-blue-500 to-blue-600
  text-white font-medium
  px-6 py-3 rounded-xl
  shadow-md hover:shadow-xl
  transform hover:-translate-y-0.5
  transition-all duration-200
  active:scale-95
">
      `
    });
  }
  
  return recommendations;
}

// 実行
analyzeDesign()
  .then(report => {
    console.log('\n✅ 分析完了!');
    console.log(`📁 レポート: design-reports/report-${report.timestamp}.json`);
    console.log(`📸 スクショ: screenshots/design-${report.timestamp}.png`);
  })
  .catch(console.error);
🛠️ 実装手順

package.jsonに追加:

json{
  "scripts": {
    "analyze-design": "node scripts/analyze-design.js",
    "analyze-design:prod": "node scripts/analyze-design.js https://stackwise-three.vercel.app/"
  },
  "devDependencies": {
    "playwright": "^1.40.0"
  }
}

実行:

bashnpm install -D playwright
npm run analyze-design

評価結果を確認:


design-reports/report-[timestamp].json に詳細データ
screenshots/ にスクリーンショット
コンソールに要約

🎨 改善実装
評価結果に基づいて、以下のファイルを改善してください：
優先度高：

components/Question.tsx - ボタンスタイルの改善
app/globals.css - カラーパレットの統一
components/ProgressBar.tsx - 進捗表示の改善

改善の方向性：

Stripe/Linearのようなモダンなデザイン
統一されたカラーパレット
適度な影とグラデーション
スムーズなトランジション
モバイルファーストなレスポンシブ

Tailwind CSSクラスの例：
jsx// ボタン
className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"

// カード
className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"

// 進捗バー
className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
実装後、再度 npm run analyze-design を実行して改善を確認してください。