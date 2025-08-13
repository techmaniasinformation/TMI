import React from 'react';
import { getSafeProfileUrl, getSafeBadgeUrl, handleProfileImageError, handleBadgeImageError } from '@/utils/defaultImages';

interface BestCommentsProps {
  comments: any[];
  bestCommentId: number;
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  onCommentRecommend: (commentId: number) => void;
  userRecommendations: Map<number, number>;
  recommendLoading: Map<number, boolean>;
}

export const BestComments: React.FC<BestCommentsProps> = ({
  comments,
  bestCommentId,
  formatDate,
  formatNumber,
  onCommentRecommend,
  userRecommendations,
  recommendLoading,
}) => {
  // 베스트 댓글 찾기
  const bestComment = comments.find(comment => comment.commentId === bestCommentId);

  if (!bestComment) {
    return null;
  }

  // 안전한 프로필 이미지 URL 사용
  const safeBestCommentProfileUrl = getSafeProfileUrl(bestComment.memberProfileUrl);
  const safeBestCommentBadgeUrl = getSafeBadgeUrl(bestComment.badgeUrl);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-600 font-semibold">⭐ 베스트 댓글</span>
        <span className="text-sm text-gray-500">가장 많은 추천을 받은 댓글입니다</span>
      </div>
      
      <div className="flex gap-3">
        <img
          src={safeBestCommentProfileUrl}
          alt="프로필"
          className="w-12 h-12 rounded-full object-cover"
          onError={handleProfileImageError}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm">{bestComment.name}</span>
            {bestComment.badgeUrl && (
              <img
                src={safeBestCommentBadgeUrl}
                alt="뱃지"
                className="w-4 h-4"
                onError={handleBadgeImageError}
              />
            )}
            <span className="text-gray-500 text-xs">
              {formatDate(bestComment.createAt)}
            </span>
          </div>
          <p className="text-gray-700 mb-2 break-words break-all">{bestComment.comment}</p>
          {bestComment.link && (
            <a
              href={bestComment.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm break-all"
            >
              {bestComment.link}
            </a>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
            <button
              onClick={() => onCommentRecommend(bestComment.commentId)}
              className={`flex items-center gap-1 ${
                userRecommendations.has(bestComment.commentId)
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              disabled={recommendLoading.has(bestComment.commentId)}
            >
              <span>👍</span>
              <span>
                {userRecommendations.has(bestComment.commentId) ? '추천됨' : '추천'}
              </span>
              <span className="ml-1">{formatNumber(bestComment.recommendCount)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 