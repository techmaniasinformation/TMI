import React from 'react';

interface UserInfoBoxProps {
  profileImageUrl?: string;
  nickname: string;
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
  children,
  width,
  height,
  imageSize = '40px', // 기본값 설정
}: UserInfoBoxProps) {
  return (
    <div
      // 수평 정렬
      className="flex items-start gap-3"
      style={{ width, height }}
    >
      {/* 프로필 이미지 (크기 지정 가능) */}
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt="profile"
          style={{
            width: imageSize,
            height: imageSize,
          }}
          className="rounded-full object-cover"
        />
      ) : (
        <div
          style={{
            width: imageSize,
            height: imageSize,
          }}
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
        >
          <span className="text-white font-semibold text-sm">
            {nickname.charAt(0)}
          </span>
        </div>
      )}

      {/* 닉네임 + 하위 정보 */}
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{nickname}</span>
        {/* 추가로 렌더링 될 정보 */}
        {children}
      </div>
    </div>
  );
}
