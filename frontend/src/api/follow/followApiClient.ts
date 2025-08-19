// HTTP 클라이언트 및 공통 로직
const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

// 응답 파싱
async function parseBody(response: Response) {
  const text = await response.text();
  try { 
    return text ? JSON.parse(text) : null; 
  } catch { 
    return text || null; 
  }
}

// HTTP 요청 헬퍼
async function makeRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: { 'Content-Type': 'application/json' },
    ...options
  };

  const response = await fetch(url, defaultOptions);
  const body = await parseBody(response);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${body?.message || '요청 실패'}`);
  }
  
  return body;
}

// GET 요청
export async function getRequest(endpoint: string): Promise<any> {
  return makeRequest(endpoint, { method: 'GET' });
}

// POST 요청
export async function postRequest(endpoint: string, data: any): Promise<any> {
  return makeRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// DELETE 요청
export async function deleteRequest(endpoint: string): Promise<any> {
  return makeRequest(endpoint, { method: 'DELETE' });
}

export { BASE_URL };

