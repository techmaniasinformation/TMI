// 인기 게시글 유틸리티 훅
export const usePopularPostsUtils = () => {
  // 숫자 포맷팅 함수
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return {
    formatNumber
  };
};
