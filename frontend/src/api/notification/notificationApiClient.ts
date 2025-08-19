// HTTP 클라이언트 및 공통 로직
const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

// 응답 상태 체크
async function assertOk(response: Response) {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}${text ? ` - ${text}` : ''}`);
  }
}

// 응답 파싱
async function parseResponse<T>(response: Response): Promise<T> {
  await assertOk(response);
  return response.json() as Promise<T>;
}

// URL 구성 헬퍼
function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  return url.toString();
}

// 기본 HTTP 요청 헬퍼
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number>
): Promise<T> {
  const url = buildUrl(endpoint, params);
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
    ...options
  };

  const response = await fetch(url, defaultOptions);
  return parseResponse<T>(response);
}

// GET 요청
export async function getRequest<T>(
  endpoint: string, 
  params?: Record<string, string | number>
): Promise<T> {
  return makeRequest<T>(endpoint, { method: 'GET' }, params);
}

// PATCH 요청
export async function patchRequest<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  return makeRequest<T>(endpoint, { method: 'PATCH' }, params);
}

// DELETE 요청
export async function deleteRequest<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  return makeRequest<T>(endpoint, { method: 'DELETE' }, params);
}

export { BASE_URL };

