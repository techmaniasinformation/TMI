import { getRequest, postRequest, deleteRequest } from './commentApiClient';
import { getSafeProfileUrl, getSafeBadgeUrl } from '@/utils/defaultImages';

export interface Comment {
  commentId: number;
  comment: string;
  name: string;
  memberProfileUrl: string;
  badgeUrl?: string;
  createAt: string;
  isRecommend: boolean;
  recommendCount: number;
  link?: string;
  memberId?: number;
}

export interface CommentResponse {
  status: string;
  data: {
    comments: Comment[];
    bestCommentId: number;
  };
}

export interface RecommendationResponse {
  status: string;
  data: {
    recommendationId: number;
  };
}

// 댓글 목록 조회
export async function fetchComments(postId: string): Promise<{ comments: Comment[]; bestCommentId: number }> {
  const data: CommentResponse = await getRequest<CommentResponse>(`/comment?postId=${postId}`);
  
  const commentsWithDefaultImages = (data.data?.comments || []).map((comment: Comment) => ({
    ...comment,
    memberProfileUrl: getSafeProfileUrl(comment.memberProfileUrl),
    badgeUrl: getSafeBadgeUrl(comment.badgeUrl),
  }));
  
  const validBestCommentId = data.data?.bestCommentId && data.data.bestCommentId > 0 ? data.data.bestCommentId : -1;
  
  return {
    comments: commentsWithDefaultImages,
    bestCommentId: validBestCommentId
  };
}

// 댓글 작성
export async function createComment(postId: string, memberId: number, comment: string, link?: string): Promise<void> {
  await postRequest('/comment', {
    postId,
    memberId,
    comment,
    link: link || null
  });
}

// 댓글 삭제
export async function removeComment(commentId: number): Promise<void> {
  await deleteRequest(`/comment/${commentId}`);
}


