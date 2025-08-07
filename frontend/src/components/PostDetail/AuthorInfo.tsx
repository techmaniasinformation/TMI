import React from 'react';
import UserInfoBox from '@/components/domain/article/UserInfo';
import { Badge } from '@/components/domain/Badge';
import { Button } from '@/components/foundation/button';
import { DateTimeComponent, CardInfoCount } from '@/components/domain/article';

interface AuthorInfoProps {
  post: any; // Post 타입을 사용하지만 여기서는 any로 간단히 처리
  formatDate: (date: string) => string;
  onFollowClick: () => void;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({ post, formatDate, onFollowClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <UserInfoBox
          profileImageUrl={post.memberProfileUrl}
          nickname={post.name}
          imageSize="64px"
          badge={
            <Badge className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
              인증
            </Badge>
          }
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
            <DateTimeComponent 
              date={post.createAt}
              formatDate={formatDate}
            />
            <span className="text-gray-400">•</span>
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
        <Button 
          variant="dark" 
          size="sm"
          className="bg-black text-white hover:bg-gray-800"
          onClick={onFollowClick}
        >
          팔로우
        </Button>
      </div>
    </div>
  );
}; 