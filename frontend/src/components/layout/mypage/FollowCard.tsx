import React from 'react';
import { handleCompanyImageError, handleProfileImageError } from '@/utils/defaultImages';

// ===== 통합 FollowCard 컴포넌트 =====
interface FollowCardProps {
  type: 'user' | 'company';
  // 공통 props
  id: string | number;
  name: string;
  image: string | null;
  onClick?: () => void;
  className?: string;
  // 사용자 전용 props
  badgeName?: string;
  // 레이아웃 옵션
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export function FollowCard({
  type,
  id,
  name,
  image,
  onClick,
  className = '',
  badgeName,
  size = 'md',
  showBadge = true,
}: FollowCardProps) {
  const sizeClasses = {
    sm: {
      container: 'p-2 space-x-2',
      image: 'w-12 h-12',
      text: 'text-sm',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      container: 'p-4 space-x-4',
      image: 'w-16 h-16',
      text: 'text-base',
      badge: 'text-xs px-2 py-0.5',
    },
    lg: {
      container: 'p-6 space-x-6',
      image: 'w-20 h-20',
      text: 'text-lg',
      badge: 'text-sm px-2.5 py-1',
    },
  };

  const classes = sizeClasses[size];
  const imageShape = type === 'user' ? 'rounded-full' : 'rounded-lg';
  const errorHandler = type === 'user' ? handleProfileImageError : handleCompanyImageError;

  return (
    <div
      key={id}
      className={`flex items-center ${classes.container} border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 ${className}`}
      onClick={onClick}
    >
      <img
        src={image || ''}
        alt={name}
        onError={errorHandler}
        className={`${classes.image} ${imageShape} object-contain`}
      />

      <div className="flex-1">
        {/* 이름/닉네임 */}
        <div className={`font-medium text-gray-900 dark:text-white ${classes.text}`}>
          {name}
        </div>

        {/* 배지 (사용자만, showBadge가 true일 때만) */}
        {type === 'user' && showBadge && badgeName && (
          <span className={`inline-block mt-1 ${classes.badge} rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300`}>
            {badgeName}
          </span>
        )}
      </div>
    </div>
  );
}

// ===== 편의 함수들 (기존 API 호환성) =====

// 사용자 팔로우 카드
export function FollowUserCard({
  id,
  nickname,
  image,
  badgeName,
  onClick,
}: {
  id: number;
  nickname: string;
  image: string | null;
  badgeName?: string;
  onClick?: () => void;
}) {
  return (
    <FollowCard
      type="user"
      id={id}
      name={nickname}
      image={image}
      badgeName={badgeName}
      onClick={onClick}
    />
  );
}

// 기업 팔로우 카드
export function FollowCompanyCard({
  id,
  name,
  image,
  onClick,
}: {
  id: string;
  name: string;
  image: string | null;
  onClick?: () => void;
}) {
  return (
    <FollowCard
      type="company"
      id={id}
      name={name}
      image={image}
      onClick={onClick}
    />
  );
}
