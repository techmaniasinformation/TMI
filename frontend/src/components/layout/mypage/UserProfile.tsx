import React from 'react';
import { Avatar, AvatarImage, AvatarFallback, Badge } from '@/components/domain';
import { Button } from '@/components/foundation/button';

interface UserProfileProps {
  user: {
    nickname: string;
    avatar: string;
    badges: string[];
    stats: {
      posts: number;
      comments: number;
      followers: number;
      likes: number;
      views: number;
    };
  };
  onEditProfile: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEditProfile }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar} alt={user.nickname} />
          <AvatarFallback>{user.nickname[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-xl font-semibold text-gray-900">{user.nickname}</h2>
            {user.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.stats.posts}</div>
              <div className="text-gray-500">게시글</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.stats.comments}</div>
              <div className="text-gray-500">댓글</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.stats.followers}</div>
              <div className="text-gray-500">팔로워</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.stats.likes}</div>
              <div className="text-gray-500">좋아요</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.stats.views}</div>
              <div className="text-gray-500">조회수</div>
            </div>
          </div>
        </div>
        
        <Button onClick={onEditProfile} variant="outline" size="sm">
          프로필 수정
        </Button>
      </div>
    </div>
  );
};

export default UserProfile; 