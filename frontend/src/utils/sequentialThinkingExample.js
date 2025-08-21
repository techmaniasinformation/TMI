/**
 * MCP Sequential Thinking 사용 예시
 * 
 * 이 파일은 MCP Sequential Thinking 서버를 사용하여
 * 코드를 단계별로 분석하는 방법을 보여줍니다.
 */

const { spawn } = require('child_process');
const path = require('path');

class SequentialThinkingExample {
  constructor() {
    this.serverPath = path.join(__dirname, 'mcpSequentialThinkingServer.js');
  }

  /**
   * MCP 서버를 통해 코드 분석 실행
   */
  async analyzeCode(code, problem = '') {
    return new Promise((resolve, reject) => {
      const server = spawn('node', [this.serverPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      server.stdout.on('data', (data) => {
        output += data.toString();
      });

      server.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      server.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            reject(new Error('서버 응답 파싱 실패: ' + e.message));
          }
        } else {
          reject(new Error('서버 실행 실패: ' + errorOutput));
        }
      });

      // 분석 요청 전송
      const request = {
        method: 'tools/call',
        params: {
          name: 'analyze-step-by-step',
          arguments: {
            code: code,
            problem: problem
          }
        }
      };

      server.stdin.write(JSON.stringify(request) + '\n');
      server.stdin.end();
    });
  }

  /**
   * 예시 코드 분석 실행
   */
  async runExample() {
    const exampleCode = `
import imageCompression from 'browser-image-compression';

export const validateFileSize = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      error: '파일 크기는 10MB 이하여야 합니다.'
    };
  }
  
  if (file.size === 0) {
    return {
      isValid: false,
      error: '빈 파일은 업로드할 수 없습니다.'
    };
  }
  
  return { isValid: true };
};
    `;

    console.log('🔍 Sequential Thinking 분석 시작...\n');

    try {
      const result = await this.analyzeCode(exampleCode, '이미지 파일 검증 함수 개선');
      
      console.log('📊 분석 결과:\n');
      
      // 단계별 결과 출력
      result.steps.forEach(step => {
        console.log(`\n${step.step}. ${step.title}`);
        console.log(`   ${step.description}`);
        
        if (step.analysis.insights) {
          console.log('   📈 인사이트:');
          step.analysis.insights.forEach(insight => {
            console.log(`      - ${insight}`);
          });
        }
        
        if (step.analysis.data && step.analysis.data.length > 0) {
          console.log('   🔍 발견된 항목:');
          step.analysis.data.forEach(item => {
            if (item.description) {
              console.log(`      - ${item.description}`);
            }
            if (item.examples) {
              item.examples.forEach(example => {
                console.log(`        예시: ${example}`);
              });
            }
          });
        }
      });

      // 요약 출력
      console.log('\n📋 요약:');
      console.log(`   - 총 문제점: ${result.summary.totalIssues}개`);
      console.log(`   - 해결책: ${result.summary.totalSolutions}개`);
      console.log(`   - 구현 단계: ${result.summary.implementationSteps}개`);
      console.log(`   - 예상 소요 시간: ${result.summary.estimatedTime}분`);
      console.log(`   - 전체 우선순위: ${result.summary.priority}`);

      // 권장사항 출력
      if (result.recommendations.length > 0) {
        console.log('\n💡 권장사항:');
        result.recommendations.forEach(rec => {
          console.log(`   - ${rec.type.toUpperCase()}: ${rec.description}`);
          console.log(`     액션: ${rec.action}`);
        });
      }

    } catch (error) {
      console.error('❌ 분석 중 오류 발생:', error.message);
    }
  }

  /**
   * 실제 프로젝트 파일 분석
   */
  async analyzeProjectFile(filePath) {
    const fs = require('fs');
    
    try {
      const code = fs.readFileSync(filePath, 'utf8');
      console.log(`\n🔍 파일 분석: ${filePath}\n`);
      
      const result = await this.analyzeCode(code, '프로젝트 코드 품질 개선');
      
      // 간단한 결과 출력
      console.log('📊 분석 결과 요약:');
      console.log(`   - 발견된 문제점: ${result.summary.totalIssues}개`);
      console.log(`   - 제안된 해결책: ${result.summary.totalSolutions}개`);
      console.log(`   - 예상 개선 시간: ${result.summary.estimatedTime}분`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ 파일 분석 실패: ${error.message}`);
      return null;
    }
  }
}

// 사용 예시
if (require.main === module) {
  const example = new SequentialThinkingExample();
  
  // 예시 코드 분석 실행
  example.runExample().then(() => {
    console.log('\n✅ Sequential Thinking 예시 완료');
  }).catch(error => {
    console.error('❌ 예시 실행 실패:', error.message);
  });
}

module.exports = SequentialThinkingExample;

