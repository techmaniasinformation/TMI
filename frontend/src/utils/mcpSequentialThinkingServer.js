const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

class SequentialThinkingServer extends Server {
  constructor() {
    super({
      name: 'sequential-thinking-server',
      version: '1.0.0',
    });
  }

  // 단계별 분석 도구
  async analyzeStepByStep({ code, problem }) {
    const steps = [
      {
        step: 1,
        title: '문제 상황 파악',
        description: '현재 코드의 구조와 목적을 분석합니다.',
        analysis: await this.analyzeCodeStructure(code)
      },
      {
        step: 2,
        title: '잠재적 문제점 식별',
        description: '코드에서 발견되는 문제점들을 나열합니다.',
        analysis: await this.identifyIssues(code)
      },
      {
        step: 3,
        title: '개선 방안 도출',
        description: '각 문제점에 대한 해결책을 제시합니다.',
        analysis: await this.generateSolutions(code)
      },
      {
        step: 4,
        title: '구현 계획 수립',
        description: '개선사항을 적용하기 위한 단계별 계획을 수립합니다.',
        analysis: await this.createImplementationPlan(code)
      }
    ];

    return {
      steps,
      summary: await this.generateSummary(steps),
      recommendations: await this.generateRecommendations(steps)
    };
  }

  // 코드 구조 분석
  async analyzeCodeStructure(code) {
    const analysis = {
      fileType: this.detectFileType(code),
      functions: this.extractFunctions(code),
      imports: this.extractImports(code),
      complexity: this.analyzeComplexity(code)
    };

    return {
      type: 'structure_analysis',
      data: analysis,
      insights: [
        `파일 타입: ${analysis.fileType}`,
        `함수 개수: ${analysis.functions.length}`,
        `임포트 개수: ${analysis.imports.length}`,
        `복잡도: ${analysis.complexity}`
      ]
    };
  }

  // 문제점 식별
  async identifyIssues(code) {
    const issues = [];
    
    // 하드코딩된 문자열 검사
    const hardcodedStrings = this.findHardcodedStrings(code);
    if (hardcodedStrings.length > 0) {
      issues.push({
        type: 'hardcoded_strings',
        severity: 'medium',
        description: '하드코딩된 문자열이 발견되었습니다.',
        examples: hardcodedStrings.slice(0, 3)
      });
    }

    // 타입 안전성 검사
    const typeIssues = this.checkTypeSafety(code);
    if (typeIssues.length > 0) {
      issues.push({
        type: 'type_safety',
        severity: 'high',
        description: '타입 안전성 문제가 발견되었습니다.',
        examples: typeIssues
      });
    }

    // 중복 코드 검사
    const duplicates = this.findDuplicateCode(code);
    if (duplicates.length > 0) {
      issues.push({
        type: 'duplicate_code',
        severity: 'low',
        description: '중복된 코드 패턴이 발견되었습니다.',
        examples: duplicates
      });
    }

    return {
      type: 'issues_analysis',
      data: issues,
      totalIssues: issues.length,
      severityBreakdown: this.calculateSeverityBreakdown(issues)
    };
  }

  // 해결책 생성
  async generateSolutions(code) {
    const issues = await this.identifyIssues(code);
    const solutions = [];

    issues.data.forEach(issue => {
      switch (issue.type) {
        case 'hardcoded_strings':
          solutions.push({
            issue: issue,
            solution: '문자열을 상수로 분리하여 관리',
            implementation: 'ERROR_MESSAGES 객체 생성',
            priority: 'medium'
          });
          break;
        case 'type_safety':
          solutions.push({
            issue: issue,
            solution: '타입 정의 강화 및 타입 가드 추가',
            implementation: 'interface 정의 및 타입 체크 함수 추가',
            priority: 'high'
          });
          break;
        case 'duplicate_code':
          solutions.push({
            issue: issue,
            solution: '공통 함수로 추출하여 재사용',
            implementation: '유틸리티 함수 생성',
            priority: 'low'
          });
          break;
      }
    });

    return {
      type: 'solutions_analysis',
      data: solutions,
      totalSolutions: solutions.length,
      priorityOrder: solutions.sort((a, b) => {
        const priorityMap = { high: 3, medium: 2, low: 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
      })
    };
  }

  // 구현 계획 수립
  async createImplementationPlan(code) {
    const solutions = await this.generateSolutions(code);
    const plan = [];

    solutions.priorityOrder.forEach((solution, index) => {
      plan.push({
        step: index + 1,
        action: solution.solution,
        implementation: solution.implementation,
        estimatedTime: this.estimateTime(solution.priority),
        dependencies: this.identifyDependencies(solution)
      });
    });

    return {
      type: 'implementation_plan',
      data: plan,
      totalSteps: plan.length,
      estimatedTotalTime: plan.reduce((sum, step) => sum + step.estimatedTime, 0)
    };
  }

  // 요약 생성
  async generateSummary(steps) {
    const totalIssues = steps[2].analysis.data.length;
    const totalSolutions = steps[3].analysis.data.length;
    const implementationSteps = steps[4].analysis.data.length;

    return {
      totalIssues,
      totalSolutions,
      implementationSteps,
      priority: this.calculateOverallPriority(steps),
      estimatedTime: steps[4].analysis.estimatedTotalTime
    };
  }

  // 권장사항 생성
  async generateRecommendations(steps) {
    const recommendations = [];

    if (steps[2].analysis.data.length > 0) {
      recommendations.push({
        type: 'immediate',
        description: '높은 우선순위 문제부터 해결하세요.',
        action: '타입 안전성 문제를 먼저 해결'
      });
    }

    if (steps[3].analysis.data.some(s => s.priority === 'high')) {
      recommendations.push({
        type: 'critical',
        description: '크리티컬한 문제가 발견되었습니다.',
        action: '즉시 리팩토링 진행'
      });
    }

    return recommendations;
  }

  // 헬퍼 메서드들
  detectFileType(code) {
    if (code.includes('import') || code.includes('export')) return 'ES6 Module';
    if (code.includes('require(')) return 'CommonJS';
    return 'Unknown';
  }

  extractFunctions(code) {
    const functionRegex = /(?:function\s+\w+|const\s+\w+\s*=\s*\(|export\s+const\s+\w+)/g;
    return code.match(functionRegex) || [];
  }

  extractImports(code) {
    const importRegex = /import\s+.*?from\s+['"][^'"]+['"]/g;
    return code.match(importRegex) || [];
  }

  analyzeComplexity(code) {
    const lines = code.split('\n').length;
    const functions = this.extractFunctions(code).length;
    const complexity = Math.round((lines / Math.max(functions, 1)) * 10) / 10;
    
    if (complexity > 20) return 'high';
    if (complexity > 10) return 'medium';
    return 'low';
  }

  findHardcodedStrings(code) {
    const stringRegex = /['"`]([^'"`]+)['"`]/g;
    const matches = [];
    let match;
    
    while ((match = stringRegex.exec(code)) !== null) {
      if (match[1].length > 5 && !match[1].includes('import') && !match[1].includes('export')) {
        matches.push(match[1]);
      }
    }
    
    return matches;
  }

  checkTypeSafety(code) {
    const issues = [];
    
    if (code.includes('any') || code.includes('as any')) {
      issues.push('any 타입 사용');
    }
    
    if (code.includes('@ts-ignore')) {
      issues.push('TypeScript 무시 주석 사용');
    }
    
    return issues;
  }

  findDuplicateCode(code) {
    // 간단한 중복 패턴 검사
    const patterns = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length - 1; i++) {
      const currentLine = lines[i].trim();
      const nextLine = lines[i + 1].trim();
      
      if (currentLine === nextLine && currentLine.length > 10) {
        patterns.push(currentLine);
      }
    }
    
    return patterns;
  }

  calculateSeverityBreakdown(issues) {
    const breakdown = { high: 0, medium: 0, low: 0 };
    issues.forEach(issue => {
      breakdown[issue.severity]++;
    });
    return breakdown;
  }

  estimateTime(priority) {
    const timeMap = { high: 30, medium: 15, low: 5 };
    return timeMap[priority] || 10;
  }

  identifyDependencies(solution) {
    // 간단한 의존성 식별
    const deps = [];
    if (solution.solution.includes('상수')) deps.push('constants');
    if (solution.solution.includes('타입')) deps.push('types');
    if (solution.solution.includes('함수')) deps.push('utilities');
    return deps;
  }

  calculateOverallPriority(steps) {
    const issues = steps[2].analysis.data;
    const highPriorityIssues = issues.filter(issue => issue.severity === 'high').length;
    
    if (highPriorityIssues > 0) return 'high';
    if (issues.length > 3) return 'medium';
    return 'low';
  }
}

// 서버 초기화 및 실행
async function main() {
  const server = new SequentialThinkingServer();
  
  // 도구 등록
  server.tool('analyze-step-by-step', {
    description: '코드를 단계별로 분석하여 개선 방안을 제시합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: '분석할 코드'
        },
        problem: {
          type: 'string',
          description: '해결하고자 하는 문제'
        }
      },
      required: ['code']
    }
  }, async (args) => {
    return await server.analyzeStepByStep(args);
  });

  // 서버 시작
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Sequential Thinking MCP Server started');
}

main().catch(console.error);

