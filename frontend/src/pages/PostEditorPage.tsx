// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 하나의 파일에서 모든 컴포넌트 import
import {
  Button,
  PostsCard as Card,
  PostsCardContent as CardContent,
  PostsInput as Input,
  Textarea,
  PostsBadge as Badge,
  ComponentManager,
  componentKeys
} from '@/components';

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
  const [tags, setTags] = useState(["예시"]);
  const [newTag, setNewTag] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(
    "https://readdy.ai/api/search-image?query=data%20visualization%20charts%20and%20graphs%20on%20computer%20screen%20with%20Python%20code%20clean%20modern%20workspace%20with%20natural%20lighting&width=800&height=400&seq=thumb5&orientation=landscape"
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    } else if (tags.length >= 5) {
      alert("태그는 최대 5개까지만 추가할 수 있습니다.");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

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
          newText = `## ${selectedText || "제목"}`;
          break;
        case "list":
          newText = `- ${selectedText || "목록 항목"}`;
          break;
      }
      const newContent =
        content.substring(0, start) + newText + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + newText.length,
          start + newText.length
        );
      }, 0);
    }
  };

  const renderMarkdownPreview = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1
            key={index}
            className="text-3xl font-bold text-gray-900 mb-6 mt-8"
          >
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-semibold text-gray-800 mb-4 mt-6"
          >
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-xl font-medium text-gray-700 mb-3 mt-4"
          >
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="text-gray-600 mb-2 ml-4">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      let processedLine = line;
      processedLine = processedLine.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );
      processedLine = processedLine.replace(/\*(.*?)\*/g, "<em>$1</em>");
      processedLine = processedLine.replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'
      );
      return (
        <p
          key={index}
          className="text-gray-600 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        ></p>
      );
    });
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
    const isValid = newUrl === "" || validateUrl(newUrl);
    setIsValidUrl(isValid);
    if (isValid && newUrl) {
      setIsLoadingAI(true);
      setTimeout(() => {
        const suggestedTags = ["AI", "Technology", "Web"];
        setTags([new Set([tags, suggestedTags])]);
        setThumbnailImage(
          "https://readdy.ai/api/search-image?query=modern%20technology%20workspace%20with%20computer%20screens%20showing%20data%20analytics%20and%20programming%20code%20in%20a%20clean%20office%20environment&width=800&height=400&seq=thumb8&orientation=landscape"
        );
        setIsLoadingAI(false);
      }, 1500);
    }
  };

  const generateAISummary = () => {
    if (content.length < 50) {
      alert("내용을 최소 50자 이상 입력해주세요.");
      return;
    }
    setIsLoadingAI(true);
    setTimeout(() => {
      setAiSummary(
        "이 글은 데이터 사이언스 분야에서 Python의 활용법을 다루며, 초보자를 위한 필수 라이브러리와 실용적인 예제를 포함하고 있습니다."
      );
      setIsLoadingAI(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!url.trim()) {
      alert("링크 URL을 입력해주세요.");
      return;
    }
    if (!isValidUrl) {
      alert("올바른 URL을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (content.length < 50) {
      alert("내용은 최소 50자 이상 입력해주세요.");
      return;
    }
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    setShowSaveConfirm(false);
    alert("게시글이 저장되었습니다.");
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const navigate = useNavigate();

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    navigate("/home");
  };

  return <div className="max-w-4xl mx-auto" />;
};

export default PostEditorPage;
