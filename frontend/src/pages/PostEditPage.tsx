import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useTagAutocomplete } from '@/hooks/tags/useTagAutocomplete';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  // 태그 자동완성 훅 사용
  const {
    suggestions: tagSuggestions,
    loading: tagLoading,
    searchTags,
    clearSuggestions
  } = useTagAutocomplete();
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
  const [newTag, setNewTag] = useState(''); // 새로운 태그 입력을 위한 상태
  const [showTagSuggestions, setShowTagSuggestions] = useState(false); // 태그 제안 표시 여부
  const [isPreviewMode, setIsPreviewMode] = useState(false); // 미리보기 모드 상태

  // contentTextareaRef는 더 이상 필요없음 (MD Editor가 자체 참조 관리)

  const handleAISummary = async () => {
    if (!linkUrl) {
      alert('링크 URL을 먼저 입력해주세요.');
      return;
    }

         // URL 에러 초기화
     setUrlError('');
     
     // URL 기본 유효성 검사만 수행
     try {
       const url = new URL(linkUrl);
       
       // URL의 기본적인 구조만 확인
       if (!url.protocol || (!url.protocol.startsWith('http'))) {
         setUrlError('http 또는 https URL을 입력해주세요.');
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
  
  // 태그 관리 함수들
  const handleAddTag = (tagName?: string) => {
    const tagToAdd = tagName || newTag.trim();
    if (tagToAdd && !tags.includes(tagToAdd)) {
      if (tags.length >= 5) {
        alert('태그는 최대 5개까지 추가할 수 있습니다.');
        return;
      }
      setTags([...tags, tagToAdd]);
      setNewTag('');
      setShowTagSuggestions(false);
      clearSuggestions();
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTag(value);
    
    if (value.trim()) {
      searchTags(value.trim());
      setShowTagSuggestions(true);
    } else {
      setShowTagSuggestions(false);
      clearSuggestions();
    }
  };
  
  const handleTagInputBlur = () => {
    setTimeout(() => {
      setShowTagSuggestions(false);
    }, 200);
  };
  
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
      clearSuggestions();
    }
  };
  
  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };
  

  
  // react-md-editor에는 자체 툴바가 있으므로 커스텀 에디터 기능 제거

  return (
    <div className="min-h-screen bg-gray-50">
             <div className="max-w-4xl mx-auto p-6">
         {/* Header */}
         <div className="mb-6">
           <h1 className="text-xl font-semibold text-gray-900 mb-4">게시글 수정</h1>
           <button 
             onClick={() => navigate(-1)}
             className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
           >
             <span className="text-xl">←</span>
             <span>돌아가기</span>
           </button>
         </div>
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
             <div className="flex items-center justify-between mb-2">
               <label className="block text-sm font-medium text-gray-700">
                 내용
               </label>
               <button
                 type="button"
                 onClick={handleTogglePreview}
                 className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
               >
                 {isPreviewMode ? '편집 모드' : '미리보기'}
               </button>
             </div>
                          {/* AI 로딩 상태 */}
             {isAILoading ? (
              <div className="flex items-center justify-center h-64 border border-gray-300 rounded-md">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">AI가 내용을 분석하고 있습니다...</p>
                </div>
              </div>
                         ) : aiSummary ? (
                                                             /* AI 요약 후 에디터 */
                 <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    preview={isPreviewMode ? "preview" : "edit"}
                    hideToolbar={isPreviewMode}
                    height={300}
                    data-color-mode="light"
                  />
                </div>
                         ) : (
                                                             /* 기본 MD Editor */
                 <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    preview={isPreviewMode ? "preview" : "edit"}
                    hideToolbar={isPreviewMode}
                    height={300}
                    data-color-mode="light"
                  />
                </div>
             )}
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
               <>
                 {/* 태그 입력 영역 */}
                 <div className="relative">
                   <div className="flex items-center gap-2 mb-3">
                     <input
                       type="text"
                       value={newTag}
                       onChange={handleTagInputChange}
                       onKeyPress={handleTagKeyPress}
                       onBlur={handleTagInputBlur}
                       onFocus={() => newTag.trim() && setShowTagSuggestions(true)}
                       placeholder="태그를 입력하세요 (기존 태그 검색 가능)"
                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                                           <button
                        type="button"
                        onClick={() => handleAddTag()}
                        disabled={!newTag.trim() || tags.length >= 5}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                      >
                        추가
                      </button>
                   </div>
                   
                   {/* 태그 제안 드롭다운 */}
                   {showTagSuggestions && (tagLoading || tagSuggestions.length > 0) && (
                     <div className="absolute top-full left-0 right-12 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                       {tagLoading && (
                         <div className="flex items-center justify-center py-4">
                           <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                           <span className="text-sm text-gray-600">검색 중...</span>
                         </div>
                       )}
                                               {tagSuggestions.map((suggestion) => (
                          <button
                            key={`${suggestion.type}-${suggestion.id}`}
                            type="button"
                            onClick={() => handleAddTag(suggestion.name)}
                            disabled={tags.length >= 5}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            <span className="text-sm">{suggestion.name}</span>
                          </button>
                        ))}
                       {!tagLoading && tagSuggestions.length === 0 && newTag.trim() && (
                         <div className="px-4 py-3 text-sm text-gray-500 text-center">
                           '
                           <span className="font-medium">{newTag.trim()}</span>
                           '에 대한 검색 결과가 없습니다.
                         </div>
                       )}
                     </div>
                   )}
                 </div>
                 
                 {/* 태그 목록 */}
                 <div className="flex flex-wrap gap-2 mb-3">
                   {tags.map((tag, index) => (
                     <span
                       key={index}
                       className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                     >
                       #{tag}
                       <button
                         type="button"
                         onClick={() => handleRemoveTag(tag)}
                         className="text-blue-600 hover:text-blue-800 text-lg font-bold"
                       >
                         ×
                       </button>
                     </span>
                   ))}
                 </div>
               </>
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