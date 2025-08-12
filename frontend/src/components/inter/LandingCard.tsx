import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import Tag from '@/components/domain/article/Tag';
import CardInfoCount from '@/components/domain/article/CardInfoCount';
import { getSafeProfileUrl, getSafeBadgeUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

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
  postId: string;
  memberProfile?: string | null;
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
  memberProfile,
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
  // 이미지 에러 상태 관리
  const [profileImageError, setProfileImageError] = useState(false);
  const [badgeImageError, setBadgeImageError] = useState(false);
  const [thumbnailImageError, setThumbnailImageError] = useState(false);

  // 안전한 이미지 URL 사용
  const safeProfileUrl = getSafeProfileUrl(memberProfile || companyProfileUrl);
  const safeBadgeUrl = getSafeBadgeUrl(badgeUrl);

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
              {memberProfile || companyProfileUrl ? (
                <img
                  src={safeProfileUrl}
                  alt={`${name} 프로필`}
                  className='w-8 h-8 rounded-full object-contain'
                  onError={() => setProfileImageError(true)}
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
                {badgeUrl && !badgeImageError ? (
                  <img
                    src={safeBadgeUrl}
                    alt='Badge'
                    className='w-5 h-5 rounded-full border'
                    onError={() => setBadgeImageError(true)}
                  />
                ) : null}
              </div>
              {/* 썸네일 */}
              <div className='w-24 h-20 flex-shrink-0 ml-auto'>
                {thumbnailUrl && thumbnailUrl.trim() !== '' && !thumbnailImageError ? (
                  <img
                    src={thumbnailUrl}
                    alt={`${title} 썸네일`}
                    className='w-full h-full object-contain rounded-lg object-top'
                    onError={() => setThumbnailImageError(true)}
                  />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center'>
                    <i className='ri-image-line text-gray-400 text-xl'></i>
                  </div>
                )}
              </div>
            </div>

            {/* 제목 */}
            <h3 className='text-lg font-semibold mb-3 hover:text-blue-400 transition-colors'>
              {title}
            </h3>

            {/* 메타 정보 */}
            <div className='flex items-center gap-3 text-sm mb-4'>
              <CardInfoCount
                viewCount={viewCount}
                starCount={starCount}
                commentCount={commentCount}
              />
            </div>

            {/* 태그 */}
            <div className='flex flex-wrap gap-2'>
              {tags.map((tag, index) => (
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
