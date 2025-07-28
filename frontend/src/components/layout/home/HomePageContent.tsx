import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Tag,
  Card,
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components';

interface Post {
  id: number;
  title: string;
  author: string;
  authorProfile: string;
  authorBadge?: string;
  tags: string[];
  date: string;
  views: number;
  stars: number;
  thumbnail: string;
  isFollowing?: boolean;
}

type TabType = 'latest' | 'following';

interface HomePageContentProps {
  // 상태
  activeTab: TabType;
  currentPage: number;
  isLoggedIn: boolean;
  hasFollows: boolean;
  
  // 데이터
  currentPosts: Post[];
  popularPosts: Post[];
  totalPages: number;
  pageNumbers: number[];
  
  // 액션
  onTabChange: (tab: TabType) => void;
  onPageChange: (page: number) => void;
  onTagClick: (tag: string) => void;
  onCardClick: (postId: number) => void;
  
  // 유틸리티
  formatDate: (dateString: string) => string;
  formatNumber: (num: number) => string;
  
  // 조건부 렌더링
  shouldShowFollowingContent: boolean;
  shouldShowLoginPrompt: boolean;
  shouldShowFollowPrompt: boolean;
}

const HomePageContent: React.FC<HomePageContentProps> = ({
  activeTab,
  currentPage,
  isLoggedIn,
  hasFollows,
  currentPosts,
  popularPosts,
  totalPages,
  pageNumbers,
  onTabChange,
  onPageChange,
  onTagClick,
  onCardClick,
  formatDate,
  formatNumber,
  shouldShowFollowingContent,
  shouldShowLoginPrompt,
  shouldShowFollowPrompt,
}) => {
  const renderFollowingContent = () => {
    if (shouldShowLoginPrompt) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <i className="fas fa-user-lock text-6xl text-gray-400 mb-4"></i>
          <p className="text-lg text-gray-600">로그인이 필요합니다</p>
          <Button className="mt-4 !rounded-button cursor-pointer whitespace-nowrap">
            로그인하기
          </Button>
        </div>
      );
    }
    if (shouldShowFollowPrompt) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <i className="fas fa-user-plus text-6xl text-gray-400 mb-4"></i>
          <p className="text-lg text-gray-600">팔로우를 해보세요!</p>
          <Button className="mt-4 !rounded-button cursor-pointer whitespace-nowrap">
            추천 사용자 보기
          </Button>
        </div>
      );
    }
    return null;
  };

  const renderPostCard = (post: Post) => (
    <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.authorProfile} alt={post.author} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{post.author}</span>
                {post.authorBadge && (
                  <Tag tag={post.authorBadge} variant="default" className="text-xs">
                    {post.authorBadge}
                  </Tag>
                )}
              </div>
            </div>
            <Link to={`/posts/${post.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
            </Link>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <i className="fas fa-eye"></i>
                  {formatNumber(post.views)}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-star text-yellow-400"></i>
                  {formatNumber(post.stars)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 5).map((tag, index) => (
                <Tag 
                  key={index} 
                  tag={tag} 
                  variant="default" 
                  className="text-xs"
                  onClick={() => onTagClick(tag)}
                />
              ))}
            </div>
          </div>
          <div className="w-48 h-32 flex-shrink-0">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover rounded-r-lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPagination = () => (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        className="!rounded-button cursor-pointer whitespace-nowrap"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left mr-2"></i>
        이전
      </Button>
      {pageNumbers.map((pageNum) => (
        <Button
          key={pageNum}
          variant={currentPage === pageNum ? 'default' : 'outline'}
          className="!rounded-button cursor-pointer whitespace-nowrap w-10 h-10"
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}
      <Button
        variant="outline"
        className="!rounded-button cursor-pointer whitespace-nowrap"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        다음
        <i className="fas fa-chevron-right ml-2"></i>
      </Button>
    </div>
  );

  const renderPopularPosts = () => (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <i className="fas fa-fire text-orange-500 mr-2"></i>
          인기 게시글
        </h2>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {post.author}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-eye"></i>
                      {formatNumber(post.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-star text-yellow-400"></i>
                      {formatNumber(post.stars)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="flex gap-8">
        <div className="flex-1 max-w-[70%]">
          {/* 탭 버튼 */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center p-1.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl w-[600px]">
              <Button
                variant="ghost"
                className={`flex-1 py-4 text-lg !rounded-button cursor-pointer whitespace-nowrap transition-all duration-300 ${
                  activeTab === 'latest'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-lg shadow-indigo-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => onTabChange('latest')}
              >
                <i className="fas fa-clock mr-2"></i>
                최신 게시글
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 py-4 text-lg !rounded-button cursor-pointer whitespace-nowrap transition-all duration-300 ${
                  activeTab === 'following'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-lg shadow-indigo-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => onTabChange('following')}
              >
                <i className="fas fa-users mr-2"></i>
                팔로우 게시글
              </Button>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          {shouldShowFollowingContent ? (
            renderFollowingContent()
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {currentPosts.map(renderPostCard)}
              </div>

              {activeTab === 'latest' && renderPagination()}
            </>
          )}
        </div>

        {/* 사이드바 */}
        <div className="w-[30%]">
          {renderPopularPosts()}
        </div>
      </div>
    </div>
  );
};

export default HomePageContent; 