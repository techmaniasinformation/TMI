import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/domain/Card';
import ArticleInfo from './ArticleInfo';

interface Article {
  id: number;
  title: string;
  author: string;
  authorProfile: string;
  authorBadge?: string;
  tags: string[];
  date: string;
  views: number;
  stars: number;
  thumbnail?: string;
  isFollowing?: boolean;
}

interface ArticleListProps {
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  onArticleClick?: (id: number) => void;
  className?: string;
  showThumbnail?: boolean;
  maxTags?: number;
  filterType?: 'all' | 'following' | 'latest' | 'popular';
  searchQuery?: string;
  tagFilter?: string[];
  currentPage?: number;
  postsPerPage?: number;
  onPaginationChange?: (totalPages: number, totalCount: number) => void;
}

export default function ArticleList({
  formatDate,
  formatNumber,
  onArticleClick,
  className = '',
  showThumbnail = true,
  maxTags = 5,
  filterType = 'all',
  searchQuery = '',
  tagFilter = [],
  currentPage = 1,
  postsPerPage = 10,
  onPaginationChange
}: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // JSON 파일에서 데이터 로드
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/articles.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data: Article[] = await response.json();
        setArticles(data);
        setError(null);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // 필터링된 게시글들 계산
  useEffect(() => {
    console.log('ArticleList 필터링 실행:', { filterType, searchQuery, tagFilter, articlesCount: articles.length });
    
    let filtered = [...articles];

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 태그 필터링
    if (tagFilter.length > 0) {
      filtered = filtered.filter(article =>
        tagFilter.some(filterTag => article.tags.includes(filterTag))
      );
    }

    // 타입별 필터링
    switch (filterType) {
      case 'following':
        filtered = filtered.filter(article => article.isFollowing);
        console.log('팔로우 필터링 결과:', filtered.length, '개');
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => (b.views * 0.3 + b.stars * 0.7) - (a.views * 0.3 + a.stars * 0.7));
        console.log('인기순 정렬 완료');
        break;
      case 'latest':
        filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log('최신순 정렬 완료');
        break;
      default:
        console.log('전체 게시글 표시');
        break;
    }

    console.log('최종 필터링 결과:', filtered.length, '개');
    setFilteredArticles(filtered);

    // 페이지네이션 정보를 상위로 전달
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    onPaginationChange?.(totalPages, filtered.length);
  }, [articles, filterType, searchQuery, tagFilter, postsPerPage, onPaginationChange]);

  // 현재 페이지의 게시글들 계산
  useEffect(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentArticles = filteredArticles.slice(startIndex, endIndex);
    setDisplayedArticles(currentArticles);
  }, [filteredArticles, currentPage, postsPerPage]);

  // 로딩 상태
  if (loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">게시글을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
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

  // 빈 결과 상태
  if (filteredArticles.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <p className="text-lg text-gray-500">
          {searchQuery || tagFilter.length > 0 
            ? '검색 결과가 없습니다' 
            : filterType === 'following'
            ? '팔로우한 게시글이 없습니다'
            : '게시글이 없습니다'
          }
        </p>
        {(searchQuery || tagFilter.length > 0) && (
          <p className="text-sm text-gray-400 mt-2">
            다른 검색어나 필터를 시도해보세요
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {displayedArticles.map((article) => (
        <Card 
          key={article.id} 
          className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => onArticleClick?.(article.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <ArticleInfo
                id={article.id}
                title={article.title}
                author={article.author}
                authorProfile={article.authorProfile}
                authorBadge={article.authorBadge}
                tags={article.tags}
                date={article.date}
                views={article.views}
                stars={article.stars}
                formatDate={formatDate}
                formatNumber={formatNumber}
                maxTags={maxTags}
              />
              {showThumbnail && article.thumbnail && (
                <div className="w-48 h-32 flex-shrink-0">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-r-lg"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 