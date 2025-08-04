import React from 'react';
import { DateTimeComponent } from '@/components/domain/article';

interface BestCommentsProps {
  comments: any[]; // Comment 타입을 사용하지만 여기서는 any로 간단히 처리
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
}

export const BestComments: React.FC<BestCommentsProps> = ({ comments, formatDate, formatNumber }) => {
  const bestComments = comments?.filter(comment => comment.isRecommend) || [];
  
  if (bestComments.length === 0) {
    return null;
  }

  const bestComment = bestComments.sort((a, b) => b.recommendCount - a.recommendCount)[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        베스트 댓글
      </h3>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <img
            src={bestComment.memberProfileUrl}
            alt={bestComment.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">{bestComment.name}</span>
              {bestComment.badgeUrl && (
                <img
                  src={bestComment.badgeUrl}
                  alt="badge"
                  className="w-4 h-4"
                />
              )}
              <DateTimeComponent 
                date={bestComment.createAt}
                formatDate={formatDate}
              />
            </div>
            <p className="text-gray-700 mb-3">{bestComment.comment}</p>
            {bestComment.link && (
              <a
                href={bestComment.link}
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
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3">
              <button className="flex items-center space-x-1 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{formatNumber(bestComment.recommendCount)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 