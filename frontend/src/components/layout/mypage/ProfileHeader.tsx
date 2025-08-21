import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ProfileInfo from './ProfileInfo';
import ProfileActions from './ProfileActions';
import { useProfileHeader } from '@/hooks/mypage/useProfileHeader';
import { useApiActions } from '@/hooks/api/useApiActions';
import { WithdrawalConfirmModal, WithdrawalCompleteModal } from '@/components/foundation/Modal';

import type { MemberData } from '@/types/mypage/member';
import type { Company } from '@/types/company/company';

import { useAuth, useUserActions, useSocialAuth } from '@/hooks/store/useStoreActions';

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

  const { user } = useAuth();
  const { clearUser, setFollowUser, setFollowCompany } = useUserActions();
  const { clearSocialLoginInfo } = useSocialAuth();

  const myId = user?.memberId ?? null;

  // 내 페이지면 내 id, 아니면 URL id
  const targetId = isMyPage && myId && myId > 0 ? myId : routeId;

  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [showWithdrawalComplete, setShowWithdrawalComplete] = useState(false);

  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // 프로필 데이터 불러오기
  const { memberData, companyData, loading } = useProfileHeader({
    targetId,
    isCompany,
    refreshKey,
  });

  // API 액션 훅
  const { member } = useApiActions({
    onSuccess: () => {
      setShowWithdrawalConfirm(false);
      setShowWithdrawalComplete(true);
    },
    onError: (error) => {
      setWithdrawError(error.message);
    },
  });

  // 회원 탈퇴 클릭
  const handleWithdrawalClick = () => {
    setWithdrawError(null);
    setShowWithdrawalConfirm(true);
  };

  // 회원 탈퇴 확정
  const handleWithdrawalConfirm = async () => {
    if (!targetId || Number.isNaN(targetId) || targetId <= 0) return;
    setWithdrawError(null);
    await member.deleteMember(targetId);
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
    <div className="w-full max-w-[1232px] mx-auto bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        {/* 왼쪽: 프로필 정보 */}
        <ProfileInfo
          isCompany={isCompany}
          memberData={memberData}
          companyData={companyData}
          repBadgeUrl={repBadgeUrl}
          lastUpdate={lastUpdate}
        />

        {/* 오른쪽: 액션 버튼들 */}
        <ProfileActions
          isCompany={isCompany}
          isMyPage={isMyPage}
          isFollowing={isFollowing}
          memberData={memberData}
          companyData={companyData}
                     withdrawing={member.loading}
          onFollowToggle={onFollowToggle}
          onEditClick={onEditClick}
          onWithdrawalClick={handleWithdrawalClick}
        />
      </div>

      {/* 모달 */}
      <WithdrawalConfirmModal
        isOpen={showWithdrawalConfirm}
        onClose={() => setShowWithdrawalConfirm(false)}
        onConfirm={handleWithdrawalConfirm}
                 loading={member.loading}
        errorMessage={withdrawError ?? ''}
      />
             <WithdrawalCompleteModal
         isOpen={showWithdrawalComplete}
         onClose={handleWithdrawalComplete}
       />
    </div>
  );
}
