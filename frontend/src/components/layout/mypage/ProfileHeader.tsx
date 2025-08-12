import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import UserStatsCard from './UserStatsCard';
import { fetchMemberProfile, deleteMember } from '@/api/mypage/memberSevice'; // ✅ 경로 수정
import { getCompany } from '@/api/company/company';

import type { MemberData } from '@/types/mypage/member';
import type { Company } from '@/types/company/company';

// import Star from '@/assets/icons/star.svg'; // 사용 안 하면 제거
import GitHub from '@/assets/icons/Github.svg';
import Blog from '@/assets/icons/blog.svg';
import Follow from '@/assets/icons/Follow.svg';
import ArticleFix from '@/assets/icons/articlefix.svg';
import UserDelete from '@/assets/icons/userdelete.svg';
import Update from '@/assets/icons/Update.svg';

import { getSafeProfileUrl } from '@/utils/defaultImages';
import WithdrawalConfirmModal from '@/components/layout/mypage/WithdrawalConfirmModal';
import WithdrawalCompleteModal from '@/components/layout/mypage/WithdrawalCompleteModal';

// ✅ store는 읽기만…이었지만, 로그아웃 시 상태 정리를 위해 일부 setter도 사용
import { useUserStore } from '@/stores/userStore';

interface ProfileHeaderProps {
  isFollowing: boolean;
  isCompany: boolean;
  isMyPage: boolean;
  lastUpdate: string;
  onFollowToggle: () => void;
  onEditClick: () => void;
  repBadgeUrl?: string | null;
}

export default function ProfileHeader({
  isFollowing,
  isCompany,
  isMyPage,
  lastUpdate,
  onFollowToggle,
  onEditClick,
  repBadgeUrl,
}: ProfileHeaderProps) {
  const { id } = useParams();
  const routeId = Number(id);
  const navigate = useNavigate();

  // ✅ 로그인 사용자 id (store에서 읽기)
  const {
    user,
    // ▼ 로그아웃 시 상태 정리용
    clearUser,
    setStarLst,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo,
  } = useUserStore();

  const myId = user?.memberId;

  // ✅ 최종 조회 대상: 내 페이지면 내 id, 아니면 URL id
  const targetId = isMyPage && myId && myId > 0 ? myId : routeId;

  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [showWithdrawalComplete, setShowWithdrawalComplete] = useState(false);

  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  // 탈퇴 로딩/에러
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // ✅ targetId 변경될 때마다 재요청
  useEffect(() => {
    if (!targetId || Number.isNaN(targetId) || targetId <= 0) return;

    let ignore = false;
    async function load() {
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
    load();
    return () => {
      ignore = true;
    };
  }, [isCompany, targetId]);

  const getProfileImage = (url: string | null | undefined) => getSafeProfileUrl(url);

  // --- 탈퇴 흐름 ---
  const handleWithdrawalClick = () => {
    setWithdrawError(null);
    setShowWithdrawalConfirm(true);
  };

  const handleWithdrawalConfirm = async () => {
    if (!targetId || Number.isNaN(targetId) || targetId <= 0) return;
    setWithdrawing(true);
    setWithdrawError(null);
    try {
      await deleteMember(targetId);               // ✅ 실제 탈퇴 API 호출 (PATCH /member/{id}/delete)
      setShowWithdrawalConfirm(false);
      setShowWithdrawalComplete(true);           // ✅ 완료 모달 오픈
    } catch (e) {
      setWithdrawError((e as Error)?.message || '회원 탈퇴 중 오류가 발생했습니다.');
      throw e; // ConfirmModal에서 errorMessage로 노출할 수 있게 (선택)
    } finally {
      setWithdrawing(false);
    }
  };

  const handleWithdrawalComplete = async () => {
    // ✅ 서버 로그아웃(베스트에포트) → 전역 상태/토큰 정리 → 메인 이동
    try {
      const idForLogout = myId || targetId;
      if (idForLogout && idForLogout > 0) {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 3000); // 3초 타임아웃
        await fetch(`https://i13a509.p.ssafy.io/api/v1/auth/logout/${idForLogout}`, {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal,
        }).catch(() => null);
        clearTimeout(t);
      }
      // 전역/로컬 정리
      try {
        clearUser();
        setStarLst([]);
        setFollowUser([]);
        setFollowCompany([]);
        clearSocialLoginInfo();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } catch {}
    } finally {
      navigate('/', { replace: true });
    }
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
        {/* 왼쪽: 프로필 */}
        <div className="flex items-start space-x-4">
          <img
            src={getProfileImage(isCompany ? companyData?.companyProfileUrl : memberData?.memberProfileUrl)}
            alt="profile"
            className="w-20 h-20 ms-4 rounded-full object-contain"
            onError={(e) => {
              const img = (e.target as HTMLImageElement);
              img.src = getSafeProfileUrl(null); // 안전 폴백
            }}
          />

          <div className="flex-1">
            <div className="flex items-center mt-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {isCompany ? companyData?.name : memberData?.nickname}
              </h1>

              {/* 개인 대표배지 */}
              {!isCompany && repBadgeUrl && (
                <img src={repBadgeUrl} alt="대표 배지" className="w-8 h-8 rounded-md ml-1" />
              )}

              {/* 기업 라벨 */}
              {isCompany && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-0.5 rounded-md ml-3">
                  기업
                </span>
              )}
            </div>

            {/* 개인 링크 */}
            {!isCompany && (
              <div className="flex space-x-6 mt-6">
                {memberData?.blogUrl && (
                  <a
                    href={memberData.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    title="블로그로 이동 (새 탭)"
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
                    title="GitHub로 이동 (새 탭)"
                  >
                    <img src={GitHub} alt="github" className="w-4 h-4 mr-2" />
                    깃허브
                  </a>
                )}
              </div>
            )}

            {/* 기업 링크 */}
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
                      title="기업 블로그로 이동 (새 탭)"
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
