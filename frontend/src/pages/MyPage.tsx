import React, { useState, useEffect } from 'react';
import ProfileHeader from '@/components/layout/mypage/ProfileHeader';
import MyPageTabs from '@/components/layout/mypage/MypageTabs';
import ProfileEditModal from '@/components/layout/mypage/ProfileEditModal';

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
  // 진입 시 탭 설정: 본인 -> profile / 기업 -> posts / 타인 -> profile
  const getInitialTab = () => {
    if (isMyPage) return 'profile';
    if (isCompany) return 'posts';
    return 'profile'; // 타인
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [currentPage, setCurrentPage] = useState(1);

  const [nickname, setNickname] = useState('NAVER');
  const [email] = useState('user@example.com');
  const [blogUrl, setBlogUrl] = useState('https://blog.example.com');
  const [githubUrl, setGithubUrl] = useState('https://github.com/example');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleProfileSave = (newNickname: string, newBlogUrl: string, newGithubUrl?: string) => {
    setNickname(newNickname);
    setBlogUrl(newBlogUrl);
    setGithubUrl(newGithubUrl || '');
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

  return (
    <div className="max-w-[1232px] mx-auto px-4 py-8">
      <div className="max-w-[1232px] mx-auto">
        <ProfileHeader
          nickname={nickname}
          email={email}
          githubUrl={githubUrl}
          blogUrl={blogUrl}
          isCompany={isCompany}
          isMyPage={isMyPage}
          lastUpdate="2025-07-30"
          postCount={userStats.posts}
          commentCount={userStats.comments}
          followerCount={userStats.followers}
          viewCount={userStats.views}
          onFollowToggle={handleFollowToggle}
          isFollowing={isFollowing}
          setNickname={setNickname}
          setBlogUrl={setBlogUrl}
          setGithubUrl={setGithubUrl}
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
            initialNickname={nickname}
            initialBlogUrl={blogUrl}
            initialGithubUrl={githubUrl}
            onSave={handleProfileSave}
          />
        )}


      </div>
    </div>
  );
};

export default MyPage;
