// 댓글 API 클라이언트
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

// 기본 HTTP 요청 헬퍼
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  };

  const response = await fetch(url, defaultOptions);
  return parseResponse<T>(response);
}

// GET 요청
export async function getRequest<T>(endpoint: string): Promise<T> {
  return makeRequest<T>(endpoint, { method: 'GET' });
}

// POST 요청
export async function postRequest<T>(endpoint: string, data: any): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// DELETE 요청
export async function deleteRequest<T>(endpoint: string, data?: any): Promise<T> {
  const options: RequestInit = { method: 'DELETE' };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return makeRequest<T>(endpoint, options);
}

export { BASE_URL };


