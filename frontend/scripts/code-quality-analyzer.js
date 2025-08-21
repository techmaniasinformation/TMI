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

  // React 컴포넌트 복잡도 분석
  analyzeComponentComplexity() {
    console.log('⚛️ React 컴포넌트 복잡도 분석 중...');
    
    const componentFiles = this.getAllFiles(this.srcPath, ['.tsx']);
    const hookFiles = this.getAllFiles(this.srcPath, ['.ts']).filter(file => 
      file.includes('/hooks/') || file.includes('use') || file.includes('Use')
    );
    
    const allFiles = [...componentFiles, ...hookFiles];
    const complexityData = [];

    allFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const complexity = this.calculateReactComplexity(content, file);
      complexityData.push({
        file: file,
        complexity: complexity,
        details: this.getComplexityDetails(content)
      });
    });

    const componentStats = {
      totalFiles: complexityData.length,
      averageComplexity: 0,
      maxComplexity: 0,
      complexityDistribution: {
        low: 0,      // 1-10
        medium: 0,   // 11-25
        high: 0,     // 26-50
        veryHigh: 0  // 50+
      },
      details: complexityData
    };

    let totalComplexity = 0;
    complexityData.forEach(file => {
      const fileComplexity = file.complexity;
      totalComplexity += fileComplexity;
      componentStats.maxComplexity = Math.max(componentStats.maxComplexity, fileComplexity);

      if (fileComplexity <= 10) componentStats.complexityDistribution.low++;
      else if (fileComplexity <= 25) componentStats.complexityDistribution.medium++;
      else if (fileComplexity <= 50) componentStats.complexityDistribution.high++;
      else componentStats.complexityDistribution.veryHigh++;
    });

    componentStats.averageComplexity = Math.round(totalComplexity / complexityData.length);
    this.results.componentComplexity = componentStats;

    return componentStats;
  }

  // React 컴포넌트 복잡도 계산
  calculateReactComplexity(content, filePath) {
    const lines = content.split('\n');
    let complexity = 0;

    // 기본 복잡도: 파일 길이
    complexity += Math.min(lines.length * 0.5, 20);

    // 조건문 복잡도
    const conditionals = this.countConditionals(content);
    complexity += conditionals * 2;

    // 반복문 복잡도
    const loops = this.countLoops(content);
    complexity += loops * 3;

    // React 훅 복잡도
    const hooks = this.countHooks(content);
    complexity += hooks * 1.5;

    // JSX 복잡도
    const jsxComplexity = this.analyzeJSXComplexity(content);
    complexity += jsxComplexity;

    // 중첩 레벨 복잡도
    const maxNesting = this.getMaxNestingLevel(content);
    complexity += maxNesting * 2;

    // 함수/컴포넌트 개수
    const functions = this.countFunctions(content);
    complexity += functions * 1;

    return Math.round(complexity);
  }

  // 조건문 개수 세기
  countConditionals(content) {
    const patterns = [
      /\bif\s*\(/g,
      /\belse\s*{/g,
      /\belse\s+if\s*\(/g,
      /\bswitch\s*\(/g,
      /\bcase\s+/g,
      /\?\s*[^:]+:/g, // ternary operators
    ];
    
    let count = 0;
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    });
    
    return count;
  }

  // 반복문 개수 세기
  countLoops(content) {
    const patterns = [
      /\bfor\s*\(/g,
      /\bwhile\s*\(/g,
      /\bdo\s*{/g,
      /\.map\s*\(/g,
      /\.filter\s*\(/g,
      /\.forEach\s*\(/g,
      /\.reduce\s*\(/g,
    ];
    
    let count = 0;
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    });
    
    return count;
  }

  // React 훅 개수 세기
  countHooks(content) {
    const hookPatterns = [
      /\buseState\s*\(/g,
      /\buseEffect\s*\(/g,
      /\buseCallback\s*\(/g,
      /\buseMemo\s*\(/g,
      /\buseRef\s*\(/g,
      /\buseContext\s*\(/g,
      /\buseReducer\s*\(/g,
      /\buseLayoutEffect\s*\(/g,
      /\buseImperativeHandle\s*\(/g,
      /\buseDebugValue\s*\(/g,
    ];
    
    let count = 0;
    hookPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    });
    
    return count;
  }

  // JSX 복잡도 분석
  analyzeJSXComplexity(content) {
    let complexity = 0;
    
    // JSX 요소 개수
    const jsxElements = content.match(/<[A-Z][a-zA-Z]*/g);
    if (jsxElements) complexity += jsxElements.length * 0.5;
    
    // JSX 속성 개수
    const jsxProps = content.match(/\s[a-zA-Z-]+=/g);
    if (jsxProps) complexity += jsxProps.length * 0.3;
    
    // JSX 중첩 레벨
    const lines = content.split('\n');
    let maxJsxDepth = 0;
    let currentDepth = 0;
    
    lines.forEach(line => {
      const openTags = (line.match(/</g) || []).length;
      const closeTags = (line.match(/>/g) || []).length;
      const selfClosingTags = (line.match(/\/>/g) || []).length;
      
      currentDepth += openTags - closeTags - selfClosingTags;
      maxJsxDepth = Math.max(maxJsxDepth, currentDepth);
    });
    
    complexity += maxJsxDepth * 1.5;
    
    return complexity;
  }

  // 최대 중첩 레벨 계산
  getMaxNestingLevel(content) {
    const lines = content.split('\n');
    let maxDepth = 0;
    let currentDepth = 0;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('{') || trimmed.includes('{')) {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      }
      if (trimmed.startsWith('}') || trimmed.includes('}')) {
        currentDepth = Math.max(0, currentDepth - 1);
      }
    });
    
    return maxDepth;
  }

  // 함수/컴포넌트 개수 세기
  countFunctions(content) {
    const patterns = [
      /\bfunction\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/g,
      /\bconst\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*(?:function|\([^)]*\)\s*=>)/g,
      /\bexport\s+(?:default\s+)?function\s+[a-zA-Z_$][a-zA-Z0-9_$]*/g,
      /\bexport\s+(?:default\s+)?const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*(?:function|\([^)]*\)\s*=>)/g,
    ];
    
    let count = 0;
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    });
    
    return count;
  }

  // 복잡도 상세 정보
  getComplexityDetails(content) {
    return {
      conditionals: this.countConditionals(content),
      loops: this.countLoops(content),
      hooks: this.countHooks(content),
      jsxComplexity: Math.round(this.analyzeJSXComplexity(content)),
      maxNesting: this.getMaxNestingLevel(content),
      functions: this.countFunctions(content),
      lines: content.split('\n').length
    };
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
      const declarationType = match[1];
      
      // 상수명 검사 (const로 선언된 UPPER_SNAKE_CASE는 허용)
      if (declarationType === 'const' && /^[A-Z][A-Z0-9_]*$/.test(variableName)) {
        continue; // 올바른 상수명
      }
      
      // 일반 변수명 검사 (camelCase 또는 PascalCase)
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
    const highComplexity = stats.complexityDistribution.high;
    const totalFiles = stats.totalFiles;
    
    let score = 100;
    
    // 평균 복잡도에 따른 감점
    if (avgComplexity > 40) score -= 40;
    else if (avgComplexity > 25) score -= 25;
    else if (avgComplexity > 15) score -= 15;
    else if (avgComplexity > 10) score -= 10;
    
    // 매우 높은 복잡도 파일에 따른 감점
    if (veryHighComplexity > 0) {
      const veryHighPercentage = (veryHighComplexity / totalFiles) * 100;
      if (veryHighPercentage > 20) score -= 30;
      else if (veryHighPercentage > 10) score -= 20;
      else score -= (veryHighComplexity * 5);
    }
    
    // 높은 복잡도 파일에 따른 감점
    if (highComplexity > 0) {
      const highPercentage = (highComplexity / totalFiles) * 100;
      if (highPercentage > 50) score -= 15;
      else if (highPercentage > 30) score -= 10;
      else score -= (highComplexity * 2);
    }
    
    // 낮은 복잡도 파일에 따른 가점
    const lowComplexity = stats.complexityDistribution.low;
    if (lowComplexity > 0) {
      const lowPercentage = (lowComplexity / totalFiles) * 100;
      if (lowPercentage > 70) score += 10;
      else if (lowPercentage > 50) score += 5;
    }
    
    return Math.max(0, Math.min(100, score));
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
