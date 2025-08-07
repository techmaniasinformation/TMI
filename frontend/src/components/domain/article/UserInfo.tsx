import React from 'react';
import { getSafeProfileUrl } from '@/utils/defaultImages';

interface UserInfoBoxProps {
  profileImageUrl: string;
  nickname: string;
  badge?: React.ReactNode; // 뱃지 추가
  // 닉네임 아래에 추가 정보를 넣고 싶을 때 사용
  children?: React.ReactNode;

  // 사이즈 조절
  width?: string;   // ex: '300px', '100%'
  height?: string;  // ex: '60px', optional

  // 이미지 사이즈 조절
  imageSize?: string; // ex: '40px', '2.5rem'
}

export default function UserInfoBox({
  profileImageUrl,
  nickname,
  badge,
  children,
  width,
  height,
  imageSize = '40px', // 기본값 설정
}: UserInfoBoxProps) {
  // 안전한 프로필 이미지 URL 사용
  const safeProfileUrl = getSafeProfileUrl(profileImageUrl);

  return (
    <div
      // 수평 정렬
      className="flex items-start gap-3"
      style={{ width, height }}
    >
      {/* 프로필 이미지 (크기 지정 가능) */}
      <img
        src={safeProfileUrl}
        alt="profile"
        style={{
          width: imageSize,
          height: imageSize,
        }}
        className="rounded-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src !== safeProfileUrl) {
            target.src = safeProfileUrl;
          }
        }}
      />

      {/* 닉네임 + 하위 정보 */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{nickname}</span>
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
