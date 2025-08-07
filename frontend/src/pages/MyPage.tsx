import React, { useState, useEffect } from 'react';
import ProfileHeader from '@/components/layout/mypage/ProfileHeader';
import MyPageTabs from '@/components/layout/mypage/MypageTabs';
import ProfileEditModal from '@/components/layout/mypage/ProfileEditModal';

// API & 타입 불러오기
import { getCompany } from '@/api/company/company';
import type { Company } from '@/types/company/company';

import { useParams } from 'react-router-dom';

interface MyPageProps {
  isCompany: boolean;
  isMyPage: boolean;
}

interface UserStats {
  posts: number;
  comments: number;
  followers: number;
  likes: number;
  views: number;
  bugReports: number;
  tagCounts: {
    SPRING: number;
    REACT: number;
    AI: number;
    DB: number;
    AWS: number;
  };
  hasFirstPost: boolean;
  hasFirstComment: boolean;
  isRegistered: boolean;
}

const MyPage: React.FC<MyPageProps> = ({ isCompany, isMyPage }) => {

  const { id } = useParams();
  const companyId = Number(id);

  // 진입 시 탭 설정: 본인 -> profile / 기업 -> posts / 타인 -> profile
  const getInitialTab = () => {
    if (isMyPage) return 'profile';
    if (isCompany) return 'posts';
    return 'profile'; // 타인
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleProfileSave = (newNickname: string, newBlogUrl: string, newGithubUrl?: string) => {
    console.log('프로필 저장:', newNickname, newBlogUrl, newGithubUrl);
  };

  const [userStats] = useState<UserStats>({
    posts: 15,
    comments: 42,
    followers: 128,
    likes: 256,
    views: 3200,
    bugReports: 5,
    tagCounts: {
      SPRING: 12,
      REACT: 8,
      AI: 4,
      DB: 15,
      AWS: 11,
    },
    hasFirstPost: true,
    hasFirstComment: true,
    isRegistered: true,
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const handleFollowToggle = () => setIsFollowing((prev) => !prev);

  // 기업 데이터 상태
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  // 기업 데이터 호출
  useEffect(() => {
    if (isCompany) {
      setLoading(true);
      getCompany(companyId) // company 고정
        .then((res) => setCompany(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isCompany]);

  return (
    <div className="max-w-[1232px] mx-auto px-4 py-8">
      <div className="max-w-[1232px] mx-auto">
        <ProfileHeader
          isCompany={isCompany}
          isMyPage={isMyPage}
          lastUpdate={
            isCompany
              ? company?.lastUpdatedAt
                ? company.lastUpdatedAt.split("T")[0] // 날짜만 추출
                : ''
              : '2025-07-30'
          }
          onFollowToggle={handleFollowToggle}
          isFollowing={isFollowing}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        <MyPageTabs
          isCompany={isCompany}
          isMyPage={isMyPage}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userStats={userStats}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {isMyPage && (
          <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            initialNickname="" // API에서 가져오기 때문에 빈 값
            initialBlogUrl=""
            initialGithubUrl=""
            onSave={handleProfileSave}
          />
        )}
      </div>
    </div>
  );
};

export default MyPage;
