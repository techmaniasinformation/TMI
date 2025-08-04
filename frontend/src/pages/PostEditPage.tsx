import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [linkUrl, setLinkUrl] = useState('https://example.com');
  const [title, setTitle] = useState('Python 데이터 분석');
  const [content, setContent] = useState(`# 데이터 사이언스 입문자를 위한 Python 활용법

#1. Python이 데이터 사이언스에 적합한 이유
- 간결하고 읽기 쉬운 문법
- 풍부한 데이터 분석 라이브러리 생태계
- 활발한 커뮤니티와 지속적인 업데이트
- 다양한 분야에서의 활용 가능성

##2. 필수 라이브러리 소개

### 2.1 NumPy
- 수치 계산을 위한 기본 라이브러리
- 다차원 배열 처리 및 수학적 연산 지원
- 다른 데이터 분석 라이브러리의 기반

###2.2 Pandas
- 데이터 조작 및 분석을 위한 강력한 도구
- DataFrame과 Series 구조로 데이터 관리
- CSV, Excel 등 다양한 형식의 데이터 처리

### 2.3 Matplotlib & Seaborn
- 데이터 시각화를 위한 라이브러리
- 다양한 차트와 그래프 생성 가능
- 통계적 분석 결과의 직관적 표현

#3. 실전 예제
- 데이터 로딩 및 전처리
- 기본 통계 분석
- 시각화를 통한 인사이트 도출
- 머신러닝 모델 적용`);

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
      const summary = `이 게시글은 데이터 사이언스와 Python에 관한 내용으로, 
      NumPy, Pandas, Matplotlib, Seaborn 등의 라이브러리를 활용한 
      데이터 분석 방법을 다루고 있습니다. 특히 Python의 간결한 문법과 
      풍부한 라이브러리 생태계를 통해 데이터 분석의 기초부터 실전 예제까지 
      체계적으로 설명하고 있습니다.`;
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
      
      // 키워드 기반 태그 생성
      if (contentLower.includes('python')) possibleTags.push('Python');
      if (contentLower.includes('데이터') || contentLower.includes('data')) possibleTags.push('데이터분석');
      if (contentLower.includes('머신러닝') || contentLower.includes('machine learning')) possibleTags.push('머신러닝');
      if (contentLower.includes('numpy')) possibleTags.push('NumPy');
      if (contentLower.includes('pandas')) possibleTags.push('Pandas');
      if (contentLower.includes('matplotlib')) possibleTags.push('Matplotlib');
      if (contentLower.includes('seaborn')) possibleTags.push('Seaborn');
      if (contentLower.includes('시각화') || contentLower.includes('visualization')) possibleTags.push('시각화');
      if (contentLower.includes('분석') || contentLower.includes('analysis')) possibleTags.push('분석');
      if (contentLower.includes('입문') || contentLower.includes('beginner')) possibleTags.push('입문');
      if (contentLower.includes('라이브러리') || contentLower.includes('library')) possibleTags.push('라이브러리');
      if (contentLower.includes('실전') || contentLower.includes('실습')) possibleTags.push('실전예제');
      if (contentLower.includes('통계')) possibleTags.push('통계');
      if (contentLower.includes('알고리즘')) possibleTags.push('알고리즘');
      
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
      let finalTags = tags;
      
      // 태그가 없을 때만 AI 태그 생성
      if (tags.length === 0) {
        const aiTags = await generateAITags(content);
        if (aiTags.length > 0) {
          finalTags = aiTags.slice(0, 5);
          setTags(finalTags);
        }
      }
      
      // 실제 저장 API 호출
      // TODO: API 호출 로직 구현
      console.log('저장하기 클릭됨', {
        linkUrl,
        title,
        content,
        tags: finalTags
      });
      
      alert('저장 완료!');
      
      // 저장 완료 후 상세 페이지로 이동
      navigate('/post/1');
      
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
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
             
             {/* Default Image */}
             <div className="w-48 h-32 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center mb-3">
               <div className="text-center">
                 <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                 <p className="text-sm text-gray-500">디폴트 이미지</p>
               </div>
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
                 이미지 업로드
               </label>
               {selectedImage && (
                 <span className="text-sm text-gray-600">
                   {selectedImage.name}
                 </span>
               )}
             </div>
             
             {/* Uploaded Image Preview */}
             {imagePreview && (
               <div className="mt-3">
                 <img
                   src={imagePreview}
                   alt="업로드된 이미지"
                   className="w-48 h-32 object-cover rounded-md border border-gray-300"
                 />
               </div>
             )}
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
               '저장하기'
             )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEditPage;