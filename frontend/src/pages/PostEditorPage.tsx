// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/foundation/button";
import { Card, CardContent } from "@/components/domain/Card";
import { Input } from "@/components/domain/Input";
import { Textarea } from "@/components/domain/Textarea";
import { Badge } from "@/components/domain/Badge";
import { Tooltip } from "@/components/domain/Tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/domain/Tooltip";

interface PostEditorPageProps {}

const PostEditorPage: React.FC<PostEditorPageProps> = () => {
  const [title, setTitle] = useState("Python 데이터 분석");
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [content, setContent] = useState(`# 게시글 제목

간단한 게시글 내용을 작성하세요.

## 주요 내용

- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

이것은 예시 게시글입니다.`);
  
  // 태그 관리 로직
  const [tags, setTags] = useState<string[]>(["예시"]);
  const [newTag, setNewTag] = useState("");
  const canAddMore = tags.length < 5;

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && canAddMore) {
      setTags(prev => [...prev, trimmedTag]);
      setNewTag("");
      return true;
    }
    return false;
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleAddTag = () => {
    const success = addTag(newTag);
    if (!success && !canAddMore) {
      alert("태그는 최대 5개까지만 추가할 수 있습니다.");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    removeTag(tagToRemove);
  };

  const [thumbnailImage, setThumbnailImage] = useState(
    "https://readdy.ai/api/search-image?query=data%20visualization%20charts%20and%20graphs%20on%20computer%20screen%20with%20Python%20code%20clean%20modern%20workspace%20with%20natural%20lighting&width=800&height=400&seq=thumb5&orientation=landscape"
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setThumbnailImage("");
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById(
      "content-editor"
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      let newText = "";
      switch (syntax) {
        case "bold":
          newText = `**${selectedText || "굵은 텍스트"}**`;
          break;
        case "italic":
          newText = `*${selectedText || "기울임 텍스트"}*`;
          break;
        case "link":
          newText = `[${selectedText || "링크 텍스트"}](URL)`;
          break;
        case "code":
          newText = `\`${selectedText || "코드"}\``;
          break;
        case "heading":
          newText = `# ${selectedText || "제목"}`;
          break;
        case "list":
          newText = `- ${selectedText || "목록 항목"}`;
          break;
        case "quote":
          newText = `> ${selectedText || "인용문"}`;
          break;
        default:
          newText = selectedText;
      }
      const newContent =
        content.substring(0, start) + newText + content.substring(end);
      setContent(newContent);
    }
  };

  const renderMarkdownPreview = (text: string) => {
    // 간단한 마크다운 렌더링 (실제로는 마크다운 라이브러리 사용 권장)
    return text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br>');
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (newUrl) {
      setIsValidUrl(validateUrl(newUrl));
    } else {
      setIsValidUrl(true);
    }
  };

  const generateAISummary = () => {
    setIsLoadingAI(true);
    // AI 요약 로직 시뮬레이션
    setTimeout(() => {
      setAiSummary("이 게시글은 Python을 사용한 데이터 분석에 대한 내용입니다. 주요 기술과 방법론을 다루고 있으며, 실무에서 활용할 수 있는 팁들을 포함하고 있습니다.");
      setIsLoadingAI(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    console.log("게시글 저장:", { title, content, tags, url, thumbnailImage });
    setShowSaveConfirm(false);
    // 실제 저장 로직 구현
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    // 실제 취소 로직 구현
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">게시글 작성</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="!rounded-button cursor-pointer whitespace-nowrap"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            className="!rounded-button cursor-pointer whitespace-nowrap"
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* 제목 입력 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">제목</h2>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시글 제목을 입력하세요"
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* URL 입력 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">URL (선택사항)</h2>
              <Input
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                className={!isValidUrl && url ? "border-red-500" : ""}
              />
              {!isValidUrl && url && (
                <p className="text-red-500 text-sm mt-2">올바른 URL 형식을 입력해주세요.</p>
              )}
            </CardContent>
          </Card>

          {/* 태그 입력 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">태그</h2>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="태그를 입력하세요"
                  disabled={!canAddMore}
                />
                <Button
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || !canAddMore}
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm cursor-pointer hover:bg-red-100"
                    onClick={() => handleRemoveTag(tag)}
                    imgSrc=""
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
              {!canAddMore && (
                <p className="text-gray-500 text-sm mt-2">태그는 최대 5개까지만 추가할 수 있습니다.</p>
              )}
            </CardContent>
          </Card>

          {/* 썸네일 이미지 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">썸네일 이미지</h2>
              {thumbnailImage ? (
                <div className="relative">
                  <img
                    src={thumbnailImage}
                    alt="썸네일"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="!rounded-button cursor-pointer whitespace-nowrap bg-white"
                    >
                      변경
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleImageDelete}
                      className="!rounded-button cursor-pointer whitespace-nowrap bg-white"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">썸네일 이미지를 추가하세요</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                  >
                    이미지 업로드
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* 내용 입력 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">내용</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isPreviewMode ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsPreviewMode(false)}
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                  >
                    편집
                  </Button>
                  <Button
                    variant={isPreviewMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPreviewMode(true)}
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                  >
                    미리보기
                  </Button>
                </div>
              </div>

              {!isPreviewMode ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["bold", "italic", "link", "code", "heading", "list", "quote"].map((syntax) => (
                      <TooltipProvider key={syntax}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => insertMarkdown(syntax)}
                              className="!rounded-button cursor-pointer whitespace-nowrap"
                            >
                              {syntax === "bold" && "B"}
                              {syntax === "italic" && "I"}
                              {syntax === "link" && "🔗"}
                              {syntax === "code" && "{}"}
                              {syntax === "heading" && "H"}
                              {syntax === "list" && "•"}
                              {syntax === "quote" && "❝"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{syntax} 삽입</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <Textarea
                    id="content-editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="게시글 내용을 작성하세요..."
                    className="min-h-[400px] font-mono"
                  />
                </div>
              ) : (
                <div
                  className="min-h-[400px] p-4 border rounded-lg bg-gray-50 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* AI 요약 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">AI 요약</h2>
                <Button
                  onClick={generateAISummary}
                  disabled={isLoadingAI}
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                >
                  {isLoadingAI ? "생성 중..." : "요약 생성"}
                </Button>
              </div>
              {aiSummary ? (
                <p className="text-gray-700 text-sm leading-relaxed">{aiSummary}</p>
              ) : (
                <p className="text-gray-500 text-sm">AI 요약을 생성해보세요.</p>
              )}
            </CardContent>
          </Card>

          {/* 저장 확인 모달 */}
          {showSaveConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-96">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">게시글 저장</h3>
                  <p className="text-gray-700 mb-6">게시글을 저장하시겠습니까?</p>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowSaveConfirm(false)}
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={confirmSave}
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                    >
                      저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 취소 확인 모달 */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-96">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">작성 취소</h3>
                  <p className="text-gray-700 mb-6">작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?</p>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelConfirm(false)}
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                    >
                      계속 작성
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmCancel}
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                    >
                      취소
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostEditorPage;
