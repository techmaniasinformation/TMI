import React from 'react';

// 숫자를 k, M 단위로 축약해서 보여주는 함수
function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}

// 컴포넌트에 전달되는 props 정의
interface UserStatsCardProps {
  posts: number;        // 작성한 게시글 수
  comments?: number;    // 작성한 댓글 수 (개인 유저만 표시)
  followers: number;    // 팔로워 수
  views: number;        // 누적 조회 수
  isCompany?: boolean;  // 기업 여부 (기본값: false)
}

// 사용자 통계 카드 컴포넌트
export default function UserStatsCard({
  posts,
  comments,
  followers,
  views,
  isCompany = false, // 기본값 false 설정
}: UserStatsCardProps) {
  return (
    <div className="flex space-x-8 text-center">
      {/* 게시글 수 */}
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(posts)}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">게시글 수</div>
      </div>

      {/* 개인 유저일 경우에만 댓글 수 표시 */}
      {!isCompany && (
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(comments || 0)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">댓글 수</div>
        </div>
      )}

      {/* 팔로워 수 */}
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(followers)}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">팔로워 수</div>
      </div>

      {/* 누적 조회 수 */}
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(views)}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">누적 조회 수</div>
      </div>
    </div>
  );
}
