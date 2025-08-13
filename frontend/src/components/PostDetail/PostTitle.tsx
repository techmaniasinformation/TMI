import React from 'react';
import { Badge } from '@/components/domain/Badge';

interface PostTitleProps {
  post: any; // Post 타입을 사용하지만 여기서는 any로 간단히 처리
  onStarClick?: () => void;
  isStarLoading?: boolean; // 스타 로딩 상태 추가
  showStarButton?: boolean; // 스타 버튼 표시 여부
}

export const PostTitle: React.FC<PostTitleProps> = ({ post, onStarClick, isStarLoading = false, showStarButton = true }) => {
  return (
         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
               <div className="flex items-center justify-between">
         {/* 좌측: 제목과 태그 */}
         <div className="flex-1 pr-4">
           <h1 className="text-3xl font-bold text-gray-900 mb-4 break-words break-all">
             {post.title}
           </h1>
           
           {/* 태그들 */}
           {post.tags && post.tags.length > 0 && (
             <div className="flex flex-wrap gap-2">
               {post.tags.map((tag: string, index: number) => (
                 <span
                   key={index}
                   className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                 >
                   #{tag}
                 </span>
               ))}
             </div>
           )}
         </div>

                                       {/* 우측: 스타 버튼 */}
          {showStarButton && (
            <div className="flex-shrink-0">
              <button 
                onClick={onStarClick}
                disabled={isStarLoading}
                className={`flex items-center justify-center w-10 h-10 text-yellow-500 hover:text-yellow-600 transition-colors ${
                  isStarLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isStarLoading ? (
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6" fill={post.isStar ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </button>
            </div>
          )}
       </div>
     </div>
  );
}; 