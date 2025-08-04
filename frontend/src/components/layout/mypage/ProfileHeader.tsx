import React, { useState } from 'react';
import { Badge } from "@/components/domain/Badge";
import UserStatsCard from './UserStatsCard';

// 아이콘 이미지 import
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

  setNickname: (val: string) => void;
  setBlogUrl: (val: string) => void;
  setGithubUrl: (val: string) => void;
  // 모달 열기 핸들러 (MyPage로부터 props로 전달)
  onEditClick: () => void;
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
  onEditClick, // 외부에서 전달받은 모달 열기 함수
}: ProfileHeaderProps) {
  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [showWithdrawalComplete, setShowWithdrawalComplete] = useState(false);


  // 탈퇴 모달 핸들러
  const handleWithdrawalClick = () => {
    setShowWithdrawalConfirm(true);
  };

  const handleWithdrawalConfirm = () => {
    setShowWithdrawalConfirm(false);
    setShowWithdrawalComplete(true);
    // 실제 탈퇴 API 요청은 이 안에 추가 가능
  };

  const handleWithdrawalComplete = () => {
    window.location.href = '/'; // 또는 원하는 랜딩 페이지
  };

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
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-0.5 rounded-md">
                  기업
                </span>
              )}
            </div>

            {/* 개인 사용자 정보 영역 */}
            {!isCompany && (
              <>
                {email && <p className="text-gray-500 text-sm">{email}</p>}
                <div className="flex space-x-6 mt-4">
                  <a
                    href={blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <img src={Blog} alt="blog" className="w-4 h-4 mr-2" /> 블로그
                  </a>
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <img src={GitHub} alt="github" className="w-4 h-4 mr-2" /> 깃허브
                    </a>
                  )}
                </div>
              </>
            )}

            {/* 기업 프로필 정보 영역 */}
            {isCompany && (
              <>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <img src={Update} alt="update icon" className="w-4 h-4 mr-2" />
                  최근 업데이트: {lastUpdate}
                </div>
                <div className="flex items-center mt-4">
                  <a
                    href={blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <img src={Blog} alt="blog" className="w-4 h-4 mr-2" /> 블로그
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 우측 통계 + 팔로우 버튼 영역 */}
        <div className="flex flex-col items-end justify-between h-full space-y-5">
          {/* 통계 카드 */}
          <UserStatsCard
            posts={postCount}
            comments={commentCount}
            followers={followerCount}
            views={viewCount}
            isCompany={isCompany}
          />

          {isMyPage ? (
            <div className="flex space-x-2">
              <button
                className="w-[132px] bg-prime-btn text-white text-sm rounded-md py-2 px-3 hover:bg-prime-btn-hover flex items-center justify-center"
                onClick={onEditClick} // 부모에서 전달받은 함수 실행
              >
                <img src={ArticleFix} alt="edit icon" className="w-4 h-4 mr-2" />
                프로필 수정
              </button>
              <button onClick={handleWithdrawalClick} className="w-[120px] bg-red-500 text-white text-sm rounded-md py-2 px-3 hover:bg-red-600 flex items-center justify-center">
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

      {/* ✅ 여기에 반드시 포함시켜야 모달이 렌더링됩니다 */}
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
