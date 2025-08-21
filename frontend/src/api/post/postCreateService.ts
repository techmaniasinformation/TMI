import { validateAndProcessUrl } from '@/utils/urlValidation';

export interface PostCreateRequest {
  memberId: number;
  link: string;
  title: string;
  content: string;
  tags: string[];
}

export interface PostCreateResponse {
  status: string;
  data: {
    postId: number;
  };
}

// 게시글 생성
export async function createPost(
  requestData: PostCreateRequest, 
  thumbnailImage?: File
): Promise<PostCreateResponse> {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
  formData.append('req', blob);

  if (thumbnailImage) {
    formData.append('thumbnailImage', thumbnailImage);
  }

  const response = await fetch('https://i13a509.p.ssafy.io/api/v1/post', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API 응답 에러:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`게시글 작성에 실패했습니다. (${response.status}: ${response.statusText})`);
  }

  return response.json();
}

// URL 검증 및 처리
export function validateUrl(url: string): { isValid: boolean; processedUrl?: string; error?: string } {
  return validateAndProcessUrl(url);
}

