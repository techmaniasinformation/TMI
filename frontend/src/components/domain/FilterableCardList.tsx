import React, { useState, useCallback } from 'react';
import TabBar from './TabBar';
import ArticleList from './article/ArticleList';
import Pagination from './Pagination';
import { Card, CardContent } from '@/components/domain/Card';
import { Button } from '@/components/foundation/button';

interface FilterableCardListProps {
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  onArticleClick?: (id: number) => void;
  onTabChange?: (tab: string) => void;
  onPageChange?: (page: number) => void;
  activeTab: string;
  currentPage: number;
  showThumbnail?: boolean;
  maxTags?: number;
  className?: string;
  searchQuery?: string;
  tagFilter?: string[];
  postsPerPage?: number;
  isLoggedIn?: boolean;
  hasFollows?: boolean;
  tabs?: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
}

export default function FilterableCardList({
  formatDate,
  formatNumber,
  onArticleClick,
  onTabChange,
  onPageChange,
  activeTab,
  currentPage,
  showThumbnail = true,
  maxTags = 5,
  className = '',
  searchQuery = '',
  tagFilter = [],
  postsPerPage = 10,
  isLoggedIn = true,
  hasFollows = false,
  tabs = [
    { id: 'latest', label: '최신순', icon: 'fas fa-clock' },
    { id: 'popular', label: '인기순', icon: 'fas fa-fire' },
    { id: 'following', label: '팔로우순', icon: 'fas fa-users' }
  ]
}: FilterableCardListProps) {
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ArticleList에서 페이지네이션 정보를 받아서 상태 업데이트
  const handlePaginationChange = useCallback((newTotalPages: number, newTotalCount: number) => {
    console.log('페이지네이션 정보 업데이트:', { newTotalPages, newTotalCount });
    setTotalPages(newTotalPages);
    setTotalCount(newTotalCount);
  }, []);

  // 로그인 필요 또는 팔로우 없음 상태 렌더링
  const renderLoginRequiredCard = () => {
    if (activeTab === 'following' && (!isLoggedIn || !hasFollows)) {
      return (
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8">
                {!isLoggedIn ? (
                  <>
                    <i className="fas fa-user-lock text-6xl text-gray-400 mb-4"></i>
                    <p className="text-lg text-gray-600 mb-4">로그인이 필요합니다</p>
                    <Button className="!rounded-button cursor-pointer whitespace-nowrap">
                      로그인하기
                    </Button>
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus text-6xl text-gray-400 mb-4"></i>
                    <p className="text-lg text-gray-600 mb-4">팔로우를 해보세요!</p>
                    <Button className="!rounded-button cursor-pointer whitespace-nowrap">
                      추천 사용자 보기
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* 1. TabBar 컴포넌트 - 무조건 표시 */}
      <TabBar
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={onTabChange || (() => {})}
      />

      {/* 2. 로그인 필요 카드 또는 ArticleList */}
      {activeTab === 'following' && (!isLoggedIn || !hasFollows) ? (
        renderLoginRequiredCard()
      ) : (
        <>
          {/* ArticleList 컴포넌트 */}
          <ArticleList
            formatDate={formatDate}
            formatNumber={formatNumber}
            onArticleClick={onArticleClick}
            showThumbnail={showThumbnail}
            maxTags={maxTags}
            filterType={activeTab as 'all' | 'following' | 'latest' | 'popular'}
            searchQuery={searchQuery}
            tagFilter={tagFilter}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            onPaginationChange={handlePaginationChange}
            className="mb-8"
          />

          {/* 3. Pagination 컴포넌트 - 현재 Pagination.tsx 구조에 맞게 연결 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </>
      )}
    </div>
  );
} 