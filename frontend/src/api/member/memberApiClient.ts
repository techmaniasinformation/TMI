// HTTP 클라이언트 및 공통 로직
const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

// 응답 파싱
async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return null as T;
  
  try {
    return JSON.parse(text) as T;
  } catch {
    console.warn('응답 JSON 파싱 실패');
    return null as T;
  }
}

// 기본 HTTP 요청 헬퍼
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    credentials: 'include',
    ...options
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: 요청 실패`);
  }
  
  return parseResponse<T>(response);
}

// GET 요청
export async function getRequest<T>(endpoint: string): Promise<T> {
  return makeRequest<T>(endpoint, { method: 'GET' });
}

// PATCH 요청 (JSON)
export async function patchRequest<T>(endpoint: string, data?: any): Promise<T> {
  const options: RequestInit = { method: 'PATCH' };
  
  if (data) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(data);
  }
  
  return makeRequest<T>(endpoint, options);
}

// PATCH 요청 (FormData)
export async function patchFormRequest<T>(endpoint: string, formData: FormData): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: 'PATCH',
    body: formData
  });
}

export { BASE_URL };
