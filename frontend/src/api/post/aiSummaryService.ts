export interface AISummaryRequest {
  url: string;
}

export interface AISummaryResponse {
  status: string;
  data?: {
    summary: string;
    tags: string[];
  };
  code?: string;
}

// AI 요약 요청
export async function requestAISummary(url: string): Promise<AISummaryResponse> {
  const decodedUrl = decodeURIComponent(url);
  const apiUrl = `https://i13a509.p.ssafy.io/api/v1/summary?url=${decodedUrl}`;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    throw new Error(`AI 요약 요청에 실패했습니다. (${response.status})`);
  }

  return response.json();
}

// AI 요약 결과 처리
export function processAISummaryResult(result: AISummaryResponse): { 
  summary: string; 
  tags: string[]; 
  error?: string 
} {
  if (result.status === 'SUCCESS' && result.data) {
    return {
      summary: result.data.summary || '',
      tags: result.data.tags && Array.isArray(result.data.tags) ? result.data.tags.slice(0, 5) : []
    };
  } else if (result.status === 'ERROR' && result.code === 'AI-001') {
    return {
      summary: '',
      tags: [],
      error: '입력하신 URL이 유효하지 않습니다. 올바른 웹사이트 주소를 입력해주세요.'
    };
  } else {
    throw new Error('AI 요약 응답 형식이 올바르지 않습니다.');
  }
}

