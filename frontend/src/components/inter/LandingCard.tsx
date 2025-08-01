import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import Tag from '@/components/domain/article/Tag';

// 카드 variant 스타일 정의
const cardVariants = cva(
  'backdrop-blur-sm transition-all duration-300 cursor-pointer rounded-lg border hover:shadow-lg',
  {
    variants: {
      variant: {
        default:
          'bg-light-bg text-dark-bg border border-dark-bg hover:bg-light-bg-hover',
        dark: 'bg-dark-bg text-white border border-light-bg hover:bg-dark-bg-hover',
        light:
          'bg-light-bg text-dark-bg border border-dark-bg hover:bg-light-bg-hover',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

interface LandingCardProps extends VariantProps<typeof cardVariants> {
  postId: number;
  memberProfileUrl?: string | null;
  companyProfileUrl?: string | null;
  name: string;
  badgeUrl?: string | null;
  title: string;
  createAt: string;
  viewCount: number;
  starCount: number;
  commentCount: number;
  tags: string[];
  thumbnailUrl: string;
  roleColor: string; // ex: "bg-blue-600"
  hoverBorder: string; // ex: "hover:border-blue-500/50"
  hoverShadow: string; // ex: "hover:shadow-blue-500/20"
  onClick?: () => void; // 클릭 이벤트를 부모 컴포넌트로부터 받음
}

const LandingCard: React.FC<LandingCardProps> = ({
  postId,
  memberProfileUrl,
  companyProfileUrl,
  name,
  badgeUrl,
  title,
  createAt,
  viewCount,
  starCount,
  commentCount,
  tags,
  thumbnailUrl,
  roleColor,
  hoverBorder,
  hoverShadow,
  variant,
  onClick,
}) => {
  const profileUrl = memberProfileUrl || companyProfileUrl;

  return (
    <div
      key={postId}
      //className={`bg-gray-800/70 backdrop-blur-sm hover:bg-gray-800/90
      //   transition-all duration-300 cursor-pointer rounded-lg border
      //   border-gray-700/50 ${hoverBorder} hover:shadow-lg ${hoverShadow} ${roleColor}`} // roleColor도 여기서 사용 가능 ********
      className={cn(
        cardVariants({ variant }), // ***** 다크/라이트에 따라 클래스 적용
        // roleColor,
        hoverBorder,
        hoverShadow
      )}
      onClick={onClick} // ******** 클릭 이벤트 바인딩 ********
      role='button'
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && onClick) {
          onClick();
        }
      }}
    >
      <div className='p-6'>
        <div className='flex items-start gap-4'>
          {/* 프로필 + 작성자 정보 */}
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-4'>
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={`${name} 프로필`}
                  className='w-8 h-8 rounded-full object-cover'
                />
              ) : (
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                  <span className='text-xs font-semibold'>
                    {name.charAt(0)}
                  </span>
                </div>
              )}

              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>{name}</span>
                {badgeUrl && (
                  <img
                    src={badgeUrl}
                    alt='Badge'
                    className='w-5 h-5 rounded-full border '
                  />
                )}
              </div>
              {/* 썸네일 */}
              <div className='w-24 h-20 flex-shrink-0 ml-auto'>
                <img
                  src={thumbnailUrl}
                  alt={`${title} 썸네일`}
                  className='w-full h-full object-cover rounded-lg object-top'
                />
              </div>
            </div>

            {/* 제목 */}
            <h3 className='text-lg font-semibold mb-3 hover:text-blue-400 transition-colors'>
              {title}
            </h3>

            {/* 메타 정보 */}
            <div className='flex items-center gap-3 text-sm mb-4'>
              <span>{createAt}</span>
              <span>•</span>
              <span className='flex items-center gap-1'>
                <i className='ri-eye-line w-4 h-4 flex items-center justify-center'></i>
                {viewCount.toLocaleString()}
              </span>
              <span className='flex items-center gap-1'>
                <i className='ri-star-line w-4 h-4 flex items-center justify-center'></i>
                {starCount}
              </span>
              <span className='flex items-center gap-1'>
                <i className='ri-chat-3-line w-4 h-4 flex items-center justify-center'></i>
                {commentCount}
              </span>
            </div>

            {/* 태그 */}

            <div className='flex flex-wrap gap-2'>
              {tags.map((tag, index) => (
                // &&& 기존 span 대신 Tag 컴포넌트 사용
                <Tag
                  key={index}
                  tag={`#${tag}`}
                  variant='tech'
                  removable={false}
                  className='text-xs'
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCard;
