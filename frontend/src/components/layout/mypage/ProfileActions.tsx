import React from 'react';
import type { MemberData } from '@/types/mypage/member';
import type { Company } from '@/types/company/company';

import UserStatsCard from './UserStatsCard';
import Follow from '@/assets/icons/Follow.svg';
import ArticleFix from '@/assets/icons/articlefix.svg';
import UserDelete from '@/assets/icons/userdelete.svg';

interface ProfileActionsProps {
  isCompany: boolean;
  isMyPage: boolean;
  isFollowing: boolean;
  memberData: MemberData | null;
  companyData: Company | null;
  withdrawing: boolean;
  onFollowToggle: () => void;
  onEditClick: () => void;
  onWithdrawalClick: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isCompany,
  isMyPage,
  isFollowing,
  memberData,
  companyData,
  withdrawing,
  onFollowToggle,
  onEditClick,
  onWithdrawalClick,
}) => {
  return (
    <div className="flex flex-col items-start md:items-end gap-4">
      <UserStatsCard
        posts={isCompany ? companyData?.stats.postCount ?? 0 : memberData?.memberStats.postCount ?? 0}
        comments={isCompany ? 0 : memberData?.memberStats.commentCount ?? 0}
        followers={isCompany ? companyData?.stats.followerCount ?? 0 : memberData?.memberStats.followerCount ?? 0}
        views={isCompany ? companyData?.stats.totalViewCount ?? 0 : memberData?.memberStats.totalViewCount ?? 0}
        isCompany={isCompany}
      />
      {isMyPage && !isCompany ? (
        <div className="flex flex-wrap gap-2">
          <button
            className="w-[132px] bg-prime-btn text-white text-sm rounded-md py-2 px-3 hover:bg-prime-btn-hover flex items-center justify-center"
            onClick={onEditClick}
          >
            <img src={ArticleFix} alt="edit icon" className="w-4 h-4 mr-2" />
            프로필 수정
          </button>
          <button
            onClick={onWithdrawalClick}
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
  );
};

export default ProfileActions;
