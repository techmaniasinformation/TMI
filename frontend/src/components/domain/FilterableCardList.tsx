import React from 'react';
import { usePostsList } from '@/hooks/posts/usePostsList';
import TabBar from './TabBar';
import ArticleList from './article/ArticleList';
import Pagination from './Pagination';
import { Card, CardContent } from '@/components/domain/Card';
import { Button } from '@/components/foundation/button';

// 탭 설정
const HOME_TABS = [
  { id: 'latest', label: '최신순', icon: 'fas fa-clock' },
  { id: 'following', label: '팔로우순', icon: 'fas fa-users' }
];

export default function FilterableCardList() {
  const {
    posts,
    loading,
    error,
    currentPage,
    setCurrentPage,
    activeTab,
    setActiveTab,
    formatDate,
    formatNumber
  } = usePostsList();

  // 로딩 상태
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">게시글을 불러오는 중...</p>
      </div>
    );
  }

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
      {/* 1. TabBar 컴포넌트 */}
      <TabBar
        activeTab={activeTab}
        tabs={HOME_TABS}
        onTabChange={(tab) => setActiveTab(tab as 'latest' | 'following')}
      />

      {/* 2. 로그인 필요 카드 또는 ArticleList */}
      {activeTab === 'following' ? (
        renderLoginRequiredCard()
      ) : (
        <>
          {/* ArticleList 컴포넌트 */}
          <ArticleList
            formatDate={formatDate}
            formatNumber={formatNumber}
            showThumbnail={true}
            maxTags={5}
            className="mb-8"
            posts={posts}
          />

          {/* 3. Pagination 컴포넌트 */}
          <Pagination
            currentPage={currentPage}
            totalPages={2} // TODO: 서버에서 받은 전체 페이지 수
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
} 