import { chromium } from 'playwright';
import fs from 'fs/promises';

async function analyzeUserJourney() {
  console.log('🎯 Stack Advisorのユーザージャーニー分析を開始...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const url = process.argv[2] || 'http://localhost:3000';
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  
  const journeySteps = [];
  const designIssues = [];
  
  try {
    // Step 1: 初期画面
    console.log('📱 Step 1: 初期画面の分析...');
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    
    const initialAnalysis = await analyzeCurrentPage(page);
    journeySteps.push({
      step: 1,
      name: '初期画面',
      analysis: initialAnalysis,
      screenshot: `screenshots/journey-1-initial-${timestamp}.png`
    });
    await page.screenshot({ path: journeySteps[0].screenshot, fullPage: true });
    
    // Step 2: 最初の質問
    console.log('📱 Step 2: 最初の質問画面...');
    const startButton = await page.locator('button:has-text("今すぐ相談を始める"), button:has-text("相談を始める"), button:has-text("Start")').first();
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForTimeout(1000);
      
      const firstQuestionAnalysis = await analyzeCurrentPage(page);
      journeySteps.push({
        step: 2,
        name: '最初の質問',
        analysis: firstQuestionAnalysis,
        screenshot: `screenshots/journey-2-first-question-${timestamp}.png`
      });
      await page.screenshot({ path: journeySteps[journeySteps.length - 1].screenshot, fullPage: true });
    }
    
    // Step 3: 質問に回答
    console.log('📱 Step 3: 質問への回答...');
    const answerButtons = await page.locator('button').all();
    if (answerButtons.length > 0) {
      // 最初の選択肢をクリック
      await answerButtons[0].click();
      await page.waitForTimeout(1000);
      
      const progressAnalysis = await analyzeCurrentPage(page);
      journeySteps.push({
        step: 3,
        name: '回答後の進捗',
        analysis: progressAnalysis,
        screenshot: `screenshots/journey-3-progress-${timestamp}.png`
      });
      await page.screenshot({ path: journeySteps[journeySteps.length - 1].screenshot, fullPage: true });
    }
    
    // Step 4: さらに質問を進める（可能な限り）
    console.log('📱 Step 4: 追加の質問...');
    for (let i = 0; i < 3; i++) {
      const buttons = await page.locator('button').all();
      if (buttons.length > 0) {
        await buttons[0].click();
        await page.waitForTimeout(1000);
      }
    }
    
    const midJourneyAnalysis = await analyzeCurrentPage(page);
    journeySteps.push({
      step: 4,
      name: '中間地点',
      analysis: midJourneyAnalysis,
      screenshot: `screenshots/journey-4-mid-${timestamp}.png`
    });
    await page.screenshot({ path: journeySteps[journeySteps.length - 1].screenshot, fullPage: true });
    
    // 各ステップの問題点を集計
    journeySteps.forEach((step, index) => {
      step.analysis.issues.forEach(issue => {
        designIssues.push({
          ...issue,
          step: step.name,
          stepNumber: index + 1
        });
      });
    });
    
    // レポート生成
    const report = {
      url,
      timestamp,
      journeySteps,
      totalIssues: designIssues,
      summary: generateJourneySummary(journeySteps, designIssues),
      recommendations: generateJourneyRecommendations(journeySteps, designIssues)
    };
    
    // レポート保存
    await fs.mkdir('design-reports', { recursive: true });
    await fs.mkdir('screenshots', { recursive: true });
    await fs.writeFile(
      `design-reports/journey-report-${timestamp}.json`,
      JSON.stringify(report, null, 2)
    );
    
    // コンソール出力
    console.log('\n📊 ユーザージャーニー分析結果:\n');
    
    journeySteps.forEach(step => {
      console.log(`${step.step}. ${step.name}:`);
      console.log(`   スコア: ${step.analysis.score}/100`);
      console.log(`   問題数: ${step.analysis.issues.length}`);
      console.log('');
    });
    
    console.log('\n🔍 重要な問題点:');
    const criticalIssues = designIssues
      .filter(issue => issue.severity === 'high')
      .slice(0, 5);
    
    criticalIssues.forEach(issue => {
      console.log(`🔴 [${issue.step}] ${issue.message}`);
      console.log(`   → ${issue.suggestion}\n`);
    });
    
    console.log('\n💡 改善の優先順位:');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.title}`);
      console.log(`   ${rec.description}\n`);
    });
    
    return report;
    
  } finally {
    await browser.close();
  }
}

async function analyzeCurrentPage(page) {
  return await page.evaluate(() => {
    const analysis = {
      colors: { all: new Map() },
      typography: { fonts: new Set(), sizes: new Set() },
      buttons: [],
      forms: [],
      issues: [],
      score: 100
    };
    
    // ボタン分析
    document.querySelectorAll('button').forEach((btn, idx) => {
      const styles = getComputedStyle(btn);
      const rect = btn.getBoundingClientRect();
      
      const buttonInfo = {
        text: btn.textContent.trim(),
        visible: rect.width > 0 && rect.height > 0,
        styles: {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          padding: styles.padding,
          fontSize: styles.fontSize,
          transition: styles.transition
        }
      };
      
      analysis.buttons.push(buttonInfo);
      
      // ボタンの問題検出
      if (buttonInfo.visible) {
        if (styles.borderRadius === '0px') {
          analysis.issues.push({
            type: 'button',
            severity: 'high',
            message: `ボタン「${buttonInfo.text}」に角丸がない`,
            suggestion: 'rounded-lg または rounded-xl を追加'
          });
        }
        
        if (rect.height < 40) {
          analysis.issues.push({
            type: 'button',
            severity: 'medium',
            message: `ボタン「${buttonInfo.text}」が小さすぎる（高さ: ${rect.height}px）`,
            suggestion: '最小高さ40px以上を推奨'
          });
        }
        
        if (!styles.transition || styles.transition === 'none') {
          analysis.issues.push({
            type: 'button',
            severity: 'low',
            message: `ボタン「${buttonInfo.text}」にアニメーションがない`,
            suggestion: 'transition-all duration-200 を追加'
          });
        }
      }
    });
    
    // フォーム要素分析
    document.querySelectorAll('input, textarea, select').forEach(input => {
      const styles = getComputedStyle(input);
      const rect = input.getBoundingClientRect();
      
      if (rect.width > 0) {
        analysis.forms.push({
          type: input.tagName.toLowerCase(),
          styles: {
            borderRadius: styles.borderRadius,
            border: styles.border,
            padding: styles.padding
          }
        });
        
        if (styles.borderRadius === '0px') {
          analysis.issues.push({
            type: 'form',
            severity: 'medium',
            message: `フォーム要素に角丸がない`,
            suggestion: 'rounded-md を追加'
          });
        }
      }
    });
    
    // プログレスバー分析
    const progressBar = document.querySelector('[role="progressbar"], .progress-bar, [class*="progress"]');
    if (progressBar) {
      const styles = getComputedStyle(progressBar);
      if (!styles.transition || styles.transition === 'none') {
        analysis.issues.push({
          type: 'progress',
          severity: 'medium',
          message: 'プログレスバーにアニメーションがない',
          suggestion: 'transition-all duration-500 を追加'
        });
      }
    }
    
    // レスポンシブ問題の検出
    const viewport = window.innerWidth;
    if (viewport < 768) {
      const overflowElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > viewport;
      });
      
      if (overflowElements.length > 0) {
        analysis.issues.push({
          type: 'responsive',
          severity: 'high',
          message: 'モバイル表示で要素がはみ出している',
          suggestion: 'max-w-full または overflow-hidden を適用'
        });
      }
    }
    
    analysis.score = Math.max(0, 100 - analysis.issues.length * 5);
    return analysis;
  });
}

function generateJourneySummary(steps, issues) {
  const avgScore = steps.reduce((sum, step) => sum + step.analysis.score, 0) / steps.length;
  const criticalIssues = issues.filter(i => i.severity === 'high').length;
  
  return {
    averageScore: Math.round(avgScore),
    totalStepsAnalyzed: steps.length,
    totalIssuesFound: issues.length,
    criticalIssues: criticalIssues,
    improvementPotential: criticalIssues > 5 ? 'high' : criticalIssues > 2 ? 'medium' : 'low'
  };
}

function generateJourneyRecommendations(steps, issues) {
  const recommendations = [];
  
  // ボタン関連の問題が多い場合
  const buttonIssues = issues.filter(i => i.type === 'button');
  if (buttonIssues.length > 3) {
    recommendations.push({
      priority: 'high',
      title: 'ボタンコンポーネントの統一',
      description: '全体的にボタンのスタイルを統一し、モダンなデザインシステムを適用する',
      affectedSteps: [...new Set(buttonIssues.map(i => i.step))],
      suggestedCode: `
// components/ui/Button.tsx
export const Button = ({ children, variant = 'primary', ...props }) => (
  <button
    className={\`
      px-6 py-3 font-medium rounded-xl
      transition-all duration-200
      transform active:scale-95
      \${variant === 'primary' 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }
    \`}
    {...props}
  >
    {children}
  </button>
)`
    });
  }
  
  // レスポンシブの問題
  const responsiveIssues = issues.filter(i => i.type === 'responsive');
  if (responsiveIssues.length > 0) {
    recommendations.push({
      priority: 'high',
      title: 'モバイルファーストの改善',
      description: 'モバイル表示での要素の配置とサイズを最適化',
      affectedSteps: [...new Set(responsiveIssues.map(i => i.step))]
    });
  }
  
  // アニメーションの追加
  const transitionIssues = issues.filter(i => i.message.includes('アニメーション') || i.message.includes('トランジション'));
  if (transitionIssues.length > 2) {
    recommendations.push({
      priority: 'medium',
      title: 'マイクロインタラクションの追加',
      description: '要素の状態変化にスムーズなアニメーションを追加してUXを向上',
      affectedSteps: [...new Set(transitionIssues.map(i => i.step))]
    });
  }
  
  return recommendations.sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.priority] - priority[b.priority];
  });
}

// 実行
analyzeUserJourney()
  .then(report => {
    console.log('\n✅ ユーザージャーニー分析完了!');
    console.log(`📁 レポート: design-reports/journey-report-${report.timestamp}.json`);
    console.log(`📸 スクショ: screenshots/journey-*.png`);
  })
  .catch(console.error);