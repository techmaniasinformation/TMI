import React, { useMemo, useState } from 'react';
import { Button } from '@/components/foundation/button';
import { getSafeProfileUrl, getSafeBadgeUrl, handleProfileImageError, handleBadgeImageError } from '@/utils/defaultImages';
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
  // 전역 사용자 정보 가져오기 (닉네임 비교용)
  const { user } = useUserStore();
  
  // URL 검증을 위한 상태 추가
  const [urlError, setUrlError] = useState<string>('');

  // URL 검증 함수
  const processAndValidateUrl = (url: string) => {
    setUrlError('');
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }
    try {
      const urlObj = new URL(processedUrl);
      if (!urlObj.protocol || (!urlObj.protocol.startsWith('http'))) {
        setUrlError('http 또는 https URL을 입력해주세요.');
        return null;
      }
      const hostname = urlObj.hostname.toLowerCase();
      if (!hostname.includes('tistory.com') && !hostname.includes('velog.io') && !hostname.includes('blog.naver.com') && !hostname.includes('medium.com')) {
        setUrlError('티스토리(tistory.com), 벨로그(velog.io), 네이버 블로그(blog.naver.com), Medium(medium.com) 링크만 허용됩니다.');
        return null;
      }
      return processedUrl;
    } catch (error) {
      setUrlError('올바른 URL 형식을 입력해주세요.');
      return null;
    }
  };

  // 링크 변경 핸들러
  const handleLinkChange = (url: string) => {
    onLinkChange(url);
    if (url.trim()) {
      processAndValidateUrl(url);
    } else {
      setUrlError('');
    }
  };

  // 안전한 프로필 이미지 URL을 메모이제이션
  const safeMemberProfileUrl = useMemo(() => {
    return getSafeProfileUrl(memberProfileUrl);
  }, [memberProfileUrl]);

  return (
    <div className="bg-light-header dark:bg-dark-header rounded-lg shadow-md dark:shadow-lg p-6">
      {/* 댓글 작성 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">댓글 작성</h3>
        <div className="flex gap-3">
          <img
            src={safeMemberProfileUrl}
            alt="프로필"
            className="w-10 h-10 rounded-full object-cover"
            onError={handleProfileImageError}
          />
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
              rows={3}
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {commentText.length}/200
              </span>
            </div>
            {showLinkInput && (
              <div className="relative mt-2">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  maxLength={255}
                  placeholder="링크 URL을 입력하세요 (선택사항)"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                {urlError && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{urlError}</p>
                )}
                <span className="absolute right-2 top-2 text-xs text-gray-500 dark:text-gray-400">
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
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          댓글 {formatNumber(commentCount)}
        </h3>
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">아직 댓글이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              // 각 댓글의 안전한 프로필 이미지 URL을 직접 계산
              const safeCommentProfileUrl = getSafeProfileUrl(comment.memberProfileUrl);
              const safeCommentBadgeUrl = getSafeBadgeUrl(comment.badgeUrl);

              return (
                <div key={comment.commentId} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex gap-3">
                                         <img
                       src={safeCommentProfileUrl}
                       alt="프로필"
                       className="w-10 h-10 rounded-full object-cover"
                       onError={handleProfileImageError}
                     />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm dark:text-white">{comment.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {formatDate(comment.createAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 mb-2 break-words break-all">{comment.comment}</p>
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
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          onClick={() => onCommentRecommend(comment.commentId)}
                          className={`flex items-center gap-1 text-sm ${
                            userRecommendations.has(comment.commentId)
                              ? 'text-blue-600'
                              : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                          }`}
                          disabled={recommendLoading.has(comment.commentId)}
                        >
                          <span>👍</span>
                          <span>
                            {userRecommendations.has(comment.commentId) ? '추천됨' : '추천'}
                          </span>
                          <span className="ml-1 font-medium text-yellow-600">
                            {formatNumber(comment.recommendCount || 0)}
                          </span>
                        </button>
                        
                        {/* 댓글 작성자와 현재 사용자가 같을 때만 삭제 버튼 표시 */}
                        {user?.nickname && comment.name === user.nickname && (
                          <button
                            onClick={() => {
                              if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
                                onCommentDelete(comment.commentId);
                              }
                            }}
                            disabled={deleteLoading.has(comment.commentId)}
                            className={`flex items-center gap-1 text-sm text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 ${
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