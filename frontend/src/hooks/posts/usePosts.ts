import { useState } from 'react';

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

export const usePosts = () => {
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

  return {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    isLoggedIn,
    hasFollows,
    popularPosts,
    formatDate,
    formatNumber
  };
}; 