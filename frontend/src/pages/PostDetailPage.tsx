// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface PostDetailPageProps {}

interface Comment {
  id: number;
  author: string;
  authorProfile: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

const PostDetailPage: React.FC<PostDetailPageProps> = () => {
  const [isLoggedIn] = useState(true); // Changed to true for testing
  const [currentUser] = useState("김데이터"); // Added current user
  const [isFollowing, setIsFollowing] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentSort, setCommentSort] = useState<'latest' | 'popular'>('latest');
  const [showToast, setShowToast] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const postData = {
    id: 5,
    title: "데이터 사이언스 입문자를 위한 Python 활용법",
    author: "데이터랩",
    authorProfile: "https://readdy.ai/api/search-image?query=data%20science%20company%20logo%20with%20analytics%20symbols%20clean%20modern%20design%20professional%20branding&width=40&height=40&seq=profile5&orientation=squarish",
    authorBadge: "인증",
    tags: ["Python", "데이터사이언스", "머신러닝", "분석", "입문"],
    date: "2024-01-11",
    views: 2340,
    stars: 189,
    comments: 23,
    thumbnail: "https://readdy.ai/api/search-image?query=data%20visualization%20charts%20and%20graphs%20on%20computer%20screen%20with%20Python%20code%20clean%20modern%20workspace%20with%20natural%20lighting&width=800&height=400&seq=thumb5&orientation=landscape",
    content: `# 데이터 사이언스 입문자를 위한 Python 활용법
데이터 사이언스는 현재 가장 주목받는 분야 중 하나입니다. 이 글에서는 Python을 활용한 데이터 사이언스의 기초부터 실전 활용법까지 상세히 알아보겠습니다.
## 1. Python이 데이터 사이언스에 적합한 이유
Python은 다음과 같은 이유로 데이터 사이언스 분야에서 널리 사용됩니다:
- **풍부한 라이브러리**: NumPy, Pandas, Matplotlib, Scikit-learn 등
- **직관적인 문법**: 배우기 쉽고 읽기 쉬운 코드
- **강력한 커뮤니티**: 활발한 개발자 커뮤니티와 풍부한 자료
## 2. 필수 라이브러리 소개
### 2.1 NumPy
수치 계산을 위한 기본 라이브러리입니다.
### 2.2 Pandas
데이터 조작과 분석을 위한 핵심 도구입니다.
### 2.3 Matplotlib & Seaborn
데이터 시각화를 위한 라이브러리들입니다.
## 3. 실전 예제
실제 데이터를 활용한 분석 예제를 통해 Python의 활용법을 익혀보겠습니다.
데이터 사이언스는 단순히 도구를 사용하는 것이 아니라, 데이터에서 인사이트를 찾아내는 과정입니다. Python을 통해 이러한 과정을 효율적으로 수행할 수 있습니다.`,
    isCompanyBlog: true
  };

  const comments: Comment[] = [
    {
      id: 1,
      author: "김데이터",
      authorProfile: "https://readdy.ai/api/search-image?query=professional%20data%20analyst%20portrait%20with%20glasses%20modern%20office%20background%20clean%20corporate%20headshot%20style&width=32&height=32&seq=comment1&orientation=squarish",
      content: "정말 유용한 정보네요! 특히 라이브러리 소개 부분이 도움이 많이 되었습니다. 입문자에게 딱 맞는 내용인 것 같아요.",
      date: "2024-01-11T14:30:00Z",
      likes: 12,
      isLiked: false
    }
  ];

  const bestComment = comments.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLoginRequired = () => {
    showToastMessage('로그인이 필요합니다');
  };

  const handleFollow = () => {
    if (!isLoggedIn) {
      handleLoginRequired();
      return;
    }
    setIsFollowing(!isFollowing);
    showToastMessage(isFollowing ? '팔로우를 취소했습니다' : '팔로우했습니다');
  };

  const handleStar = () => {
    if (!isLoggedIn) {
      handleLoginRequired();
      return;
    }
    setIsStarred(!isStarred);
    showToastMessage(isStarred ? '스타를 취소했습니다' : '스타했습니다');
  };

  const handleBookmark = () => {
    if (!isLoggedIn) {
      handleLoginRequired();
      return;
    }
    setIsBookmarked(!isBookmarked);
    showToastMessage(isBookmarked ? '북마크를 취소했습니다' : '북마크했습니다');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToastMessage('링크가 복사되었습니다');
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) {
      handleLoginRequired();
      return;
    }
    if (!commentText.trim()) {
      showToastMessage('댓글 작성이 필요합니다');
      return;
    }
    showToastMessage('댓글이 등록되었습니다');
    setCommentText('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '오늘';
    if (diffDays === 2) return '어제';
    if (diffDays <= 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6 mt-8">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-4 mt-6">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium text-gray-700 mb-3 mt-4">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="text-gray-600 mb-2 ml-4">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-gray-600 mb-4 leading-relaxed">{line}</p>;
    });
  };

    return (
    <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link
            to="/home"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <i className="fas fa-arrow-left"></i>
            <span>목록으로</span>
          </Link>
        </div>

        {/* 게시글 헤더 */}
        {/* 상단 수정/삭제 버튼 */}
        <div className="flex justify-end gap-2 mb-4">
          <Link to="/posts/editor">
            <Button
              variant="outline"
              className="!rounded-button cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-edit mr-2"></i>
              수정하기
            </Button>
          </Link>
          <Button
            variant="outline"
            className="!rounded-button cursor-pointer whitespace-nowrap text-red-600 hover:bg-red-50"
          >
            <i className="fas fa-trash-alt mr-2"></i>
            삭제하기
          </Button>
        </div>

        {/* 제목 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-4">
          <div className="flex flex-col mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{postData.title}</h1>
            <div className="flex justify-between items-end">
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                className="!rounded-button cursor-pointer whitespace-nowrap text-yellow-500 hover:text-yellow-600"
                onClick={handleStar}
              >
                <i className={`${isStarred ? 'fas' : 'far'} fa-star text-xl`}></i>
              </Button>
            </div>
          </div>
        </div>

        {/* 본문 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          {/* 썸네일 이미지 */}
          <div className="mb-8">
            <img
              src={postData.thumbnail}
              alt={postData.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* 기업 블로그 알림 */}
          {postData.isCompanyBlog && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-blue-700">
                <i className="fas fa-info-circle"></i>
                <span className="text-sm">이 게시글은 요약된 내용입니다</span>
              </div>
            </div>
          )}

          {/* 본문 내용 */}
          <div className="prose max-w-none">
            {renderMarkdown(postData.content)}
          </div>

          {/* 중간 액션 버튼 */}
          <div className="flex justify-center gap-4 my-8 py-6 border-t border-b border-gray-200">
            <Button className="!rounded-button cursor-pointer whitespace-nowrap">
              <i className="fas fa-external-link-alt mr-2"></i>
              원문 가기
            </Button>
            <Button variant="outline" className="!rounded-button cursor-pointer whitespace-nowrap" onClick={handleShare}>
              <i className="fas fa-share mr-2"></i>
              공유하기
            </Button>
            <Button
              variant="ghost"
              className="!rounded-button cursor-pointer whitespace-nowrap text-yellow-500 hover:text-yellow-600"
              onClick={handleStar}
            >
              <i className={`${isStarred ? 'fas' : 'far'} fa-star text-xl`}></i>
            </Button>
          </div>

          {/* 태그 섹션 */}
          <div className="flex flex-wrap gap-2">
            {postData.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* 베스트 댓글 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-crown text-yellow-500 mr-2"></i>
            베스트 댓글
          </h3>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={bestComment.authorProfile} alt={bestComment.author} />
                <AvatarFallback>{bestComment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">{bestComment.author}</span>
                  <Badge className="bg-yellow-400 text-yellow-900 text-xs">베스트</Badge>
                </div>
                <p className="text-gray-700 mb-2">{bestComment.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{formatDate(bestComment.date)}</span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-thumbs-up"></i>
                    {bestComment.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">댓글 {comments.length}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={commentSort === 'latest' ? 'default' : 'outline'}
                size="sm"
                className="!rounded-button cursor-pointer whitespace-nowrap"
                onClick={() => setCommentSort('latest')}
              >
                최신순
              </Button>
              <Button
                variant={commentSort === 'popular' ? 'default' : 'outline'}
                size="sm"
                className="!rounded-button cursor-pointer whitespace-nowrap"
                onClick={() => setCommentSort('popular')}
              >
                인기순
              </Button>
            </div>
          </div>

          {/* 댓글 작성 폼 */}
          <div className="mb-8">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <i className="fas fa-user"></i>
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder={isLoggedIn ? "댓글을 작성해주세요..." : "로그인 후 댓글을 작성할 수 있습니다"}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onClick={() => !isLoggedIn && handleLoginRequired()}
                  className="min-h-[100px] resize-none"
                  maxLength={200}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">{commentText.length}/200</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                      onClick={() => setShowLinkInput(!showLinkInput)}
                    >
                      <i className="fas fa-link mr-2"></i>
                      링크 추가
                    </Button>
                    <Button
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                      onClick={handleCommentSubmit}
                    >
                      등록
                    </Button>
                  </div>
                </div>
                {showLinkInput && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[480px]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">링크 추가</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setShowLinkInput(false);
                            setLinkUrl('');
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="url"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="관련 링크를 입력해주세요"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            className="!rounded-button cursor-pointer whitespace-nowrap"
                            onClick={() => {
                              setShowLinkInput(false);
                              setLinkUrl('');
                            }}
                          >
                            취소
                          </Button>
                          <Button
                            className="!rounded-button cursor-pointer whitespace-nowrap"
                            onClick={() => {
                              if (!linkUrl.trim()) {
                                showToastMessage('링크를 입력해주세요');
                                return;
                              }
                              showToastMessage('링크가 추가되었습니다');
                              setShowLinkInput(false);
                              setLinkUrl('');
                            }}
                          >
                            추가
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.authorProfile} alt={comment.author} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-blue-600 p-0 h-auto cursor-pointer"
                        onClick={() => !isLoggedIn && handleLoginRequired()}
                      >
                        <i className="fas fa-thumbs-up mr-1"></i>
                        추천 {comment.likes}
                      </Button>
                      {isLoggedIn && comment.author === currentUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 p-0 h-auto cursor-pointer"
                          onClick={() => {
                            showToastMessage('댓글이 삭제되었습니다');
                          }}
                        >
                          <i className="fas fa-trash-alt mr-1"></i>
                          삭제
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 토스트 메시지 */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {toastMessage}
          </div>
        )}
    </div>
  );
};

export default PostDetailPage;