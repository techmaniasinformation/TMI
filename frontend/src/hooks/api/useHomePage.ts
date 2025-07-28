import { useState, useMemo } from 'react';

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

interface UseHomePageReturn {
  // 상태
  activeTab: TabType;
  currentPage: number;
  isLoggedIn: boolean;
  hasFollows: boolean;
  
  // 데이터
  allPosts: Post[];
  popularPosts: Post[];
  currentPosts: Post[];
  totalPages: number;
  pageNumbers: number[];
  
  // 액션
  setActiveTab: (tab: TabType) => void;
  setCurrentPage: (page: number) => void;
  handleTabChange: (tab: TabType) => void;
  handlePageChange: (page: number) => void;
  handleTagClick: (tag: string) => void;
  handleCardClick: (postId: number) => void;
  
  // 유틸리티
  formatDate: (dateString: string) => string;
  formatNumber: (num: number) => string;
  
  // 조건부 렌더링
  shouldShowFollowingContent: boolean;
  shouldShowLoginPrompt: boolean;
  shouldShowFollowPrompt: boolean;
}

export const useHomePage = (): UseHomePageReturn => {
  // 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoggedIn] = useState<boolean>(false);
  const [hasFollows] = useState<boolean>(false);

  // 데이터
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

  // 계산된 값들
  const popularPosts = useMemo(() => 
    allPosts
      .sort((a, b) => (b.views * 0.3 + b.stars * 0.7) - (a.views * 0.3 + a.stars * 0.7))
      .slice(0, 10),
    [allPosts]
  );

  const postsPerPage = 10;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  const currentPosts = useMemo(() => {
    if (activeTab === 'following') {
      if (!isLoggedIn) return [];
      if (!hasFollows) return [];
      return allPosts.filter((post) => post.isFollowing);
    }
    const startIndex = (currentPage - 1) * postsPerPage;
    return allPosts.slice(startIndex, startIndex + postsPerPage);
  }, [activeTab, currentPage, isLoggedIn, hasFollows, allPosts]);

  const pageNumbers = useMemo(() => {
    const numbers: number[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [currentPage, totalPages]);

  // 액션 핸들러들
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTagClick = (tag: string) => {
    console.log(`Tag clicked: ${tag}`);
    // TODO: 검색 페이지로 이동
    // navigate(`/search?tag=${tag}`);
  };

  const handleCardClick = (postId: number) => {
    console.log(`Card clicked: ${postId}`);
    // TODO: 게시글 상세 페이지로 이동
    // navigate(`/posts/${postId}`);
  };

  // 유틸리티 함수들
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

  // 조건부 렌더링 플래그들
  const shouldShowFollowingContent = activeTab === 'following' && (!isLoggedIn || !hasFollows);
  const shouldShowLoginPrompt = activeTab === 'following' && !isLoggedIn;
  const shouldShowFollowPrompt = activeTab === 'following' && isLoggedIn && !hasFollows;

  return {
    // 상태
    activeTab,
    currentPage,
    isLoggedIn,
    hasFollows,
    
    // 데이터
    allPosts,
    popularPosts,
    currentPosts,
    totalPages,
    pageNumbers,
    
    // 액션
    setActiveTab,
    setCurrentPage,
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
  };
}; 