import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useTagAutocomplete } from '@/hooks/tags/useTagAutocomplete';
import { useImageCompression } from '@/hooks/useImageCompression';

export const usePostCreate = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  // 태그 자동완성 훅 사용
  const {
    suggestions: tagSuggestions,
    loading: tagLoading,
    searchTags,
    clearSuggestions
  } = useTagAutocomplete();

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

  // 기본 상태
  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  
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
  const processAndValidateUrl = useCallback((url: string) => {
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
  }, []);

  // AI 요약 처리
  const handleAISummary = useCallback(async () => {
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
  }, [linkUrl, processAndValidateUrl]);

  // 저장 처리
  const handleSave = useCallback(async () => {
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
  }, [linkUrl, title, content, tags, user?.memberId, navigate, processAndValidateUrl, selectedImage]);

  // 태그 추가
  const handleAddTag = useCallback((tagName?: string) => {
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
  }, [tags, newTag, clearSuggestions]);

  // 태그 입력 변경
  const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [searchTags, clearSuggestions]);

  // 태그 입력 블러
  const handleTagInputBlur = useCallback(() => {
    // 잠시 후에 숨기기 (클릭 이벤트 처리 시간 확보)
    setTimeout(() => {
      setShowTagSuggestions(false);
    }, 200);
  }, []);

  // 태그 제거
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  // 태그 키 입력
  const handleTagKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 엔터키 입력 방지
      return;
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
      clearSuggestions();
    }
  }, [clearSuggestions]);

  // 미리보기 토글
  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  // 취소
  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    // 상태
    linkUrl,
    setLinkUrl,
    title,
    setTitle,
    content,
    setContent,
    tags,
    isLoading,
    isAILoading,
    aiSummary,
    urlError,
    aiError,
    titleError,
    contentError,
    newTag,
    showTagSuggestions,
    tagError,
    isPreviewMode,
    tagSuggestions,
    tagLoading,
    selectedImage,
    imagePreview,
    isImageProcessing,
    originalFileSize,

    // 이벤트 핸들러
    handleAISummary,
    handleSave,
    handleAddTag,
    handleTagInputChange,
    handleTagInputBlur,
    handleRemoveTag,
    handleTagKeyPress,
    handleTogglePreview,
    handleCancel,
    handleImageUpload,
    handleImageCancel,

    // 유틸리티
    processAndValidateUrl,
    clearSuggestions,
  };
};
