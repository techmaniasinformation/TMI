import React, { useMemo } from 'react';
import UserInfoBox from '@/components/domain/article/UserInfo';
import { Badge } from '@/components/domain/Badge';
import { Button } from '@/components/foundation/button';
import { DateTimeComponent, CardInfoCount } from '@/components/domain/article';

interface AuthorInfoProps {
  post: any; // Post 타입을 사용하지만 여기서는 any로 간단히 처리
  formatDate: (date: string) => string;
  onFollowClick: () => void;
  onAuthorClick: () => void;
  isFollowing: boolean;
  showFollowButton?: boolean; // 팔로우 버튼 표시 여부
  /** ✅ 부모에서 내려주는 대표 배지 이름(개인 글에서만). 없으면 표시 X */
  badgeName?: string;
  /** ✅ 실제 대표 배지 이미지 URL */
  badgeImage?: string;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({
  post,
  formatDate,
  onFollowClick,
  onAuthorClick,
  isFollowing,
  showFollowButton = true,
  badgeName, // ✅ 추가
  badgeImage // ✅ 추가
}) => {
  
  // 프로필 이미지 URL을 메모이제이션
  const profileImageUrl = useMemo(() => {
    return post.memberProfileUrl;
  }, [post.memberProfileUrl]);

  // 닉네임 옆에 표시할 라벨(기업 또는 대표 배지명). 없으면 null로 둠.
  const badgeLabel = useMemo(() => {
    // 1) 회사 글이면 무조건 '기업'
    if (post?.companyId) return '기업';
    // 2) 개인 글이면 부모에서 받은 badgeName 있을 때만 표시
    return badgeName?.trim() ? badgeName.trim() : null;
  }, [post?.companyId, badgeName]);

  return (
    <div className="bg-light-header dark:bg-dark-header rounded-lg shadow-md dark:shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <UserInfoBox
          profileImageUrl={profileImageUrl}
          nickname={post.name}
          badgeImage={badgeImage}
          imageSize="64px"
          onClick={onAuthorClick}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-4">
            <DateTimeComponent 
              date={post.createAt}
              formatDate={formatDate}
            />
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <CardInfoCount 
              viewCount={post.viewCount}
              starCount={post.starCount}
              commentCount={post.commentCount}
              showStar={true}
              showComment={true}
              showView={true}
            />
          </div>
        </UserInfoBox>
        {showFollowButton && (
          <Button 
            variant={isFollowing ? "dark" : "primary"}
            size="sm"
            onClick={onFollowClick}
          >
            {isFollowing ? '팔로우 취소' : '팔로우'}
          </Button>
        )}
      </div>
    </div>
  );
};
