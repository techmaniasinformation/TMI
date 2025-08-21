import { apiClient } from '@/api/apiClient';

// 배지 관련 API 클라이언트 함수들
export const getRequest = async (url: string) => {
  return apiClient.get(url);
};

export const patchRequest = async (url: string, data: any) => {
  return apiClient.patch(url, data);
};
