import React from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/posts/usePosts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/domain/Avatar';
import { Badge } from '@/components/domain/Badge';
import { Button } from '@/components/foundation/button';
import { Card, CardContent } from '@/components/domain/Card';
import { Tag } from '@/components/domain/Tag';
import { ArticleInfo } from '@/components/domain/ArticleInfo';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    isLoggedIn,
    hasFollows,
    allPosts,
    popularPosts,
    postsPerPage,
    totalPages,
    getCurrentPosts,
    getPageNumbers,
    formatDate,
    formatNumber
  } = usePosts();

  const renderFollowingContent = () => {
    if (!isLoggedIn) {
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
    if (!hasFollows) {
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

    return (
    <div>
        {/* Tag 데모 섹션 */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🏷️ Tag 컴포넌트 데모</h2>
          
          {/* 기본 태그들 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">기본 태그들:</h3>
            <div className="flex flex-wrap gap-2">
              <Tag tag="일반태그" />
              <Tag tag="네이버" variant="company" />
              <Tag tag="React" variant="tech" />
              <Tag tag="검색어" variant="search" />
            </div>
          </div>

          {/* 제거 가능한 태그들 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">제거 가능한 태그들:</h3>
            <div className="flex flex-wrap gap-2">
              <Tag tag="제거가능" removable={true} onRemove={() => console.log('제거됨')} />
              <Tag tag="네이버" variant="company" removable={true} onRemove={() => console.log('네이버 제거됨')} />
              <Tag tag="React" variant="tech" removable={true} onRemove={() => console.log('React 제거됨')} />
              <Tag tag="검색어" variant="search" removable={true} onRemove={() => console.log('검색어 제거됨')} />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 max-w-[70%]">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center p-1.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl w-[600px]">
                <Button
                  variant="ghost"
                  className={`flex-1 py-4 text-lg !rounded-button cursor-pointer whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'latest'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-lg shadow-indigo-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveTab('latest');
                    setCurrentPage(1);
                  }}
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
                  onClick={() => {
                    setActiveTab('following');
                    setCurrentPage(1);
                  }}
                >
                  <i className="fas fa-users mr-2"></i>
                  팔로우 게시글
                </Button>
              </div>
            </div>

            {activeTab === 'following' && (!isLoggedIn || !hasFollows) ? (
              renderFollowingContent()
            ) : (
              <>
                <div className="space-y-6 mb-8">
                  {getCurrentPosts().map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <ArticleInfo
                            id={post.id}
                            title={post.title}
                            author={post.author}
                            authorProfile={post.authorProfile}
                            authorBadge={post.authorBadge}
                            tags={post.tags}
                            date={post.date}
                            views={post.views}
                            stars={post.stars}
                            formatDate={formatDate}
                            formatNumber={formatNumber}
                            maxTags={5}
                          />
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
                  ))}
                </div>

                {activeTab === 'latest' && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left mr-2"></i>
                      이전
                    </Button>
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        className="!rounded-button cursor-pointer whitespace-nowrap w-10 h-10"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      다음
                      <i className="fas fa-chevron-right ml-2"></i>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="w-[30%]">
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;