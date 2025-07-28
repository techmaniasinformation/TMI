import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/domain/Avatar';
import { Badge } from '@/components/domain/Badge';

interface UserInfoProps {
  author: string;
  authorProfile: string;
  authorBadge?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ 
  author, 
  authorProfile, 
  authorBadge 
}) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={authorProfile} alt={author} />
        <AvatarFallback>{author[0]}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{author}</span>
        {authorBadge && (
          <Badge variant="secondary" className="text-xs" imgSrc="">
            {authorBadge}
          </Badge>
        )}
      </div>
    </div>
  );
};

export { UserInfo }; 