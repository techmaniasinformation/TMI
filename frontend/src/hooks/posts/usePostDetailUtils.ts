import { useMemo } from 'react';

export function usePostDetailUtils() {
  // 날짜 포맷팅 함수
  const formatDate = useMemo(() => {
    return (dateString: string) => {
      const utcDate = new Date(dateString);
      const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
      
      const diffInMs = Date.now() - kstDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return '방금 전';
      if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
      if (diffInHours < 24) return `${diffInHours}시간 전`;
      if (diffInDays < 7) return `${diffInDays}일 전`;
      
      return kstDate.toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul'
      });
    };
  }, []);

  // 숫자 포맷팅 함수
  const formatNumber = useMemo(() => {
    return (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };
  }, []);

  // 마크다운 렌더링 함수
  const renderMarkdown = useMemo(() => {
    return (content: string) => content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/&lt;(strong|em|code|br)&gt;/g, '<$1>')
      .replace(/&lt;\/(strong|em|code)&gt;/g, '</$1>');
  }, []);

  return {
    formatDate,
    formatNumber,
    renderMarkdown,
  };
}
