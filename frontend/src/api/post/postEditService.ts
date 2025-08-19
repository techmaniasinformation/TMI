import { validateAndProcessUrl } from '@/utils/urlValidation';

export interface PostEditRequest {
  memberId: number;
  link: string;
  title: string;
  content: string;
  tags: string[];
  thumbnailUrl?: string;
}

export interface PostEditResponse {
  status: string;
  data: {
    postId: number;
  };
}

// 게시글 수정
export async function updatePost(
  postId: string, 
  requestData: PostEditRequest, 
  thumbnailImage?: File
): Promise<PostEditResponse> {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
  formData.append('req', blob);

  if (thumbnailImage) {
    formData.append('thumbnailImage', thumbnailImage);
  }

  const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${postId}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`게시글 수정에 실패했습니다. (${response.status})`);
  }

  return response.json();
}

// URL 검증 및 처리
export function validateUrl(url: string): { isValid: boolean; processedUrl?: string; error?: string } {
  return validateAndProcessUrl(url);
}
