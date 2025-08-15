import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/themeStore';
import { useTagAutocomplete } from '@/hooks/tags/useTagAutocomplete';
import { useImageCompression } from '@/hooks/useImageCompression';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const PostCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { isDarkMode } = useThemeStore();
  
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
  const [aiSummary, setAiSummary] = useState('');

  // 이미지 압축 커스텀 훅 사용
  const {
    selectedImage,
    imagePreview,
    isImageProcessing,
    originalFileSize,
    handleImageUpload,
    handleImageCancel,
    setImagePreview
  } = useImageCompression();
  
  // 에러 상태
  const [urlError, setUrlError] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [contentError, setContentError] = useState<string>('');
  
  // 태그 관련 상태
  const [newTag, setNewTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagError, setTagError] = useState('');
  
  // UI 상태
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // URL 처리 및 유효성 검사 함수
  const processAndValidateUrl = (url: string) => {
    // 에러 초기화
    setUrlError('');
    setAiError('');
    
    // URL에 프로토콜이 없으면 https:// 추가
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }
    
    // URL 기본 유효성 검사
    try {
      const urlObj = new URL(processedUrl);
      
      // URL의 기본적인 구조만 확인
      if (!urlObj.protocol || (!urlObj.protocol.startsWith('http'))) {
        setUrlError('http 또는 https URL을 입력해주세요.');
        return null;
      }
      
      // 티스토리, 벨로그, 네이버 블로그, Medium 허용
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

  const handleAISummary = async () => {
    if (!linkUrl) {
      alert('링크 URL을 먼저 입력해주세요.');
      return;
    }

    const processedUrl = processAndValidateUrl(linkUrl);
    if (!processedUrl) return;

         setIsAILoading(true);
     try {
       const decodedUrl = decodeURIComponent(processedUrl);
       const apiUrl = `https://i13a509.p.ssafy.io/api/v1/summary?url=${decodedUrl}`;
       console.log('AI 요약 API 요청:', apiUrl);
      
      // API 요청 - 백엔드 서버 URL 사용
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      console.log('AI 요약 API 응답 상태:', response.status);
      console.log('AI 요약 API 응답 헤더:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI 요약 API 에러 응답:', errorText);
        throw new Error(`AI 요약 요청에 실패했습니다. (${response.status})`);
      }

      const result = await response.json();
      
      if (result.status === 'SUCCESS' && result.data) {
                 // AI 요약 내용 설정
         const summary = result.data.summary || '';
         setAiSummary(summary);
         setContent(summary); // content에도 AI 요약 내용 설정
        
        // AI 태그 설정 (최대 5개)
        if (result.data.tags && Array.isArray(result.data.tags) && result.data.tags.length > 0) {
          try {
            const tagsToSet = result.data.tags.slice(0, 5);
            setTags(tagsToSet);
          } catch (error) {
            console.warn('AI 태그 처리 중 오류 발생:', error);
            setTags([]);
          }
        }
        
        alert('AI 요약이 완료되었습니다!');
             } else if (result.status === 'ERROR' && result.code === 'AI-001') {
         // 유효하지 않은 URL 에러 처리
         setAiError('입력하신 URL이 유효하지 않습니다. 올바른 웹사이트 주소를 입력해주세요.');
              } else {
          throw new Error('AI 요약 응답 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('AI 요약 실패:', error);
        if (error instanceof Error && error.message.includes('502')) {
          setAiError('AI 요약 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (error instanceof Error && error.message.includes('AI-')) {
          setAiError('서비스 준비중입니다.');
        } else {
          setAiError('AI 요약에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
        }
     } finally {
      setIsAILoading(false);
    }
  };



     const handleSave = async () => {
    // 에러 상태 초기화
    setTitleError('');
    setContentError('');
    setUrlError('');
    
    let hasError = false;
    
    if (!linkUrl || !title) {
      if (!linkUrl) setUrlError('링크 URL을 입력해주세요.');
      if (!title) setTitleError('제목을 입력해주세요.');
      hasError = true;
    }

    if (content.length < 50) {
      setContentError('게시글 내용은 50자 이상 입력해주세요.');
      hasError = true;
    }

    if (content.length > 6000) {
      setContentError('게시글 내용은 6000자 이하여야 합니다.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // 사용자 정보 확인
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      const processedUrl = processAndValidateUrl(linkUrl);
      if (!processedUrl) {
        setUrlError('올바른 URL을 입력해주세요.');
        setIsLoading(false);
        return;
      }
      
      // FormData 생성
      const formData = new FormData();
      
      // 태그 데이터 검증 및 정리
      const validatedTags = Array.isArray(tags) ? tags.filter(tag => 
        typeof tag === 'string' && tag.trim().length > 0
      ).slice(0, 5) : [];
      
      // 포스트맨과 동일한 구조로 JSON 데이터 생성
      const requestData = {
        memberId: user.memberId, // null 체크 후 사용
        link: processedUrl,
        title: title,
        content: content,
        tags: validatedTags
        // thumbnailUrl 필드 제거 (서버에서 요구하지 않음)
      };
      
      const blob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
      formData.append('req', blob);
      
      // 이미지가 선택된 경우 FormData에 추가
      if (selectedImage) {
        formData.append('thumbnailImage', selectedImage);
      }




      
      const response = await fetch('https://i13a509.p.ssafy.io/api/v1/post', {
        method: 'POST',
        credentials: 'include', // 쿠키 자동 전송
        body: formData // Content-Type은 브라우저가 자동으로 설정
      });
      


      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 응답 에러:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`게시글 작성에 실패했습니다. (${response.status}: ${response.statusText})`);
      }

      const result = await response.json();

      alert('게시글이 작성되었습니다!');
      
      // 저장 완료 후 상세 페이지로 이동 - 응답에서 받은 게시글 ID 사용
      if (result.data && result.data.postId) {
        navigate(`/post/${result.data.postId}`);
      } else {
        navigate('/'); // ID가 없으면 홈으로 이동
      }
    
    } catch (error) {
      console.error('저장 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleAddTag = (tagName?: string) => {
    const tagToAdd = (tagName || newTag).trim();
    if (tagToAdd) {
      if (tags.includes(tagToAdd)) {
        setTagError('중복된 태그입니다.');
        return;
      }
      if (tags.length >= 5) {
        setTagError('태그는 최대 5개까지 추가할 수 있습니다.');
        return;
      }
      if (tagToAdd.length > 20) {
        setTagError('태그는 20자 이하여야 합니다.');
        return;
      }
      
      setTagError(''); // 에러 초기화
      setTags([...tags, tagToAdd]);
      setNewTag('');
      setShowTagSuggestions(false);
      clearSuggestions();
    }
  };
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setNewTag(value);
      setTagError(''); // 사용자가 입력 시작 시 에러 메시지 초기화

      if (value.trim()) {
        searchTags(value.trim());
        setShowTagSuggestions(true);
      } else {
        setShowTagSuggestions(false);
        clearSuggestions();
      }
    }
  };
  
  const handleTagInputBlur = () => {
    // 잠시 후에 숨기기 (클릭 이벤트 처리 시간 확보)
    setTimeout(() => {
      setShowTagSuggestions(false);
    }, 200);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 엔터키 입력 방지
      return;
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
      clearSuggestions();
    }
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
             <div className="max-w-4xl mx-auto p-6">
         {/* Header */}
         <div className="mb-6">
           <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">게시글 작성</h1>
           <button 
             onClick={() => navigate(-1)}
             className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
           >
             <span className="text-xl">←</span>
             <span>돌아가기</span>
           </button>
         </div>
        <div className="bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          
          {/* Link URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              링크 URL *
            </label>
            <div className="relative">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                maxLength={255}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">
                {linkUrl.length}/255
              </span>
            </div>
            {/* URL 관련 경고 메시지 */}
            {urlError && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">{urlError}</p>
            )}
            {!linkUrl && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">⚠️ 링크 URL을 입력해주세요</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              제목 *
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent break-words break-all dark:bg-gray-800 dark:text-white"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">
                {title.length}/20
              </span>
            </div>
            {titleError && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">{titleError}</p>
            )}
          </div>

          {/* Thumbnail Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              썸네일 이미지
            </label>
            
                         {/* Image Display Area */}
             <div className="w-48 h-32 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 mb-3 overflow-hidden">
               {imagePreview ? (
                 <img
                   src={imagePreview}
                   alt="업로드된 이미지"
                   className="w-full h-full object-cover"
                   style={{ objectPosition: 'center' }}
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                   <div className="text-center">
                     <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-2"></div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">디폴트 이미지</p>
                   </div>
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
                 disabled={isImageProcessing}
               />
               <label
                 htmlFor="image-upload"
                 className={`px-4 py-2 text-white rounded-md cursor-pointer text-sm ${
                   isImageProcessing 
                     ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                     : 'bg-blue-600 hover:bg-blue-700'
                 }`}
               >
                 {isImageProcessing ? (
                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     처리 중...
                   </div>
                 ) : (
                   imagePreview ? '이미지 변경' : '이미지 업로드'
                 )}
               </label>
               {imagePreview && !isImageProcessing && (
                 <button
                   type="button"
                   onClick={handleImageCancel}
                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer text-sm"
                 >
                   이미지 취소
                 </button>
               )}
               {selectedImage && (
                 <span className="text-sm text-gray-600 dark:text-gray-300">
                   {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)}MB)
                   {originalFileSize > selectedImage.size && (
                     <span className="text-gray-400 dark:text-gray-500 ml-1">
                       (원본: {(originalFileSize / 1024 / 1024).toFixed(2)}MB)
                     </span>
                   )}
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
                  onClick={handleAISummary}
                  disabled={isAILoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
                >
                  {isAILoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      AI 요약 중...
                    </div>
                  ) : (
                    'AI 요약하기'
                  )}
                </button>
              </div>
              
              {/* AI 에러 메시지 */}
              {aiError && (
                <div className="mb-3">
                  <div className="text-red-600 dark:text-red-300 text-sm bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-500 rounded-r-md px-4 py-3 relative shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 dark:text-red-400 text-lg flex-shrink-0">⚠️</span>
                      <div className="flex-1">
                        <p className="font-medium text-red-800 dark:text-red-100 mb-1">AI 요약 오류</p>
                        <p className="text-red-700 dark:text-red-200">{aiError}</p>
                        <p className="text-red-600 dark:text-red-300 text-xs mt-2 opacity-90">
                          💡 URL을 확인하고 다시 시도해주세요
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {/* AI 로딩 상태 */}
            {isAILoading ? (
              <div className="flex items-center justify-center h-64 border border-gray-300 dark:border-gray-600 rounded-md">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">AI가 내용을 분석하고 있습니다...</p>
                </div>
              </div>
            ) : (
              /* MD Editor (AI 요약 여부와 관계없이 동일) */
              <div data-color-mode={isDarkMode ? "dark" : "light"} className="md-editor-container h-[300px]">
                <MDEditor
                  value={content}
                  onChange={(val) => {
                    const newContent = val || '';
                    if (newContent.length <= 6000) {
                      setContent(newContent);
                    }
                  }}
                  preview={isPreviewMode ? "preview" : "edit"}
                  hideToolbar={isPreviewMode}
                  onClick={(e) => {
                    // MDEditor 내부의 textarea를 찾아서 커서를 맨 뒤로 이동
                    const editor = e.currentTarget;
                    const textarea = editor.querySelector('textarea');
                    if (textarea) {
                      textarea.focus();
                      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                    }
                  }}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {content.length > 6000 ? (
                      <span className="text-red-500">글자 수 제한을 초과했습니다 ({content.length}/6000)</span>
                    ) : (
                      <span>{content.length}/6000</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleTogglePreview}
                    className="px-3 py-1 text-sm bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    {isPreviewMode ? '편집 모드' : '미리보기'}
                  </button>
                </div>
                {contentError && (
                  <p className="text-sm text-red-500 mt-1">{contentError}</p>
                )}
              </div>
            )}

           </div>
          
          <div className="mt-8" />

          {/* Tags */}
          <div className="mt-12">
            <label className="block text-sm font-medium text-gray-700 mb-4">
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
                  <div className="mb-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newTag}
                        onChange={handleTagInputChange}
                        onKeyPress={handleTagKeyPress}
                        onBlur={handleTagInputBlur}
                        onFocus={() => newTag.trim() && setShowTagSuggestions(true)}
                        // maxLength={20} // 임시 주석처리
                        placeholder="태그를 입력하세요 (기존 태그 검색 가능)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent break-words break-all dark:bg-gray-800 dark:text-white"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">
                        {newTag.length}/20 {/* 임시 주석처리 */}
                      </span>
                    </div>
                  </div>
                  {tagError && <p className="text-sm text-red-500 mt-1">{tagError}</p>}
                  
                  {/* 태그 제안 드롭다운 */}
                  {showTagSuggestions && (tagLoading || tagSuggestions.length > 0) && (
                    <div className="absolute top-full left-0 right-12 bg-light-header dark:bg-dark-header border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {tagLoading && (
                        <div className="flex items-center justify-center py-4">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">검색 중...</span>
                        </div>
                      )}
                                             {tagSuggestions.map((suggestion) => (
                         <button
                           key={`${suggestion.type}-${suggestion.id}`}
                           type="button"
                           onClick={() => handleAddTag(suggestion.name)}
                           disabled={tags.length >= 5}
                           className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500"
                         >
                           <span className="text-sm">{suggestion.name}</span>
                         </button>
                       ))}
                      {!tagLoading && tagSuggestions.length === 0 && newTag.trim() && (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                          '
                          <span className="font-medium">{newTag.trim()}</span>
                          '에 대한 검색 결과가 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* 태그 목록 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm"
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
            className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            × 취소
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                저장 중...
              </>
            ) : (
              '작성하기'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreatePage; 