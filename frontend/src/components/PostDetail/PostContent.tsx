import React, { useState, useMemo } from 'react';
import { Button } from '@/components/foundation/button';
import { getSafeThumbnailUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

interface PostContentProps {
  post: any; // Post 타입을 사용하지만 여기서는 any로 간단히 처리
  onStarClick?: () => void;
  onShareClick: () => void;
  isStarLoading?: boolean; // 스타 로딩 상태 추가
  showStarButton?: boolean; // 스타 버튼 표시 여부
}

export const PostContent: React.FC<PostContentProps> = ({ post, onStarClick, onShareClick, isStarLoading = false, showStarButton = true }) => {
  // 이미지 로드 실패 상태 관리
  const [imageError, setImageError] = useState(false);
  
  // 안전한 썸네일 이미지 URL을 메모이제이션
  const safeThumbnailUrl = useMemo(() => {
    return getSafeThumbnailUrl(post.thumbnailUrl);
  }, [post.thumbnailUrl]);
  
  // 이미지 로드 실패 시 디폴트 이미지로 대체
  const handleImageError = () => {
    setImageError(true);
  };

     return (
     <div className="bg-light-header dark:bg-dark-header rounded-lg shadow-md dark:shadow-lg mb-12">
              {/* 썸네일 이미지 */}
        <div className="px-16 pt-12 pb-12 flex justify-center">
          <img
            src={imageError ? DEFAULT_IMAGES.THUMBNAIL : safeThumbnailUrl}
            alt="게시글 썸네일"
            className="max-w-4xl h-96 object-contain rounded-lg"
            onError={handleImageError}
          />
        </div>

               {/* 본문 텍스트 */}
        <div className="prose max-w-none">
          <div 
            className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg px-16 pb-12 break-words break-all"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* 상호작용 버튼들 */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        </div>

        {/* 3-1. Action Buttons Section (액션 버튼 영역) */}
        <div className="flex items-center justify-center space-x-4 px-6 pb-6">
         {/* 원문 가기 버튼 */}
         {post.link && (
           <Button
             variant="dark"
             size="sm"
             className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2"
             onClick={() => window.open(post.link, '_blank')}
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
             </svg>
             <span>원문 가기</span>
           </Button>
         )}

         {/* 링크 복사 버튼 */}
         <Button
           variant="default"
           size="sm"
           className="bg-light-header dark:bg-dark-header text-black dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800"
           onClick={onShareClick}
         >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
           </svg>
           <span>링크 복사</span>
         </Button>

                   {/* 스타 아이콘 */}
          {showStarButton && (
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
          )}
       </div>

      </div>
    );
  }; 