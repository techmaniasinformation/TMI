
import { useState, useEffect, useCallback } from 'react';
import { usePopularPosts } from '@/hooks/posts/usePopularPosts';
import { Card, CardContent } from '@/components/domain/Card';
import { Button } from '@/components/foundation/button';
import { Post } from '@/types';
import { PopularPostItem } from '@/components/domain/article/PopularPostItem';
import { useNavigate } from 'react-router-dom';
import { PopularPostSkeleton } from '@/components/foundation/Skeleton';

export default function PopularPosts() {
  const navigate = useNavigate();
  
  const {
    popularPosts,
    loading,
    error,
    formatNumber
  } = usePopularPosts();

  // 게시글 클릭 핸들러를 useCallback으로 메모이제이션
  const handlePostClick = useCallback((postId: number) => {
    navigate(`/post/${postId}`);
  }, [navigate]);

  // 이미지 로딩 상태 관리
  const [loadedPosts, setLoadedPosts] = useState<Set<number>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 이미지 로드 완료 시 호출되는 함수를 useCallback으로 메모이제이션
  const handleImageLoad = useCallback((postId: number) => {
    setLoadedPosts(prev => new Set([...Array.from(prev), postId]));
  }, []);

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
        <div className="text-center py-8">
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle text-4xl text-red-300 mb-4"></i>
            <h4 className="text-lg font-semibold text-red-600 mb-2">인기 게시글을 불러오는 중 오류가 발생했습니다</h4>
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
      ) : popularPosts.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <i className="fas fa-chart-line text-4xl text-gray-300 mb-4"></i>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">인기 게시글이 없습니다</h4>
            <p className="text-gray-500">아직 인기 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!</p>
          </div>
          
          <Button
            onClick={() => navigate('/post/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            <i className="fas fa-plus mr-2"></i>
            게시글 작성
          </Button>
        </div>
      ) : (
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