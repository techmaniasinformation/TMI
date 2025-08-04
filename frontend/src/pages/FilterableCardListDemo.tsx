import React, { useState } from 'react';
import FilterableCardList from '@/components/domain/FilterableCardList';

// 샘플 데이터
const sampleArticles = [
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
  },
  {
    id: 2,
    title: "TypeScript로 안전한 웹 개발하기",
    author: "개발자김",
    authorProfile: "https://readdy.ai/api/search-image?query=professional%20developer%20portrait%20with%20glasses%20modern%20office%20background&width=40&height=40&seq=profile2&orientation=squarish",
    tags: ["TypeScript", "웹개발", "타입안전성"],
    date: "2024-01-14",
    views: 890,
    stars: 45
  },
  {
    id: 3,
    title: "Tailwind CSS로 빠른 UI 개발하기",
    author: "디자이너박",
    authorProfile: "https://readdy.ai/api/search-image?query=creative%20designer%20portrait%20with%20colorful%20background%20modern%20artistic%20style&width=40&height=40&seq=profile3&orientation=squarish",
    authorBadge: "전문가",
    tags: ["CSS", "Tailwind", "UI/UX", "디자인"],
    date: "2024-01-13",
    views: 1560,
    stars: 120,
    thumbnail: "https://readdy.ai/api/search-image?query=colorful%20design%20workspace%20with%20digital%20art%20tools%20and%20creative%20elements%20modern%20studio%20setup&width=800&height=300&seq=thumb3&orientation=landscape"
  },
  {
    id: 4,
    title: "Node.js 백엔드 개발 완벽 가이드",
    author: "백엔드마스터",
    authorProfile: "https://readdy.ai/api/search-image?query=server%20room%20with%20network%20equipment%20professional%20backend%20infrastructure&width=40&height=40&seq=profile4&orientation=squarish",
    tags: ["Node.js", "백엔드", "서버", "API"],
    date: "2024-01-12",
    views: 2100,
    stars: 156
  },
  {
    id: 5,
    title: "데이터 사이언스 입문자를 위한 Python 활용법",
    author: "데이터랩",
    authorProfile: "https://readdy.ai/api/search-image?query=data%20science%20company%20logo%20with%20analytics%20symbols%20clean%20modern%20design%20professional%20branding&width=40&height=40&seq=profile5&orientation=squarish",
    authorBadge: "인증",
    tags: ["Python", "데이터사이언스", "머신러닝", "분석", "입문"],
    date: "2024-01-11",
    views: 2340,
    stars: 189,
    thumbnail: "https://readdy.ai/api/search-image?query=data%20visualization%20charts%20and%20graphs%20on%20computer%20screen%20with%20Python%20code%20clean%20modern%20workspace%20with%20natural%20lighting&width=800&height=300&seq=thumb5&orientation=landscape"
  }
];

// 커스텀 탭 설정
const customTabs = [
  { id: 'latest', label: '최신순', icon: 'fas fa-clock' },
  { id: 'popular', label: '인기순', icon: 'fas fa-fire' },
  { id: 'following', label: '팔로우순', icon: 'fas fa-users' },
  { id: 'trending', label: '트렌딩', icon: 'fas fa-chart-line' }
];

export default function FilterableCardListDemo() {
  // 상태 관리
  const [activeTab, setActiveTab] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 숫자 포맷팅 함수
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // 이벤트 핸들러들
  const handleArticleClick = (id: number) => {
    console.log(`게시글 ${id} 클릭됨`);
    // 실제로는 라우터로 이동하거나 모달을 열 수 있음
  };

  const handleTabChange = (tab: string) => {
    console.log(`탭 변경: ${tab}`);
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    console.log(`페이지 변경: ${page}`);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FilterableCardList Components
          </h1>
          <p className="text-gray-600">
            메인 페이지, 검색 페이지, 알림 페이지, 마이 페이지 등에서 사용
          </p>
          <p className="text-sm text-gray-500 mt-2">
            TabBar + ArticleList + Pagination 3개 컴포넌트 조합
          </p>
        </div>

        {/* FilterableCardList 컴포넌트 */}
        <FilterableCardList
          activeTab={activeTab}
          currentPage={currentPage}
          formatDate={formatDate}
          formatNumber={formatNumber}
          onArticleClick={handleArticleClick}
          onTabChange={handleTabChange}
          onPageChange={handlePageChange}
          tabs={customTabs}
          postsPerPage={3}
          showThumbnail={true}
          maxTags={5}
        />
      </div>
    </div>
  );
} 