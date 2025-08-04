import React from 'react';
import { DateTimeComponent } from '@/components/domain/article';

interface CommentSectionProps {
  comments: any[]; // Comment 타입을 사용하지만 여기서는 any로 간단히 처리
  commentCount: number;
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
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  commentCount,
  memberProfileUrl,
  commentText,
  showLinkInput,
  linkUrl,
  onCommentChange,
  onLinkToggle,
  onLinkChange,
  onCommentSubmit,
  formatDate,
  formatNumber
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        댓글 ({commentCount})
      </h3>
      
      {/* 댓글 작성 폼 */}
      <div className="mb-6 p-4">
        <div className="flex items-start space-x-3">
          <img
            src={memberProfileUrl}
            alt="내 프로필"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="relative">
              <textarea
                placeholder="댓글을 작성해주세요..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                maxLength={200}
                value={commentText}
                onChange={(e) => onCommentChange(e.target.value)}
              />
            </div>
            
            {/* 상단 버튼 영역 */}
            <div className="flex items-center justify-between mt-3 pb-3 border-b border-gray-200">
              <div className="text-xs text-gray-400">
                <span>{commentText.length}</span>/200
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  type="button"
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-1"
                  onClick={onLinkToggle}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>링크 추가</span>
                </button>
                <button 
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  onClick={onCommentSubmit}
                >
                  등록
                </button>
              </div>
            </div>
            
            {/* 링크 입력 영역 */}
            {showLinkInput && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="관련 링크를 입력해주세요"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={linkUrl}
                  onChange={(e) => onLinkChange(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 전체 댓글 리스트 */}
      <div className="space-y-4">
        {comments && comments.map((comment) => (
          <div key={comment.commentId} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start space-x-3">
              <img
                src={comment.memberProfileUrl}
                alt={comment.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{comment.name}</span>
                  {comment.badgeUrl && (
                    <img
                      src={comment.badgeUrl}
                      alt="badge"
                      className="w-4 h-4"
                    />
                  )}
                  <DateTimeComponent 
                    date={comment.createAt}
                    formatDate={formatDate}
                  />
                </div>
                <p className="text-gray-700 mb-3">{comment.comment}</p>
                {comment.link && (
                  <a
                    href={comment.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    링크 보기
                  </a>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-red-500">
                    <svg className="w-4 h-4" fill={comment.isRecommend ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{formatNumber(comment.recommendCount)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 