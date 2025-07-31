import React from 'react';
import { usePopularPosts } from '@/hooks/posts/usePopularPosts';
import { Card, CardContent } from '@/components/domain/Card';
import { Button } from '@/components/foundation/button';

export default function PopularPosts() {
  const {
    popularPosts,
    loading,
    error,
    formatNumber
  } = usePopularPosts();

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">인기 게시글</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">인기 게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">인기 게시글</h3>
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">인기 게시글</h3>
      
      {popularPosts.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-chart-line text-3xl text-gray-300 mb-2"></i>
          <p className="text-gray-500 text-sm">인기 게시글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <div key={post.postId} className="border-b border-gray-100 pb-3 last:border-b-0">
              <div className="flex items-start gap-3">
                {/* 순위 */}
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>
                
                {/* 게시글 정보 */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{post.name}</span>
                    <span>•</span>
                    <span>{formatNumber(post.starCount)}</span>
                    <span>•</span>
                    <span>{formatNumber(post.viewCount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 