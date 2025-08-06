
import { useState, useEffect } from 'react';
import { usePopularPosts } from '@/hooks/posts/usePopularPosts';
import { Card, CardContent } from '@/components/domain/Card';
import { Button } from '@/components/foundation/button';
import { Post } from '@/types';
import { PopularPostItem } from '@/components/domain/article/PopularPostItem';
import { useNavigate } from 'react-router-dom';

// 인기 게시글 스켈레톤 컴포넌트
const PopularPostSkeleton = () => (
  <div className="border-b border-gray-100 pb-3 last:border-b-0 animate-pulse">
    <div className="flex items-start gap-3">
      {/* 순위 스켈레톤 */}
      <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full"></div>
      
      {/* 게시글 정보 스켈레톤 */}
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
          <div className="h-3 bg-gray-200 rounded w-6"></div>
        </div>
      </div>
    </div>
  </div>
);



export default function PopularPosts() {
  const navigate = useNavigate();
  
  const {
    popularPosts,
    loading,
    error,
    formatNumber
  } = usePopularPosts();

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
  }, [loading, popularPosts]);

  // 초기 로드 완료 후 이미지 프리로딩 시작
  useEffect(() => {
    if (!loading && popularPosts.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, popularPosts, isInitialLoad]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">인기 게시글</h3>
      
      {/* 숨겨진 이미지 프리로딩 - 초기 로드 완료 후에만 실행 */}
      {!isInitialLoad && (
        <div className="hidden">
          {popularPosts.map((post) => (
            <img
              key={post.postId}
              src={post.thumbnailUrl || ''}
              alt=""
              onLoad={() => handleImageLoad(post.postId)}
              onError={() => handleImageLoad(post.postId)} // 에러 시에도 로드 완료로 처리
            />
          ))}
        </div>
      )}

      {/* 로딩 중일 때 스켈레톤 표시 */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div 
              key={index} 
              className="animate-pulse"
              style={{ 
                animationDelay: `${(index - 1) * 0.1}s`,
                animationDuration: '1.5s'
              }}
            >
              <PopularPostSkeleton />
            </div>
          ))}
        </div>
      ) : error ? (
        // 에러 상태
        <div className="text-center py-8">
          <i className="fas fa-exclamation-triangle text-3xl text-red-300 mb-2"></i>
          <p className="text-sm text-red-500 mb-2">오류가 발생했습니다</p>
          <p className="text-gray-500 text-xs">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      ) : popularPosts.length === 0 ? (
        // 빈 상태
        <div className="text-center py-8">
          <i className="fas fa-chart-line text-3xl text-gray-300 mb-2"></i>
          <p className="text-gray-500 text-sm">인기 게시글이 없습니다.</p>
        </div>
      ) : (
        // 실제 인기 게시글 목록
        <div className="space-y-4">
          {popularPosts.map((post, index) => {
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
                <PopularPostItem
                  post={post}
                  index={index}
                  formatNumber={formatNumber}
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
                <PopularPostSkeleton />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 