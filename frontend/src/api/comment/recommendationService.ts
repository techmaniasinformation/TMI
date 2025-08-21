import { getRequest, postRequest, deleteRequest } from './commentApiClient';

export interface Recommendation {
  commentId: number;
  recommendationId: number;
}

export interface RecommendationListResponse {
  status: string;
  data: {
    recommendations: Recommendation[];
  };
}

export interface RecommendationResponse {
  status: string;
  data: {
    recommendationId: number;
  };
}

// 사용자 추천 상태 조회
export async function fetchUserRecommendations(memberId: number, postId: string): Promise<Map<number, number>> {
  const data: RecommendationListResponse = await getRequest<RecommendationListResponse>(
    `/recommendation?memberId=${memberId}&postId=${postId}`
  );
  
  const recommendationMap = new Map();
  (data.data?.recommendations || []).forEach((rec: Recommendation) => {
    recommendationMap.set(rec.commentId, rec.recommendationId);
  });
  
  return recommendationMap;
}

// 추천 추가
export async function addRecommendation(memberId: number, commentId: number): Promise<number> {
  const data: RecommendationResponse = await postRequest<RecommendationResponse>('/recommendation', {
    memberId,
    commentId
  });
  
  return data.data?.recommendationId || 0;
}

// 추천 취소
export async function removeRecommendation(recommendationId: number): Promise<void> {
  await deleteRequest(`/recommendation/${recommendationId}`);
}


