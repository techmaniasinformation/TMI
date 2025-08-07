import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [hasGeneratedAITags, setHasGeneratedAITags] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');

  const handleAISummary = async () => {
    if (!linkUrl) {
      alert('링크 URL을 먼저 입력해주세요.');
      return;
    }

         // URL 에러 초기화
     setUrlError('');
     
     // URL 필터링 - 태그블로그 글만 허용
     const allowedDomains = [
      'tistory.com',
      'blog.naver.com',
      'blog.daum.net',
      'brunch.co.kr',
      'medium.com',
      'velog.io',
      'github.io',
      'notion.so'
    ];
    
    try {
      const url = new URL(linkUrl);
      const domain = url.hostname.toLowerCase();
      
      const isAllowedDomain = allowedDomains.some(allowed => 
        domain === allowed || domain.endsWith('.' + allowed)
      );
      
             if (!isAllowedDomain) {
         setUrlError('지원하지 않는 URL입니다. 블로그 글 URL만 입력해주세요.');
         return;
       }
       
       // URL 경로가 너무 짧으면 거부 (예: https://example.tistory.com/12)
       if (url.pathname.length < 5) {
         setUrlError('올바른 블로그 글 URL을 입력해주세요. (예: https://example.tistory.com/entry/글제목)');
         return;
       }
       
       // URL에 숫자만 있거나 너무 단순한 경로는 거부
       const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
       if (pathSegments.length < 2) {
         setUrlError('올바른 블로그 글 URL을 입력해주세요. (예: https://example.tistory.com/entry/글제목)');
         return;
       }
      
         } catch (error) {
       setUrlError('올바른 URL 형식을 입력해주세요.');
       return;
     }

    setIsAILoading(true);
    try {
      // API 요청 - 백엔드 서버 URL 사용
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/summary?url=${encodeURIComponent(linkUrl)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`AI 요약 요청에 실패했습니다. (${response.status})`);
      }

      const result = await response.json();
      
      if (result.status === 'SUCCESS' && result.data) {
        // AI 요약 내용 설정
        const summary = result.data.summary || '';
        setAiSummary(summary);
        setContent(summary); // content에도 AI 요약 내용 설정
        
        // AI 태그 설정 (최대 5개)
        if (result.data.tags && Array.isArray(result.data.tags)) {
          const tagsToSet = result.data.tags.slice(0, 5);
          setTags(tagsToSet);
          setAiGeneratedTags(tagsToSet);
          setHasGeneratedAITags(true);
        }
        
        alert('AI 요약이 완료되었습니다!');
      } else if (result.status === 'ERROR' && result.code === 'AI-001') {
        // 유효하지 않은 URL 에러 처리
        alert('입력하신 URL이 유효하지 않습니다. 올바른 웹사이트 주소를 입력해주세요.');
             } else {
         throw new Error('AI 요약 응답 형식이 올바르지 않습니다.');
       }
     } catch (error) {
       console.error('AI 요약 실패:', error);
       if (error instanceof Error && error.message.includes('502')) {
         alert('AI 요약에 실패했습니다.');
       } else {
         alert('AI 요약에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
       }
     } finally {
      setIsAILoading(false);
    }
  };



  const handleSave = async () => {
    if (!linkUrl || !title) {
      alert('링크 URL과 제목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 현재 태그 상태를 그대로 사용
      const finalTags = tags;
      
             // API 요청 데이터 준비
       const requestData = {
         memberId: user?.memberId || 1, // 실제 로그인된 사용자 ID 사용
         link: linkUrl,
         title: title,
         thumbnailUrl: imagePreview || '', // TODO: 실제 이미지 업로드 후 URL로 변경
         content: content,
         tags: finalTags
       };

       // 전송할 JSON 데이터 콘솔에 출력
   

                      // API 호출
       const response = await fetch('https://i13a509.p.ssafy.io/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer accessToken' // TODO: 실제 accessToken으로 변경
          },
          body: JSON.stringify(requestData)
        });

      if (!response.ok) {
        throw new Error('게시글 수정에 실패했습니다.');
      }

             const result = await response.json();
       console.log('게시글 수정 응답:', result);

       
       alert('게시글이 수정되었습니다!');
       
       // 저장 완료 후 상세 페이지로 이동 - 응답에서 받은 게시글 ID 사용
       if (result.data && result.data.postId) {
         navigate(`/post/${result.data.postId}`);
       } else {
         navigate('/'); // ID가 없으면 홈으로 이동
       }
      
    } catch (error) {
      console.error('저장 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <span className="text-xl">←</span>
            <span>돌아가기</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">게시글 수정</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          
          {/* Link URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              링크 URL *
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
                         {!linkUrl && (
               <p className="text-red-500 text-sm mt-1">링크 URL을 입력해주세요</p>
             )}
             {urlError && (
               <p className="text-red-500 text-sm mt-1">{urlError}</p>
             )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-500">
                {title.length}/20
              </span>
            </div>
          </div>

                     {/* Thumbnail Image */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               썸네일 이미지
             </label>
             
                           {/* Image Display Area */}
              <div className="w-48 h-32 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center mb-3 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="업로드된 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">디폴트 이미지</p>
                  </div>
                )}
              </div>
              
              {/* Image Upload */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm"
                >
                  {imagePreview ? '이미지 변경' : '이미지 업로드'}
                </label>
                {selectedImage && (
                  <span className="text-sm text-gray-600">
                    {selectedImage.name}
                  </span>
                )}
              </div>
           </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
                         <div className="border border-gray-300 rounded-md">
               {/* Editor Toolbar */}
               <div className="flex items-center gap-2 p-3 border-b border-gray-300 bg-gray-50">
                 <button className="w-8 h-8 flex items-center justify-center text-sm font-bold border border-gray-300 rounded hover:bg-gray-200">
                   H
                 </button>
                 <button className="w-8 h-8 flex items-center justify-center text-sm font-bold border border-gray-300 rounded hover:bg-gray-200">
                   B
                 </button>
                 <button className="w-8 h-8 flex items-center justify-center text-sm italic border border-gray-300 rounded hover:bg-gray-200">
                   I
                 </button>
                 <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200">
                   🔗
                 </button>
                 <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200">
                   {'</>'}
                 </button>
                 <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200">
                   •
                 </button>
               </div>

                               {/* Content Editor */}
                {isAILoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">AI가 내용을 분석하고 있습니다...</p>
                    </div>
                  </div>
                ) : aiSummary ? (
                  <div className="p-4 h-64 overflow-y-auto">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">AI 요약</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {aiSummary}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      maxLength={65536}
                      className="w-full h-64 p-4 resize-none focus:outline-none"
                      placeholder="내용을 입력하세요..."
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                      {content.length}/65,536
                    </div>
                  </div>
                )}
             </div>
                         <div className="flex justify-end mt-2">
                               <button 
                  onClick={handleAISummary}
                  disabled={isAILoading}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  AI 요약하기
                </button>
             </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그
            </label>
                                      {isAILoading ? (
               <div className="flex items-center justify-center py-8">
                 <div className="text-center">
                   <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                   <p className="text-sm text-gray-600">태그를 생성하고 있습니다...</p>
                 </div>
               </div>
             ) : (
               <div className="flex flex-wrap gap-2 mb-3">
                 {tags.map((tag, index) => (
                   <span
                     key={index}
                     className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                   >
                     #{tag}
                   </span>
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            × 취소
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
                         {isLoading ? (
               <>
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 수정 중...
               </>
             ) : (
                               '수정하기'
             )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEditPage;