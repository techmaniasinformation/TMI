import React, { useMemo, useState, ReactNode } from 'react';
import { getSafeProfileUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

interface UserInfoBoxProps {
  profileImageUrl: string;
  nickname: string | ReactNode;
  badge?: React.ReactNode; // 뱃지 추가
  badgeImage?: string | null; // 뱃지 이미지 URL 추가
  // 닉네임 아래에 추가 정보를 넣고 싶을 때 사용
  children?: React.ReactNode;

  // 사이즈 조절
  width?: string;   // ex: '300px', '100%'
  height?: string;  // ex: '60px', optional

  // 이미지 사이즈 조절
  imageSize?: string; // ex: '40px', '2.5rem'

  // 클릭 이벤트
  onClick?: () => void;
}

export default function UserInfoBox({
  profileImageUrl,
  nickname,
  badge,
  badgeImage,
  children,
  width,
  height,
  imageSize = '40px', // 기본값 설정
  onClick,
}: UserInfoBoxProps) {
  // 이미지 에러 상태 관리
  const [imageError, setImageError] = useState(false);
  const [badgeImageError, setBadgeImageError] = useState(false);

  // 안전한 프로필 이미지 URL을 메모이제이션
  const safeProfileUrl = useMemo(() => {
    return getSafeProfileUrl(profileImageUrl);
  }, [profileImageUrl]);

  // 안전한 뱃지 이미지 URL을 메모이제이션
  const safeBadgeUrl = useMemo(() => {
    let url = '';
    if (badgeImage) {
      // 이미 전체 URL이면 그대로 사용
      if (/^https?:\/\//i.test(badgeImage)) {
        url = badgeImage;
      } 
      // 빌드된 이미지 경로이면 그대로 사용
      else if (badgeImage.startsWith('/assets/')) {
        url = badgeImage;
      }
      // 파일명만 있으면 서버 CDN에서 로딩
      else {
        const BADGE_CDN_BASE = 'https://i13a509.p.ssafy.io/api/v1/badge/images';
        url = `${BADGE_CDN_BASE}/${badgeImage}`;
      }
    }
    return url;
  }, [badgeImage, nickname]);

  // 이미지 로딩 에러 핸들러
  const handleImageError = () => {
    setImageError(true);
  };

  // 뱃지 이미지 로딩 에러 핸들러
  const handleBadgeImageError = () => {
    setBadgeImageError(true);
  };

  return (
    <div
      // 수평 정렬
      className={`flex items-start gap-3 ${onClick ? 'cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]' : ''}`}
      style={{ width, height }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* 프로필 이미지 (크기 지정 가능) */}
      <img
        src={imageError ? DEFAULT_IMAGES.PROFILE : safeProfileUrl}
        alt="profile"
        style={{
          width: imageSize,
          height: imageSize,
        }}
        className="rounded-full object-cover"
        onError={handleImageError}
      />

      {/* 닉네임 + 하위 정보 */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="font-semibold mt-2 text-lg dark:text-white">{nickname}</span>
          {/* 뱃지 이미지 표시 */}
          {badgeImage && !badgeImageError && (
            <img
              src={safeBadgeUrl}
              alt="대표 배지"
              className="w-6 h-6 rounded-md"
              onError={handleBadgeImageError}
            />
          )}
          {/* 기존 뱃지 (텍스트 형태) */}
          {badge && badge}
        </div>
        {/* 추가로 렌더링 될 정보 */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
