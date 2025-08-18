import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ===== CSS 클래스 유틸리티 =====
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ===== 날짜 포맷팅 =====
export const formatDate = dateString => {
  // UTC 시간을 한국 시간으로 변환
  const utcDate = new Date(dateString);
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9 (한국 시간)

  const now = new Date();
  const diffInMs = now.getTime() - kstDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return kstDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Seoul'
    });
  }
};
export const formatNumber = num => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};