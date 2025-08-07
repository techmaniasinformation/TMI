import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import UserStatsCard from './UserStatsCard';
import { fetchMemberProfile } from '@/api/mypage/memberSevice';
import { getCompany } from '@/api/company/company';

import type { MemberData } from '@/types/mypage/member';
import type { Company } from '@/types/company/company';

// 아이콘 및 기본 이미지
import Star from '@/assets/icons/star.svg';
import GitHub from '@/assets/icons/Github.svg';
import Blog from '@/assets/icons/blog.svg';
import Follow from '@/assets/icons/Follow.svg';
import ArticleFix from '@/assets/icons/articlefix.svg';
import UserDelete from '@/assets/icons/userdelete.svg';
import Update from '@/assets/icons/Update.svg';

// 모달
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
  const { id } = useParams();
  const memberId = isMyPage ? 1 : Number(id);

  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [showWithdrawalComplete, setShowWithdrawalComplete] = useState(false);

  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;

    setLoading(true);
    if (isCompany) {
      getCompany(memberId)
        .then((res) => setCompanyData(res.data))
        .catch((err) => console.error('기업 정보 조회 실패:', err))
        .finally(() => setLoading(false));
    } else {
      fetchMemberProfile(memberId)
        .then((data) => setMemberData(data))
        .catch((err) => console.error('멤버 정보 조회 실패:', err))
        .finally(() => setLoading(false));
    }
  }, [id, isCompany, isMyPage]);

  const handleWithdrawalClick = () => setShowWithdrawalConfirm(true);
  const handleWithdrawalConfirm = () => {
    setShowWithdrawalConfirm(false);
    setShowWithdrawalComplete(true);
  };
  const handleWithdrawalComplete = () => {
    window.location.href = '/';
  };

  const getProfileImage = (url: string | null | undefined) => {
    if (!url || url.includes('cdn.example.com')) return Star;
    return url;
  };

  if (loading) {
    return (
      <div className="w-[1232px] h-[150px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if ((isCompany && !companyData) || (!isCompany && !memberData)) {
    return (
      <div className="w-[1232px] h-[150px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex items-center justify-center">
        <p className="text-red-500">프로필 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-[1232px] h-[150px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between h-full">
        {/* 좌측 프로필 정보 */}
        <div className="flex items-start space-x-4">
          <img
            src={getProfileImage(
              isCompany ? companyData?.companyProfileUrl : memberData?.memberProfileUrl
            )}
            alt="profile"
            className="w-20 h-20 ps-4 rounded-full object-fit"
            onError={(e) => ((e.target as HTMLImageElement).src = Star)}
          />

          <div className="flex-1">
            <div className="flex items-center space-x-3 mt-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {isCompany ? companyData?.name : memberData?.nickname}
              </h1>
              {isCompany && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-0.5 rounded-md">
                  기업
                </span>
              )}
            </div>

            {/* 개인용 링크 */}
            {!isCompany && (
              <div className="flex space-x-6 mt-6">
                {memberData?.blogUrl && (
                  <a
                    href={memberData.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <img src={Blog} alt="blog" className="w-4 h-4 mr-2" />
                    블로그
                  </a>
                )}
                {memberData?.githubUrl && (
                  <a
                    href={memberData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <img src={GitHub} alt="github" className="w-4 h-4 mr-2" />
                    깃허브
                  </a>
                )}
              </div>
            )}

            {/* 기업용 링크 */}
            {isCompany && (
              <>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <img src={Update} alt="update icon" className="w-4 h-4 mr-2" />
                  최근 업데이트: {lastUpdate}
                </div>
                {companyData?.techBlogUrl && (
                  <div className="flex items-center mt-4">
                    <a
                      href={companyData.techBlogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <img src={Blog} alt="blog" className="w-4 h-4 mr-2" />
                      블로그
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 통계 + 버튼 */}
        <div className="flex flex-col items-end justify-between h-full space-y-5">
          <UserStatsCard
            posts={
              isCompany ? companyData?.stats.postCount ?? 0 : memberData?.memberStats.postCount ?? 0
            }
            comments={
              isCompany ? 0 : memberData?.memberStats.commentCount ?? 0
            }
            followers={
              isCompany ? companyData?.stats.followerCount ?? 0 : memberData?.memberStats.followerCount ?? 0
            }
            views={
              isCompany ? companyData?.stats.totalViewCount ?? 0 : memberData?.memberStats.totalViewCount ?? 0
            }
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

      {/* 탈퇴 모달 */}
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
