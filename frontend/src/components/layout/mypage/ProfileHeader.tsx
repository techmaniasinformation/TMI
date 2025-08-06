import React, { useState, useEffect } from 'react';
import UserStatsCard from './UserStatsCard';
import { fetchMemberProfile } from '@/api/mypage/memberSevice';
import type { MemberData } from '@/types/mypage/member';

// 기본 이미지 & 아이콘
import Star from '@/assets/icons/star.svg';
import GitHub from '@/assets/icons/Github.svg';
import Blog from '@/assets/icons/blog.svg';
import Follow from '@/assets/icons/Follow.svg';
import ArticleFix from '@/assets/icons/articlefix.svg';
import UserDelete from '@/assets/icons/userdelete.svg';
import Update from '@/assets/icons/Update.svg';

// 회원탈퇴 모달
import WithdrawalConfirmModal from '@/components/layout/mypage/WithdrawalConfirmModal';
import WithdrawalCompleteModal from '@/components/layout/mypage/WithdrawalCompleteModal';

interface ProfileHeaderProps {
  isFollowing: boolean;
  isCompany: boolean;
  isMyPage: boolean;
  lastUpdate: string;
  onFollowToggle: () => void;
  onEditClick: () => void;
}

export default function ProfileHeader({
  isFollowing,
  isCompany,
  isMyPage,
  lastUpdate,
  onFollowToggle,
  onEditClick,
}: ProfileHeaderProps) {
  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [showWithdrawalComplete, setShowWithdrawalComplete] = useState(false);

  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  // API 연동 (현재 1번 유저 고정, 추후 동적 변경 가능)
  useEffect(() => {
    setLoading(true);
    fetchMemberProfile(1)
      .then((data) => setMemberData(data))
      .catch((err) => console.error('멤버 정보 조회 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  // 탈퇴 모달 제어
  const handleWithdrawalClick = () => setShowWithdrawalConfirm(true);
  const handleWithdrawalConfirm = () => {
    setShowWithdrawalConfirm(false);
    setShowWithdrawalComplete(true);
  };
  const handleWithdrawalComplete = () => {
    window.location.href = '/';
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="w-[1232px] h-[150px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  // 데이터 없음
  if (!memberData) {
    return (
      <div className="w-[1232px] h-[150px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex items-center justify-center">
        <p className="text-red-500">멤버 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 프로필 이미지 URL 유효성 검사 + 기본 이미지 처리
  const getProfileImage = (url: string | null) => {
    if (!url || url.includes('cdn.example.com')) {
      return Star; // 기본 별 이미지
    }
    return url;
  };

  return (
    <div className="w-[1232px] h-[150px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between h-full">
        {/* 좌측 프로필 정보 */}
        <div className="flex items-start space-x-4">
          {/* 프로필 이미지 */}
          <img
            src={getProfileImage(memberData.memberProfileUrl)}
            alt="profile"
            className="w-20 h-20 ps-4 rounded-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).src = Star)} // 로드 실패 시 기본 이미지로 변경
          />

          <div className="flex-1">
            {/* 닉네임 + 기업 뱃지 */}
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{memberData.nickname}</h1>
              {isCompany && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-0.5 rounded-md">
                  기업
                </span>
              )}
            </div>

            {/* 개인 블로그 / 깃허브 */}
            {!isCompany && (
              <div className="flex space-x-6 mt-4">
                {memberData.blogUrl && (
                  <a
                    href={memberData.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <img src={Blog} alt="blog" className="w-4 h-4 mr-2" /> 블로그
                  </a>
                )}
                {memberData.githubUrl && (
                  <a
                    href={memberData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <img src={GitHub} alt="github" className="w-4 h-4 mr-2" /> 깃허브
                  </a>
                )}
              </div>
            )}

            {/* 기업 블로그 + 최근 업데이트 */}
            {isCompany && (
              <>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <img src={Update} alt="update icon" className="w-4 h-4 mr-2" />
                  최근 업데이트: {lastUpdate}
                </div>
                {memberData.blogUrl && (
                  <div className="flex items-center mt-4">
                    <a
                      href={memberData.blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <img src={Blog} alt="blog" className="w-4 h-4 mr-2" /> 블로그
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 우측 통계 + 버튼 */}
        <div className="flex flex-col items-end justify-between h-full space-y-5">
          <UserStatsCard
            posts={memberData.memberStats.postCount}
            comments={memberData.memberStats.commentCount}
            followers={memberData.memberStats.followerCount}
            views={memberData.memberStats.totalViewCount}
            isCompany={isCompany}
          />

          {isMyPage ? (
            <div className="flex space-x-2">
              <button
                className="w-[132px] bg-prime-btn text-white text-sm rounded-md py-2 px-3 hover:bg-prime-btn-hover flex items-center justify-center"
                onClick={onEditClick}
              >
                <img src={ArticleFix} alt="edit icon" className="w-4 h-4 mr-2" />
                프로필 수정
              </button>
              <button
                onClick={handleWithdrawalClick}
                className="w-[120px] bg-red-500 text-white text-sm rounded-md py-2 px-3 hover:bg-red-600 flex items-center justify-center"
              >
                <img src={UserDelete} alt="delete icon" className="w-4 h-4 mr-2" />
                회원 탈퇴
              </button>
            </div>
          ) : (
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

      {/* 회원탈퇴 모달 */}
      <WithdrawalConfirmModal
        isOpen={showWithdrawalConfirm}
        onCancel={() => setShowWithdrawalConfirm(false)}
        onConfirm={handleWithdrawalConfirm}
      />
      <WithdrawalCompleteModal
        isOpen={showWithdrawalComplete}
        onConfirm={handleWithdrawalComplete}
      />
    </div>
  );
}
