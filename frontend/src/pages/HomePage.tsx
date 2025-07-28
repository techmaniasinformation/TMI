import React from 'react';
import { useHomePage } from '@/hooks/api/useHomePage';
import { HomePageContent } from '@/components/layout/home';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const {
    // 상태
    activeTab,
    currentPage,
    isLoggedIn,
    hasFollows,
    
    // 데이터
    currentPosts,
    popularPosts,
    totalPages,
    pageNumbers,
    
    // 액션
    handleTabChange,
    handlePageChange,
    handleTagClick,
    handleCardClick,
    
    // 유틸리티
    formatDate,
    formatNumber,
    
    // 조건부 렌더링
    shouldShowFollowingContent,
    shouldShowLoginPrompt,
    shouldShowFollowPrompt,
  } = useHomePage();

  return (
    <HomePageContent
      // 상태
      activeTab={activeTab}
      currentPage={currentPage}
      isLoggedIn={isLoggedIn}
      hasFollows={hasFollows}
      
      // 데이터
      currentPosts={currentPosts}
      popularPosts={popularPosts}
      totalPages={totalPages}
      pageNumbers={pageNumbers}
      
      // 액션
      onTabChange={handleTabChange}
      onPageChange={handlePageChange}
      onTagClick={handleTagClick}
      onCardClick={handleCardClick}
      
      // 유틸리티
      formatDate={formatDate}
      formatNumber={formatNumber}
      
      // 조건부 렌더링
      shouldShowFollowingContent={shouldShowFollowingContent}
      shouldShowLoginPrompt={shouldShowLoginPrompt}
      shouldShowFollowPrompt={shouldShowFollowPrompt}
    />
  );
};

export default HomePage;