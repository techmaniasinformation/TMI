
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
import { PostCardSkeleton } from '@/components/foundation/Skeleton';

// 탭 설정
const HOME_TABS = [
  { id: 'latest', label: '최신순', icon: 'fas fa-clock' },
  { id: 'following', label: '팔로우순', icon: 'fas fa-users' }
];

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

  // 로딩 중일 때 스켈레톤 표시
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-red-600 mb-2">게시글을 불러오는 중 오류가 발생했습니다</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
          >
            <i className="fas fa-redo mr-2"></i>
            다시 시도
          </button>
          
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            이전 페이지로
          </button>
        </div>
      </div>
    );
  }

  // 로그인 필요 카드 렌더링
  const renderLoginRequiredCard = () => {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <i className="fas fa-users text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">팔로우한 사용자의 게시글</h3>
              <p className="text-gray-500 mb-4">
                팔로우한 사용자들의 최신 게시글을 확인하려면 로그인이 필요합니다
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mr-3"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                로그인
              </Button>
              
              <Button 
                onClick={() => setActiveTab('latest')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg"
              >
                <i className="fas fa-clock mr-2"></i>
                최신순으로 보기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* 탭 바 */}
      <HomeTabBar 
        tabs={HOME_TABS}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'latest' | 'following')}
      />

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

      {/* 팔로우 탭이고 로그인이 필요한 경우 */}
      {activeTab === 'following' && !posts.length && (
        renderLoginRequiredCard()
      )}

      {/* 게시글 목록 */}
      {posts.length > 0 && (
        <PostList
          posts={posts}
          formatDate={formatDate}
          formatNumber={formatNumber}
          onPostClick={handlePostClick}
          showThumbnail={true}
          maxTags={5}
          className="mb-8"
        />
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <ServerPagination
          currentPage={currentPage}
          totalCount={totalElements}
          pageSize={10}
          onPageChange={setCurrentPage}
        />
      )}

      {/* 더보기 버튼 (마지막 페이지가 아닌 경우) - 기능 제거 */}
    </div>
  );
} 