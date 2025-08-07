
import { useState, useEffect } from 'react';
import { usePostsList } from '@/hooks/posts/usePostsList';
import HomeTabBar from './HomeTabBar';
import PostList from './article/PostList';
import ServerPagination from './ServerPagination';
import { Card, CardContent } from '@/components/domain/Card';
import { Button } from '@/components/foundation/button';
import { Post } from '@/types';
import { PostItem } from '@/components/domain/article/PostItem';
import { useNavigate } from 'react-router-dom';
import { getSafeThumbnailUrl } from '@/utils/defaultImages';

// 탭 설정
const HOME_TABS = [
  { id: 'latest', label: '최신순', icon: 'fas fa-clock' },
  { id: 'following', label: '팔로우순', icon: 'fas fa-users' }
];

// 스켈레톤 카드 컴포넌트
const SkeletonCard = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 animate-pulse">
    <div className="flex items-start gap-4">
      {/* 프로필 이미지 스켈레톤 */}
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
      
      {/* 컨텐츠 영역 */}
      <div className="flex-1 min-w-0">
        {/* 제목 스켈레톤 */}
        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
        
        {/* 작성자 정보 스켈레톤 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* 태그 스켈레톤 */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>
        
        {/* 통계 정보 스켈레톤 */}
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-10"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
      
      {/* 썸네일 스켈레톤 */}
      <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
    </div>
  </div>
);



export default function HomePostList() {
  const navigate = useNavigate();
  
  const {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    isLast,
    activeTab,
    setActiveTab,
    setCurrentPage,
    formatDate,
    formatNumber
  } = usePostsList();

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  // 이미지 로딩 상태 관리
  const [loadedPosts, setLoadedPosts] = useState<Set<number>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 이미지 로드 완료 시 호출되는 함수
  const handleImageLoad = (postId: number) => {
    setLoadedPosts(prev => new Set([...Array.from(prev), postId]));
  };

  // 로딩 상태나 게시글이 변경될 때 로딩 상태 초기화
  useEffect(() => {
    setLoadedPosts(new Set());
    setIsInitialLoad(true);
  }, [loading, posts]);

  // 초기 로드 완료 후 이미지 프리로딩 시작
  useEffect(() => {
    if (!loading && posts.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, posts, isInitialLoad]);

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
        <p className="text-lg text-red-500 mb-2">오류가 발생했습니다</p>
        <p className="text-gray-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 로그인 필요 또는 팔로우 없음 상태 렌더링
  const renderLoginRequiredCard = () => {
    if (activeTab === 'following') {
      return (
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8">
                <i className="fas fa-user-lock text-6xl text-gray-400 mb-4"></i>
                <p className="text-lg text-gray-600 mb-4">로그인이 필요합니다</p>
                <Button className="!rounded-button cursor-pointer whitespace-nowrap">
                  로그인하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 1. HomeTabBar 컴포넌트 */}
      <HomeTabBar
        activeTab={activeTab}
        tabs={HOME_TABS}
        onTabChange={(tab) => setActiveTab(tab as 'latest' | 'following')}
      />

      {/* 2. 로그인 필요 카드 또는 PostList */}
      {activeTab === 'following' ? (
        renderLoginRequiredCard()
      ) : (
        <>
          {/* 숨겨진 이미지 프리로딩 - 초기 로드 완료 후에만 실행 */}
          {!isInitialLoad && (
            <div className="hidden">
              {posts.map((post) => (
                                 <img
                   key={post.postId}
                   src={getSafeThumbnailUrl(post.thumbnailUrl)}
                   alt=""
                   onLoad={() => handleImageLoad(post.postId)}
                   onError={() => handleImageLoad(post.postId)} // 에러 시에도 로드 완료로 처리
                 />
              ))}
            </div>
          )}

          {/* 게시글 목록 */}
          <div className="mb-8">
            {/* API 로딩 중일 때는 스켈레톤 표시 */}
            {loading ? (
              // 스켈레톤 카드들을 순차적으로 표시
              [1, 2, 3, 4, 5].map((index) => (
                <div 
                  key={index} 
                  className="animate-pulse"
                  style={{ 
                    animationDelay: `${(index - 1) * 0.1}s`,
                    animationDuration: '1.5s'
                  }}
                >
                  <SkeletonCard />
                </div>
              ))
            ) : (
              // API 로딩 완료 후 게시글 표시
              posts.map((post, index) => {
                const isLoaded = loadedPosts.has(post.postId);
                const hasThumbnail = post.thumbnailUrl;
                
                // 썸네일이 없거나 이미 로드된 경우 바로 표시
                const shouldShow = !hasThumbnail || isLoaded;
                
                return shouldShow ? (
                  <div
                    key={post.postId}
                    className="animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationDuration: '0.5s'
                    }}
                  >
                    <PostItem
                      post={post}
                      formatDate={formatDate}
                      formatNumber={formatNumber}
                      maxTags={5}
                      onClick={handlePostClick}
                    />
                  </div>
                ) : (
                  <div
                    key={post.postId}
                    className="animate-pulse"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationDuration: '1.5s'
                    }}
                  >
                    <SkeletonCard />
                  </div>
                );
              })
            )}
          </div>

          {/* 3. ServerPagination 컴포넌트 */}
          {!loading && (
            <ServerPagination
              currentPage={currentPage}
              totalCount={totalElements}
              pageSize={10}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
} 