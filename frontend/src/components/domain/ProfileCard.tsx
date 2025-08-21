import React, { memo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/domain/Avatar';
import { Badge } from '@/components/domain/Badge';
import { getSafeProfileUrl, handleProfileImageError } from '@/utils/defaultImages';

// ===== 통합 ProfileCard Props =====
interface ProfileCardProps {
  type?: 'user' | 'company'; // Made optional as it's not needed for grid mode
  // 공통 props
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showType?: boolean;
  // user type props
  user?: { memberId: number; nickname: string; memberProfileUrl: string; };
  // company type props
  company?: { companyId: number; companyName: string; companyProfileUrl: string; };
  // 통합 데이터 props (type에 따라 자동 선택)
  data?: { id: number; name: string; profileUrl: string; };
  // 그리드 관련 props
  columns?: 2 | 3 | 4 | 5 | 6;
  profiles?: Array<{ id: number; name: string; profileUrl: string; type: 'user' | 'company'; }>;
  onProfileClick?: (type: 'user' | 'company', id: number) => void;
}

// ===== 통합 ProfileCard 컴포넌트 =====
export const ProfileCard = memo(function ProfileCard({
  type,
  // 공통 props
  onClick,
  className = '',
  size = 'md',
  showType = false,
  // user type props
  user,
  // company type props
  company,
  // 통합 데이터 props
  data,
  // 그리드 관련 props
  columns = 3,
  profiles,
  onProfileClick,
}: ProfileCardProps) {
  // 그리드 모드 렌더링
  if (profiles && onProfileClick) {
    const gridClasses = {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    };

    return (
      <div className={`grid gap-4 ${gridClasses[columns]} ${className}`}>
        {profiles.map((profile) => (
          <ProfileCard
            key={`${profile.type}-${profile.id}`}
            type={profile.type}
            data={profile}
            onClick={() => onProfileClick(profile.type, profile.id)}
            size={size}
            showType={showType}
          />
        ))}
      </div>
    );
  }

  // 단일 카드 렌더링
  const sizeClasses = {
    sm: {
      container: 'p-2',
      avatar: 'w-8 h-8',
      text: 'text-xs',
      badge: 'text-xs px-1 py-0.5',
    },
    md: {
      container: 'p-3',
      avatar: 'w-12 h-12',
      text: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      container: 'p-4',
      avatar: 'w-16 h-16',
      text: 'text-base',
      badge: 'text-sm px-2 py-1',
    },
  };

  const classes = sizeClasses[size];

  // 데이터 결정 로직
  let profileData: { id: number; name: string; profileUrl: string; type: 'user' | 'company' } | null = null;

  if (data) {
    profileData = { ...data, type: type || 'user' };
  } else if (user) {
    profileData = {
      id: user.memberId,
      name: user.nickname,
      profileUrl: user.memberProfileUrl,
      type: 'user',
    };
  } else if (company) {
    profileData = {
      id: company.companyId,
      name: company.companyName,
      profileUrl: company.companyProfileUrl,
      type: 'company',
    };
  }

  if (!profileData) {
    return null;
  }

  const { id, name, profileUrl, type: profileType } = profileData;

  return (
    <div
      className={`flex items-center space-x-3 ${classes.container} rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 ${className}`}
      onClick={onClick}
    >
      <Avatar className={classes.avatar}>
        <AvatarImage
          src={getSafeProfileUrl(profileUrl)}
          alt={name}
          onError={handleProfileImageError}
        />
        <AvatarFallback>
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className={`font-medium text-gray-900 dark:text-white ${classes.text} truncate`}>
          {name}
        </div>
        
        {showType && (
          <Badge
            variant="secondary"
            className={`mt-1 ${classes.badge}`}
          >
            {profileType === 'user' ? '사용자' : '기업'}
          </Badge>
        )}
      </div>
    </div>
  );
});

// ===== 편의 함수들 (기존 API 호환성) =====

// 사용자 프로필 카드
export const UserProfileCard = memo(function UserProfileCard({
  user,
  onClick,
  className,
  size = 'md',
  showType = false,
}: {
  user: { memberId: number; nickname: string; memberProfileUrl: string; };
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showType?: boolean;
}) {
  return (
    <ProfileCard
      type="user"
      user={user}
      onClick={onClick}
      className={className}
      size={size}
      showType={showType}
    />
  );
});

// 기업 프로필 카드
export const CompanyProfileCard = memo(function CompanyProfileCard({
  company,
  onClick,
  className,
  size = 'md',
  showType = false,
}: {
  company: { companyId: number; companyName: string; companyProfileUrl: string; };
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showType?: boolean;
}) {
  return (
    <ProfileCard
      type="company"
      company={company}
      onClick={onClick}
      className={className}
      size={size}
      showType={showType}
    />
  );
});

// 프로필 카드 그리드
export const ProfileCardGrid = memo(function ProfileCardGrid({
  profiles,
  onProfileClick,
  columns = 3,
  className,
  size = 'md',
  showType = false,
}: {
  profiles: Array<{ id: number; name: string; profileUrl: string; type: 'user' | 'company'; }>;
  onProfileClick: (type: 'user' | 'company', id: number) => void;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showType?: boolean;
}) {
  return (
    <ProfileCard
      profiles={profiles}
      onProfileClick={onProfileClick}
      columns={columns}
      className={className}
      size={size}
      showType={showType}
    />
  );
});
