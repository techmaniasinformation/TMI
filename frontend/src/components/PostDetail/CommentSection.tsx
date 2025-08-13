import React, { useMemo } from 'react';
import { Button } from '@/components/foundation/button';
import { getSafeProfileUrl, getSafeBadgeUrl } from '@/utils/defaultImages';
import { useUserStore } from '@/stores/userStore';

interface CommentSectionProps {
  comments: any[];
  commentCount: number;
  postId: string;
  memberProfileUrl: string;
  commentText: string;
  showLinkInput: boolean;
  linkUrl: string;
  onCommentChange: (text: string) => void;
  onLinkToggle: () => void;
  onLinkChange: (url: string) => void;
  onCommentSubmit: () => void;
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  onCommentRecommend: (commentId: number) => void;
  userRecommendations: Map<number, number>;
  recommendLoading: Map<number, boolean>;
  deleteLoading: Map<number, boolean>;
  onCommentDelete: (commentId: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  commentCount,
  postId,
  memberProfileUrl,
  commentText,
  showLinkInput,
  linkUrl,
  onCommentChange,
  onLinkToggle,
  onLinkChange,
  onCommentSubmit,
  formatDate,
  formatNumber,
  onCommentRecommend,
  userRecommendations,
  recommendLoading,
  deleteLoading,
  onCommentDelete,
}) => {
  // 전역 사용자 정보 가져오기
  const { user } = useUserStore();
  const currentUserMemberId = user?.memberId;
  
  // 안전한 프로필 이미지 URL을 메모이제이션
  const safeMemberProfileUrl = useMemo(() => {
    return getSafeProfileUrl(memberProfileUrl);
  }, [memberProfileUrl]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 댓글 작성 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">댓글 작성</h3>
        <div className="flex gap-3">
          <img
            src={safeMemberProfileUrl}
            alt="프로필"
            className="w-10 h-10 rounded-full object-contain"
          />
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {commentText.length}/200
              </span>
            </div>
            {showLinkInput && (
              <div className="relative mt-2">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => onLinkChange(e.target.value)}
                  maxLength={255}
                  placeholder="링크 URL을 입력하세요 (선택사항)"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-2 top-2 text-xs text-gray-500">
                  {linkUrl.length}/255
                </span>
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={onLinkToggle}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {showLinkInput ? '링크 제거' : '링크 추가'}
              </button>
              <Button
                onClick={onCommentSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                댓글 작성
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          댓글 {formatNumber(commentCount)}
        </h3>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">아직 댓글이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              // 각 댓글의 안전한 프로필 이미지 URL을 직접 계산
              const safeCommentProfileUrl = getSafeProfileUrl(comment.memberProfileUrl);
              const safeCommentBadgeUrl = getSafeBadgeUrl(comment.badgeUrl);

              return (
                <div key={comment.commentId} className="border-b border-gray-200 pb-4">
                  <div className="flex gap-3">
                    <img
                      src={safeCommentProfileUrl}
                      alt="프로필"
                      className="w-10 h-10 rounded-full object-contain"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm">{comment.name}</span>
                        {comment.badgeUrl && (
                          <img
                            src={safeCommentBadgeUrl}
                            alt="뱃지"
                            className="w-4 h-4"
                          />
                        )}
                        <span className="text-gray-500 text-xs">
                          {formatDate(comment.createAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.comment}</p>
                      {comment.link && (
                        <a
                          href={comment.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          {comment.link}
                        </a>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => onCommentRecommend(comment.commentId)}
                          className={`flex items-center gap-1 text-sm ${
                            userRecommendations.has(comment.commentId)
                              ? 'text-blue-600'
                              : 'text-gray-500 hover:text-blue-600'
                          }`}
                          disabled={recommendLoading.has(comment.commentId)}
                        >
                          <span>👍</span>
                          <span>
                            {userRecommendations.has(comment.commentId) ? '추천됨' : '추천'}
                          </span>
                        </button>
                        
                        {/* 댓글 작성자와 현재 사용자가 같을 때만 삭제 버튼 표시 */}
                        {currentUserMemberId && comment.memberId && currentUserMemberId === comment.memberId && (
                          <button
                            onClick={() => {
                              if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
                                onCommentDelete(comment.commentId);
                              }
                            }}
                            disabled={deleteLoading.has(comment.commentId)}
                            className={`flex items-center gap-1 text-sm text-red-600 hover:text-red-800 ${
                              deleteLoading.has(comment.commentId) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {deleteLoading.has(comment.commentId) ? (
                              <span>삭제 중...</span>
                            ) : (
                              <>
                                <span>🗑️</span>
                                <span>삭제</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}; 