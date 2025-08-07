import React, { useState } from 'react';
import { Button } from '@/components/foundation/button';
import { getSafeThumbnailUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

interface PostContentProps {
  post: any; // Post 타입을 사용하지만 여기서는 any로 간단히 처리
  onStarClick: () => void;
  onShareClick: () => void;
}

export const PostContent: React.FC<PostContentProps> = ({ post, onStarClick, onShareClick }) => {
  // 이미지 로드 실패 상태 관리
  const [imageError, setImageError] = useState(false);
  
  // 안전한 썸네일 이미지 URL 사용
  const safeThumbnailUrl = getSafeThumbnailUrl(post.thumbnailUrl);
  
  // 이미지 로드 실패 시 디폴트 이미지로 대체
  const handleImageError = () => {
    setImageError(true);
  };

     return (
     <div className="bg-white rounded-lg shadow-md mb-12">
              {/* 썸네일 이미지 */}
        <div className="px-16 pt-12 pb-12">
          <img
            src={imageError ? DEFAULT_IMAGES.THUMBNAIL : safeThumbnailUrl}
            alt="게시글 썸네일"
            className="w-full h-96 object-cover rounded-lg"
            onError={handleImageError}
          />
        </div>

               {/* 본문 텍스트 */}
        <div className="prose max-w-none">
          <div 
            className="text-gray-700 leading-relaxed text-lg px-16 pb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* 상호작용 버튼들 */}
        <div className="pt-6 border-t border-gray-200">
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

         {/* 공유하기 버튼 */}
         <Button
           variant="default"
           size="sm"
           className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-50"
           onClick={onShareClick}
         >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
           </svg>
           <span>공유하기</span>
         </Button>

         {/* 스타 아이콘 */}
         <button 
           onClick={onStarClick}
           className="flex items-center justify-center w-10 h-10 text-yellow-500 hover:text-yellow-600 transition-colors"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
           </svg>
         </button>
       </div>

      </div>
    );
  }; 