import { useState, useEffect } from 'react';

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
  thumbnail?: string;
  isFollowing?: boolean;
}

export const usePostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'latest' | 'following'>('latest');

  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // TODO: 실제 API로 변경 시 - /api/posts?page=${currentPage}&size=10&sort=${activeTab}
        const response = await fetch('/articles.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data: Post[] = await response.json();
        
        // 임시로 페이지네이션 처리 (실제로는 서버에서 처리)
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const pageData = data.slice(startIndex, endIndex);
        
        setPosts(pageData);
        setError(null);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, activeTab]);

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
    posts,
    loading,
    error,
    currentPage,
    setCurrentPage,
    activeTab,
    setActiveTab,
    formatDate,
    formatNumber
  };
}; 