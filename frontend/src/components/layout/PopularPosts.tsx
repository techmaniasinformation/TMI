import React from 'react';
import { usePopularPosts } from '@/hooks/posts/usePopularPosts';
import { Card, CardContent } from '@/components/domain/Card';

export default function PopularPosts() {
  const { popularPosts, loading, error, formatNumber } = usePopularPosts();

  // 로딩 상태
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-fire text-orange-500 mr-2"></i>
            인기 게시글
          </h2>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-fire text-orange-500 mr-2"></i>
            인기 게시글
          </h2>
          <div className="text-center py-8">
            <i className="fas fa-exclamation-triangle text-4xl text-red-300 mb-4"></i>
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <i className="fas fa-fire text-orange-500 mr-2"></i>
          인기 게시글
        </h2>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
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
} 