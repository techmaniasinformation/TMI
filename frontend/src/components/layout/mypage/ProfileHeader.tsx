import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import UserStatsCard from './UserStatsCard';
import { fetchMemberProfile, deleteMember } from '@/api/mypage/memberSevice';
import { getCompany } from '@/api/company/company';

import type { MemberData } from '@/types/mypage/member';
import type { Company } from '@/types/company/company';

import GitHub from '@/assets/icons/Github.svg';
import Blog from '@/assets/icons/blog.svg';
import Follow from '@/assets/icons/Follow.svg';
import ArticleFix from '@/assets/icons/articlefix.svg';
import UserDelete from '@/assets/icons/userdelete.svg';
import Update from '@/assets/icons/Update.svg';

import { getSafeProfileUrl } from '@/utils/defaultImages';
import WithdrawalConfirmModal from '@/components/layout/mypage/WithdrawalConfirmModal';
import WithdrawalCompleteModal from '@/components/layout/mypage/WithdrawalCompleteModal';

import { useUserStore } from '@/stores/userStore';

interface ProfileHeaderProps {
  isFollowing: boolean;
  isCompany: boolean;
  isMyPage: boolean;
  lastUpdate: string;
  onFollowToggle: () => void;
  onEditClick: () => void;
  repBadgeUrl?: string | null;
  refreshKey?: number;
}

export default function ProfileHeader({
  isFollowing,
  isCompany,
  isMyPage,
  lastUpdate,
  onFollowToggle,
  onEditClick,
  repBadgeUrl,
  refreshKey = 0,
}: ProfileHeaderProps) {
  const { id } = useParams();
  const routeId = Number(id);
  const navigate = useNavigate();

  const {
    user,
    clearUser,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo,
  } = useUserStore();

  const myId = user?.memberId ?? null;

  // 내 페이지면 내 id, 아니면 URL id
  const targetId = isMyPage && myId && myId > 0 ? myId : routeId;

  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [showWithdrawalComplete, setShowWithdrawalComplete] = useState(false);

  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // 프로필 데이터 불러오기
  useEffect(() => {
    if (!targetId || Number.isNaN(targetId) || targetId <= 0) return;

    let ignore = false;
    async function loadProfile() {
      setLoading(true);
      try {
        if (isCompany) {
          const res = await getCompany(targetId);
          if (!ignore) setCompanyData(res.data);
        } else {
          const data = await fetchMemberProfile(targetId);
          if (!ignore) setMemberData(data);
        }
      } catch (err) {
        console.error('프로필 정보 조회 실패:', err);
        if (!ignore) {
          setMemberData(null);
          setCompanyData(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      ignore = true;
    };
  }, [isCompany, targetId, refreshKey]);

  const getProfileImage = (url: string | null | undefined) => getSafeProfileUrl(url);

  // 회원 탈퇴 클릭
  const handleWithdrawalClick = () => {
    setWithdrawError(null);
    setShowWithdrawalConfirm(true);
  };

  // 회원 탈퇴 확정
  const handleWithdrawalConfirm = async () => {
    if (!targetId || Number.isNaN(targetId) || targetId <= 0) return;
    setWithdrawing(true);
    setWithdrawError(null);
    try {
      await deleteMember(targetId);
      setShowWithdrawalConfirm(false);
      setShowWithdrawalComplete(true);
    } catch (e) {
      setWithdrawError((e as Error)?.message || '회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setWithdrawing(false);
    }
  };

  // 회원 탈퇴 완료 후 로그아웃 처리
  const handleWithdrawalComplete = async () => {
    try {
      const idForLogout = myId || targetId;
      if (idForLogout && idForLogout > 0) {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 3000);
        await fetch(`https://i13a509.p.ssafy.io/api/v1/auth/logout/${idForLogout}`, {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal,
        }).catch(() => null);
        clearTimeout(t);
      }
      clearUser();
      setFollowUser([]);
      setFollowCompany([]);
      clearSocialLoginInfo();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      navigate('/', { replace: true });
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="w-[1232px] h-[150px] bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  // 데이터 없을 때
  if ((isCompany && !companyData) || (!isCompany && !memberData)) {
    return (
      <div className="w-[1232px] h-[150px] bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">프로필 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-[1232px] h-[150px] bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex justify-between h-full">
        {/* 왼쪽: 프로필 */}
        <div className="flex items-start space-x-4">
          <img
            src={getProfileImage(isCompany ? companyData?.companyProfileUrl : memberData?.memberProfileUrl)}
            alt="profile"
            className="w-20 h-20 ms-4 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getSafeProfileUrl(null);
            }}
          />
          <div className="flex-1">
            <div className="flex items-center mt-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isCompany ? companyData?.name : memberData?.nickname}
              </h1>

              {/* 대표 배지 */}
              {!isCompany && repBadgeUrl && (
                <img
                  key={repBadgeUrl}
                  src={repBadgeUrl}
                  alt="대표 배지"
                  className="w-8 h-8 rounded-md ml-1"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                  title="대표 배지"
                />
              )}

              {isCompany && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium px-2 py-0.5 rounded-md ml-3">
                  기업
                </span>
              )}
            </div>

            {/* 개인 블로그 / 깃허브 */}
            {!isCompany && (
              <div className="flex space-x-6 mt-6">
                {memberData?.blogUrl && (
                  <a
                    href={memberData.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
<<<<<<< HEAD
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    title="블로그로 이동 (새 탭)"
=======
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
>>>>>>> FE
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
<<<<<<< HEAD
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    title="GitHub로 이동 (새 탭)"
=======
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
>>>>>>> FE
                  >
                    <img src={GitHub} alt="github" className="w-4 h-4 mr-2" />
                    깃허브
                  </a>
                )}
              </div>
            )}

            {/* 기업 정보 */}
            {isCompany && (
              <>
<<<<<<< HEAD
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <img src={Update} alt="update icon" className="w-4 h-4 mr-2" />
=======
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <img src={Update} alt="update" className="w-4 h-4 mr-2" />
>>>>>>> FE
                  최근 업데이트: {lastUpdate}
                </div>
                {companyData?.techBlogUrl && (
                  <div className="flex items-center mt-4">
                    <a
                      href={companyData.techBlogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
<<<<<<< HEAD
                      className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      title="기업 블로그로 이동 (새 탭)"
=======
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
>>>>>>> FE
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

        {/* 오른쪽: 통계 + 버튼 */}
        <div className="flex flex-col items-end justify-between h-full space-y-5">
          <UserStatsCard
            posts={isCompany ? companyData?.stats.postCount ?? 0 : memberData?.memberStats.postCount ?? 0}
            comments={isCompany ? 0 : memberData?.memberStats.commentCount ?? 0}
            followers={isCompany ? companyData?.stats.followerCount ?? 0 : memberData?.memberStats.followerCount ?? 0}
            views={isCompany ? companyData?.stats.totalViewCount ?? 0 : memberData?.memberStats.totalViewCount ?? 0}
            isCompany={isCompany}
          />

          {isMyPage && !isCompany ? (
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
                disabled={withdrawing}
                className={`w-[120px] bg-red-500 text-white text-sm rounded-md py-2 px-3 flex items-center justify-center
                  ${withdrawing ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`}
              >
                <img src={UserDelete} alt="delete icon" className="w-4 h-4 mr-2" />
                {withdrawing ? '처리 중...' : '회원 탈퇴'}
              </button>
            </div>
          ) : (
            <button
              onClick={onFollowToggle}
              className={`w-[120px] text-white text-sm rounded-md py-2 px-3 flex items-center justify-center
                ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-prime-btn hover:bg-prime-btn-hover'}`}
            >
              <img src={Follow} alt="follow icon" className="w-4 h-4 mr-2" />
              {isFollowing ? '언팔로우' : '팔로우'}
            </button>
          )}
        </div>
      </div>

      {/* 모달 */}
      <WithdrawalConfirmModal
        isOpen={showWithdrawalConfirm}
        onCancel={() => setShowWithdrawalConfirm(false)}
        onConfirm={handleWithdrawalConfirm}
        loading={withdrawing}
        errorMessage={withdrawError ?? ''}
      />
      <WithdrawalCompleteModal
        isOpen={showWithdrawalComplete}
        onConfirm={handleWithdrawalComplete}
      />
    </div>
  );
}
