import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HomePageProps {}

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

const HomePage: React.FC<HomePageProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoggedIn] = useState<boolean>(false);
  const [hasFollows] = useState<boolean>(false);

  const allPosts: Post[] = [
    {
      id: 1,
      title: "React 18의 새로운 기능들과 개발 팁 완벽 가이드",
      author: "테크코리아",
      authorProfile: "https://readdy.ai/api/search-image?query=professional%20tech%20company%20logo%20with%20modern%20design%20clean%20background%20corporate%20style&width=40&height=40&seq=profile1&orientation=squarish",
      authorBadge: "인증",
      tags: ["React", "JavaScript", "프론트엔드", "개발팁", "웹개발"],
      date: "2024-01-15",
      views: 1250,
      stars: 89,
      thumbnail: "https://readdy.ai/api/search-image?query=modern%20web%20development%20workspace%20with%20React%20code%20on%20multiple%20monitors%20clean%20minimalist%20office%20setup%20with%20natural%20lighting%20professional%20developer%20environment&width=800&height=300&seq=thumb1&orientation=landscape"
    }
  ];

  const popularPosts = allPosts
    .sort((a, b) => (b.views * 0.3 + b.stars * 0.7) - (a.views * 0.3 + a.stars * 0.7))
    .slice(0, 10);

  const postsPerPage = 10;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  const getCurrentPosts = (): Post[] => {
    if (activeTab === 'following') {
      if (!isLoggedIn) return [];
      if (!hasFollows) return [];
      return allPosts.filter((post) => post.isFollowing);
    }
    const startIndex = (currentPage - 1) * postsPerPage;
    return allPosts.slice(startIndex, startIndex + postsPerPage);
  };

  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

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
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={post.authorProfile} alt={post.author} />
                                <AvatarFallback>{post.author[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">{post.author}</span>
                                {post.authorBadge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {post.authorBadge}
                                  </Badge>
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
                                <Badge key={index} variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                                  #{tag}
                                </Badge>
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