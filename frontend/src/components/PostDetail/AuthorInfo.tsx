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
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({ post, formatDate, onFollowClick, onAuthorClick, isFollowing, showFollowButton = true }) => {
  // 프로필 이미지 URL을 메모이제이션
  const profileImageUrl = useMemo(() => {
    return post.memberProfileUrl;
  }, [post.memberProfileUrl]);

  return (
    <div className="bg-light-header dark:bg-dark-header rounded-lg shadow-md dark:shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <UserInfoBox
          profileImageUrl={profileImageUrl}
          nickname={post.name}
          imageSize="64px"
          onClick={onAuthorClick}
          badge={
            <Badge className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
              인증
            </Badge>
          }
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
            variant={isFollowing ? "light" : "primary"}
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