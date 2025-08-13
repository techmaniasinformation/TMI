import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useTagAutocomplete } from '@/hooks/tags/useTagAutocomplete';
import { useImageCompression } from '@/hooks/useImageCompression';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
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
  const [aiSummary, setAiSummary] = useState('');

  // 이미지 압축 커스텀 훅 사용
  const {
    selectedImage,
    imagePreview,
    isImageProcessing,
    originalFileSize,
    handleImageUpload,
    handleImageCancel,
    setImagePreview,
    setExistingImageUrl,
    clearExistingImageUrl
  } = useImageCompression();
  
  // 에러 상태
  const [urlError, setUrlError] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  
  // 태그 관련 상태
  const [newTag, setNewTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagError, setTagError] = useState('');

  // 기존 게시글 데이터 로드
  useEffect(() => {
    if (location.state?.postData) {
      const postData = location.state.postData;
      setTitle(postData.title || '');
      setContent(postData.content || '');
      setTags(postData.tags || []);
      setLinkUrl(postData.link || '');
      
      if (postData.thumbnailUrl) {
        setExistingImageUrl(postData.thumbnailUrl);
      }
    }
  }, [location.state, setExistingImageUrl]);

  // URL 처리 및 유효성 검사 함수
  const processAndValidateUrl = (url: string) => {
    let processedUrl = url.trim();
    
    // URL이 http:// 또는 https://로 시작하지 않으면 https:// 추가
    if (processedUrl && !processedUrl.match(/^https?:\/\//)) {
      processedUrl = `https://${processedUrl}`;
    }
    
    // URL 유효성 검사
    try {
      new URL(processedUrl);
      return processedUrl;
    } catch {
      return null;
    }
  };

  // 태그 입력 변경 핸들러
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

  const handleTagInputFocus = () => {
    if (newTag.trim()) {
      setShowTagSuggestions(true);
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

  // AI 요약 함수
  const handleAISummary = async () => {
    if (!linkUrl) {
      alert('링크 URL을 먼저 입력해주세요.');
      return;
    }

    const processedUrl = processAndValidateUrl(linkUrl);
    if (!processedUrl) return;

    setIsAILoading(true);
    try {
      const apiUrl = `https://i13a509.p.ssafy.io/api/v1/summary?url=${encodeURIComponent(processedUrl)}`;
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
      } else {
        setAiError('AI 요약에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
      }
    } finally {
      setIsAILoading(false);
    }
  };

  // 태그 선택 핸들러
  const handleTagSelect = (tagName: string) => {
    handleAddTag(tagName);
  };

  // AI 태그 생성 함수
  const generateAITags = async () => {
    if (!title.trim() && !content.trim()) {
      setAiError('제목이나 내용을 입력해주세요.');
      return;
    }

    setIsAILoading(true);
    try {
      const response = await fetch('https://i13a509.p.ssafy.io/api/v1/ai/tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim()
        })
      });

      if (!response.ok) {
        throw new Error('AI 태그 생성에 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.status === 'SUCCESS' && data.data && data.data.length > 0) {
        // 기존 태그와 중복되지 않는 태그만 추가
        const newTags = data.data.filter((tag: string) => !tags.includes(tag));
        
        if (newTags.length === 0) {
          setAiError('추가할 수 있는 새로운 태그가 없습니다.');
          return;
        }
        
        // 최대 5개까지 추가
        const tagsToAdd = newTags.slice(0, 5 - tags.length);
        setTags([...tags, ...tagsToAdd]);
        setAiSummary(`AI가 ${tagsToAdd.length}개의 태그를 생성했습니다.`);
      } else {
        setAiError('AI 태그 생성 결과가 없습니다.');
      }
    } catch (error) {
      console.error('AI 태그 생성 실패:', error);
      setAiError('AI 태그 생성 중 오류가 발생했습니다.');
    } finally {
      setIsAILoading(false);
    }
  };

  // 게시글 수정 함수
  const handleSave = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (content.length < 50) {
      alert('게시글 내용은 50자 이상 입력해주세요.');
      return;
    }
    if (title.length > 100) {
      alert('제목은 100자를 초과할 수 없습니다.');
      return;
    }
    if (content.length > 6000) {
      alert('내용은 6000자를 초과할 수 없습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('tags', JSON.stringify(tags));
      
      if (linkUrl.trim()) {
        const processedUrl = processAndValidateUrl(linkUrl);
        if (!processedUrl) {
          alert('올바른 URL을 입력해주세요.');
          setIsLoading(false);
          return;
        }
        formData.append('link', processedUrl);
      }
      
      if (selectedImage) {
        formData.append('thumbnail', selectedImage);
      }

      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'SUCCESS') {
          alert('게시글이 수정되었습니다.');
          navigate(`/post/${id}`);
        } else {
          throw new Error(result.message || '게시글 수정에 실패했습니다.');
        }
      } else {
        throw new Error('게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">게시글 수정</h1>
        
        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {title.length}/100
              </span>
            </div>
          </div>

          {/* 링크 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              링크 URL (선택사항)
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {urlError && <p className="text-sm text-red-500 mt-1">{urlError}</p>}
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              썸네일 이미지 (선택사항)
            </label>
            <div className="space-y-4">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="block w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                {isImageProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>이미지 처리 중...</span>
                  </div>
                ) : (
                  <span>이미지를 선택하거나 드래그하여 업로드하세요</span>
                )}
              </label>
              
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="w-full max-w-md h-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleImageCancel}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                  {originalFileSize > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      원본 크기: {(originalFileSize / (1024 * 1024)).toFixed(2)}MB
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 태그 */}
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
                  <input
                    type="text"
                    value={newTag}
                    onChange={handleTagInputChange}
                    onFocus={handleTagInputFocus}
                    onBlur={handleTagInputBlur}
                    placeholder="태그를 입력하세요 (DB에서 검색)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {/* 태그 제안 드롭다운 */}
                  {showTagSuggestions && (tagLoading || tagSuggestions.length > 0) && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
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
                          onClick={() => handleTagSelect(suggestion.name)}
                          disabled={tags.length >= 5}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 flex items-center gap-2"
                        >
                          <span className={`text-xs px-1.5 py-0.5 rounded text-white font-medium ${
                            suggestion.type === 'tech' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}>
                            {suggestion.type === 'tech' ? 'T' : 'C'}
                          </span>
                          <span className="text-sm">{suggestion.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {tagError && <p className="text-sm text-red-500 mt-1">{tagError}</p>}
                
                {/* 태그 목록 */}
                <div className="flex flex-wrap gap-2 mt-3">
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

          {/* 내용 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                내용
              </label>
              <button
                type="button"
                onClick={handleAISummary}
                disabled={isAILoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
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
                <div className="text-red-600 text-sm bg-red-50 border-l-4 border-red-400 rounded-r-md px-4 py-3 relative shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                    <div className="flex-1">
                      <p className="font-medium text-red-800 mb-1">AI 요약 오류</p>
                      <p className="text-red-700">{aiError}</p>
                      <p className="text-red-600 text-xs mt-2 opacity-90">
                        💡 URL을 확인하고 다시 시도해주세요
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="border border-gray-300 rounded-md">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                height={400}
                preview="edit"
                onClick={(e) => {
                  // 빈 공간 클릭 시 마지막에 커서 이동
                  const editor = e.currentTarget.querySelector('.w-md-editor-text');
                  if (editor) {
                    const textArea = editor.querySelector('textarea');
                    if (textArea) {
                      textArea.focus();
                      textArea.setSelectionRange(textArea.value.length, textArea.value.length);
                    }
                  }
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {content.length}/6000
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
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