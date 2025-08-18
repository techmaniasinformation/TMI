#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CodeQualityAnalyzer {
  constructor() {
    this.srcPath = './src';
    this.results = {
      folderStructure: {},
      namingConventions: {},
      codeLength: {},
      componentComplexity: {},
      overall: {}
    };
  }

  // 폴더구조 분석
  analyzeFolderStructure() {
    console.log('📁 폴더구조 분석 중...');
    
    const folders = this.getFolders(this.srcPath);
    const stats = {
      totalFolders: folders.length,
      maxDepth: this.getMaxDepth(this.srcPath),
      folderDistribution: this.getFolderDistribution(folders)
    };

    this.results.folderStructure = stats;
    return stats;
  }

  // 변수 네이밍 분석
  analyzeNamingConventions() {
    console.log('🏷️ 네이밍 컨벤션 분석 중...');
    
    const files = this.getAllFiles(this.srcPath, ['.ts', '.tsx']);
    const namingIssues = [];

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const issues = this.checkNamingConventions(content, file);
      namingIssues.push(...issues);
    });

    this.results.namingConventions = {
      totalFiles: files.length,
      issues: namingIssues,
      score: this.calculateNamingScore(namingIssues)
    };

    return this.results.namingConventions;
  }

  // 코드 길이 분석
  analyzeCodeLength() {
    console.log('📏 코드 길이 분석 중...');
    
    const files = this.getAllFiles(this.srcPath, ['.ts', '.tsx']);
    const lengthStats = {
      totalFiles: files.length,
      totalLines: 0,
      averageLines: 0,
      maxLines: 0,
      minLines: Infinity,
      fileDistribution: {
        small: 0,    // 0-50 lines
        medium: 0,   // 51-200 lines
        large: 0,    // 201-500 lines
        huge: 0      // 500+ lines
      }
    };

    files.forEach(file => {
      const lines = fs.readFileSync(file, 'utf8').split('\n').length;
      lengthStats.totalLines += lines;
      lengthStats.maxLines = Math.max(lengthStats.maxLines, lines);
      lengthStats.minLines = Math.min(lengthStats.minLines, lines);

      if (lines <= 50) lengthStats.fileDistribution.small++;
      else if (lines <= 200) lengthStats.fileDistribution.medium++;
      else if (lines <= 500) lengthStats.fileDistribution.large++;
      else lengthStats.fileDistribution.huge++;
    });

    lengthStats.averageLines = Math.round(lengthStats.totalLines / files.length);
    this.results.codeLength = lengthStats;

    return lengthStats;
  }

  // 컴포넌트 복잡도 분석
  analyzeComponentComplexity() {
    console.log('⚛️ 컴포넌트 복잡도 분석 중...');
    
    try {
      const complexityOutput = execSync(
        'npx cyclomatic-complexity "./src/**/*.{ts,tsx}" --json',
        { encoding: 'utf8' }
      );
      
      const complexityData = JSON.parse(complexityOutput);
      const componentStats = {
        totalComponents: complexityData.length,
        averageComplexity: 0,
        maxComplexity: 0,
        complexityDistribution: {
          low: 0,      // 1-5
          medium: 0,   // 6-10
          high: 0,     // 11-15
          veryHigh: 0  // 15+
        }
      };

      let totalComplexity = 0;
      complexityData.forEach(file => {
        const fileComplexity = file.complexitySum || 0;
        totalComplexity += fileComplexity;
        componentStats.maxComplexity = Math.max(componentStats.maxComplexity, fileComplexity);

        if (fileComplexity <= 5) componentStats.complexityDistribution.low++;
        else if (fileComplexity <= 10) componentStats.complexityDistribution.medium++;
        else if (fileComplexity <= 15) componentStats.complexityDistribution.high++;
        else componentStats.complexityDistribution.veryHigh++;
      });

      componentStats.averageComplexity = Math.round(totalComplexity / complexityData.length);
      this.results.componentComplexity = componentStats;

      return componentStats;
    } catch (error) {
      console.error('복잡도 분석 실패:', error.message);
      return { error: '복잡도 분석 실패' };
    }
  }

  // 종합 점수 계산
  calculateOverallScore() {
    console.log('📊 종합 점수 계산 중...');
    
    const folderScore = this.calculateFolderScore(this.results.folderStructure);
    const namingScore = this.results.namingConventions.score || 0;
    const lengthScore = this.calculateLengthScore(this.results.codeLength);
    const complexityScore = this.calculateComplexityScore(this.results.componentComplexity);

    const overallScore = Math.round((folderScore + namingScore + lengthScore + complexityScore) / 4);

    this.results.overall = {
      score: overallScore,
      grade: this.getGrade(overallScore),
      breakdown: {
        folderStructure: folderScore,
        namingConventions: namingScore,
        codeLength: lengthScore,
        componentComplexity: complexityScore
      }
    };

    return this.results.overall;
  }

  // 헬퍼 메서드들
  getFolders(dir) {
    const folders = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        folders.push(fullPath);
        folders.push(...this.getFolders(fullPath));
      }
    });

    return folders;
  }

  getMaxDepth(dir, currentDepth = 0) {
    const items = fs.readdirSync(dir);
    let maxDepth = currentDepth;

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        maxDepth = Math.max(maxDepth, this.getMaxDepth(fullPath, currentDepth + 1));
      }
    });

    return maxDepth;
  }

  getFolderDistribution(folders) {
    const distribution = {};
    folders.forEach(folder => {
      const level = folder.split(path.sep).length - 2; // src/ 제외
      distribution[`level_${level}`] = (distribution[`level_${level}`] || 0) + 1;
    });
    return distribution;
  }

  getAllFiles(dir, extensions) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...this.getAllFiles(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });

    return files;
  }

  checkNamingConventions(content, filePath) {
    const issues = [];
    
    // 변수명 패턴 검사
    const variablePattern = /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
    let match;
    
    while ((match = variablePattern.exec(content)) !== null) {
      const variableName = match[2];
      if (!/^[a-z][a-zA-Z0-9]*$/.test(variableName) && !/^[A-Z][a-zA-Z0-9]*$/.test(variableName)) {
        issues.push({
          file: filePath,
          line: content.substring(0, match.index).split('\n').length,
          issue: `잘못된 변수명: ${variableName}`,
          type: 'naming'
        });
      }
    }

    return issues;
  }

  calculateNamingScore(issues) {
    const baseScore = 100;
    const penaltyPerIssue = 5;
    return Math.max(0, baseScore - (issues.length * penaltyPerIssue));
  }

  calculateFolderScore(stats) {
    const maxDepth = stats.maxDepth;
    const totalFolders = stats.totalFolders;
    
    // 깊이가 너무 깊으면 감점, 적절한 폴더 수면 가점
    let score = 100;
    if (maxDepth > 6) score -= 20;
    if (totalFolders > 50) score -= 10;
    if (totalFolders < 5) score -= 10;
    
    return Math.max(0, score);
  }

  calculateLengthScore(stats) {
    const avgLines = stats.averageLines;
    const hugeFiles = stats.fileDistribution.huge;
    
    let score = 100;
    if (avgLines > 200) score -= 30;
    if (avgLines > 100) score -= 15;
    if (hugeFiles > 0) score -= (hugeFiles * 10);
    
    return Math.max(0, score);
  }

  calculateComplexityScore(stats) {
    if (stats.error) return 50; // 분석 실패 시 중간 점수
    
    const avgComplexity = stats.averageComplexity;
    const veryHighComplexity = stats.complexityDistribution.veryHigh;
    
    let score = 100;
    if (avgComplexity > 10) score -= 30;
    if (avgComplexity > 5) score -= 15;
    if (veryHighComplexity > 0) score -= (veryHighComplexity * 15);
    
    return Math.max(0, score);
  }

  getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    if (score >= 30) return 'D';
    return 'F';
  }

  // 전체 분석 실행
  async runFullAnalysis() {
    console.log('🚀 코드 품질 종합 분석 시작...\n');
    
    this.analyzeFolderStructure();
    this.analyzeNamingConventions();
    this.analyzeCodeLength();
    this.analyzeComponentComplexity();
    this.calculateOverallScore();

    // 결과 출력
    console.log('\n📊 분석 결과:');
    console.log('='.repeat(50));
    console.log(`종합 점수: ${this.results.overall.score}/100 (${this.results.overall.grade})`);
    console.log('\n세부 점수:');
    console.log(`- 폴더구조: ${this.results.overall.breakdown.folderStructure}/100`);
    console.log(`- 네이밍: ${this.results.overall.breakdown.namingConventions}/100`);
    console.log(`- 코드길이: ${this.results.overall.breakdown.codeLength}/100`);
    console.log(`- 복잡도: ${this.results.overall.breakdown.componentComplexity}/100`);

    // 결과 저장
    fs.writeFileSync('code-quality-report.json', JSON.stringify(this.results, null, 2));
    console.log('\n📄 상세 리포트가 code-quality-report.json에 저장되었습니다.');

    return this.results;
  }
}

// 스크립트 실행
if (require.main === module) {
  const analyzer = new CodeQualityAnalyzer();
  analyzer.runFullAnalysis().catch(console.error);
}

module.exports = CodeQualityAnalyzer;
