import React from 'react';
import { Badge } from "@/components/domain/Badge";
import UserStatsCard from './UserStatsCard';

// 아이콘 이미지 import
import Star from '@/assets/icons/star.svg';
import GitHub from '@/assets/icons/Github.svg';
import Blog from '@/assets/icons/blog.svg';
import Follow from '@/assets/icons/Follow.svg';

// 컴포넌트 props 타입 정의
interface ProfileHeaderProps {
  nickname: string;
  email?: string;              // 개인 사용자용 이메일
  githubUrl?: string;          // 개인 사용자용 GitHub 링크
  blogUrl: string;             // 블로그 링크 (개인/기업 공통)
  isFollowing: boolean;        // 현재 로그인한 유저가 이 프로필을 팔로우 중인지 여부
  isCompany: boolean;          // 기업 프로필인지 여부
  isMyPage: boolean;           // 본인 페이지인지 여부
  lastUpdate: string;          // 기업 최근 업데이트 날짜
  onFollowToggle: () => void;  // 팔로우 버튼 클릭 핸들러
  postCount: number;
  commentCount: number;
  followerCount: number;
  viewCount: number;
}

export default function ProfileHeader({
  nickname,
  email,
  githubUrl,
  blogUrl,
  isFollowing,
  isCompany,
  isMyPage,
  lastUpdate,
  onFollowToggle,
  postCount,
  commentCount,
  followerCount,
  viewCount,
}: ProfileHeaderProps) {
  return (
    <div className="w-[1232px] h-[150px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between h-full">
        {/* 좌측 프로필 정보 영역 */}
        <div className="flex items-start space-x-4">
          {/* 프로필 이미지 (별 아이콘 고정) */}
          <img src={Star} alt="star" className="w-20 h-20 ps-4" />

          <div className="flex-1">
            {/* 닉네임 및 기업 뱃지 */}
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{nickname}</h1>
              {isCompany && (
                <Badge className="bg-blue-100 text-blue-800">기업</Badge>
              )}
            </div>

            {/* 개인 사용자 정보 영역 */}
            {!isCompany && (
              <>
                {email && <p className="text-gray-500 text-sm">{email}</p>}
                <div className="flex space-x-6 mt-4">
                  {/* 블로그 링크 */}
                  <a href={blogUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <img src={Blog} alt="blog" className="w-4 h-4 mr-2" /> 블로그
                  </a>
                  {/* GitHub 링크 (옵션) */}
                  {githubUrl && (
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                      <img src={GitHub} alt="github" className="w-4 h-4 mr-2" /> 깃허브
                    </a>
                  )}
                </div>
              </>
            )}

            {/* 기업 프로필 정보 영역 */}
            {isCompany && (
              <>
                {/* 최근 업데이트 날짜 */}
                <p className="text-sm text-gray-500 mt-1">
                  <i className="fas fa-clock mr-2" />
                  최근 업데이트: {lastUpdate}
                </p>
                {/* 블로그 링크 */}
                <div className="flex items-center mt-4">
                  <a href={blogUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <img src={Blog} alt="blog" className="w-4 h-4 mr-2" /> 블로그
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 우측 통계 + 팔로우 버튼 영역 */}
        <div className="flex flex-col items-end justify-between h-full space-y-5">
          {/* 통계 카드 (게시글, 댓글, 팔로워, 조회수) */}
          <UserStatsCard
            posts={postCount}
            comments={commentCount}
            followers={followerCount}
            views={viewCount}
            isCompany={isCompany}
          />

          {/* 본인 페이지가 아닌 경우에만 팔로우 버튼 표시 */}
          {!isMyPage && (
            <button
              onClick={onFollowToggle}
              className={`w-[120px] text-white text-sm rounded-md py-2 px-3 transition-colors flex items-center justify-center
                ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-prime-btn hover:bg-prime-btn-hover'}`}
            >
              <img src={Follow} alt="follow icon" className="w-4 h-4 mr-2" />
              {isFollowing ? '언팔로우' : '팔로우'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
