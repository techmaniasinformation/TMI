import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostCreatePage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleAISummary = async () => {
    setIsAILoading(true);
    try {
      // AI 요약하면서 태그 자동 생성
      const aiTags = await generateAITags(content);
      if (aiTags.length > 0) {
        const tagsToSet = aiTags.slice(0, 5);
        setTags(tagsToSet);
      }
      
      // AI 요약 내용 생성 (실제로는 AI API에서 받아옴)
      const summary = `AI가 생성한 요약 내용이 여기에 표시됩니다.`;
      setAiSummary(summary);
    } catch (error) {
      console.error('AI 요약 실패:', error);
      alert('AI 요약에 실패했습니다.');
    } finally {
      setIsAILoading(false);
    }
  };

  const generateAITags = async (content: string) => {
    try {
      // 이미 AI 태그를 생성했다면 재사용
      if (hasGeneratedAITags && aiGeneratedTags.length > 0) {
        return aiGeneratedTags;
      }

      // TODO: 실제 AI 태그 생성 API 호출
      // 임시로 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 본문 내용을 분석해서 관련 태그 생성 (실제로는 AI API에서 받아옴)
      const contentLower = content.toLowerCase();
      const possibleTags = [];
      
      // 키워드 기반 태그 생성 (실제로는 AI API에서 받아옴)
      // TODO: 실제 AI 태그 생성 로직 구현
      possibleTags.push('python', '데이터사이언스', '머신러닝', '알고리즘');
      
      // AI 태그 저장 (재사용을 위해)
      setAiGeneratedTags(possibleTags);
      setHasGeneratedAITags(true);
      
      return possibleTags;
    } catch (error) {
      console.error('AI 태그 생성 실패:', error);
      alert('AI 태그 생성에 실패했습니다.');
      return [];
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
        memberId: 1, // TODO: 실제 로그인된 사용자 ID로 변경
        link: linkUrl,
        title: title,
        thumbnailUrl: imagePreview || '', // TODO: 실제 이미지 업로드 후 URL로 변경
        content: content,
        tags: finalTags
      };

      // 전송할 JSON 데이터 콘솔에 출력
      console.log('전송할 JSON 데이터:', JSON.stringify(requestData, null, 2));

      // API 호출
      const response = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer accessToken' // TODO: 실제 accessToken으로 변경
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('게시글 작성에 실패했습니다.');
      }

      const result = await response.json();
      console.log('게시글 작성 성공:', result);
      
      alert('게시글이 작성되었습니다!');
      
      // 저장 완료 후 상세 페이지로 이동
      navigate(`/post/${result.id || '1'}`);
      
    } catch (error) {
      console.error('저장 실패:', error);
      alert('게시글 작성에 실패했습니다.');
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
          <h1 className="text-xl font-semibold text-gray-900">새 게시글 작성</h1>
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