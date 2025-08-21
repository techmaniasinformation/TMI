import React, { useState, useEffect } from 'react';
import { useFollow } from '@/hooks/store/useStoreActions';
import { ProfileCardGrid } from '@/components/domain/ProfileCard';
import { Loading, Empty } from '@/components/foundation/Status';

interface FollowSectionProps {
  onFollowClick: (type: 'user' | 'company', id: number) => void;
}

interface FollowUser {
  memberId: number;
  nickname: string;
  memberProfileUrl: string;
}

interface FollowCompany {
  companyId: number;
  companyName: string;
  companyProfileUrl: string;
}

export const FollowSection: React.FC<FollowSectionProps> = ({ onFollowClick }) => {
  const { followUser, followCompany } = useFollow();
  const [followUsers, setFollowUsers] = useState<FollowUser[]>([]);
  const [followCompanies, setFollowCompanies] = useState<FollowCompany[]>([]);
  const [loading, setLoading] = useState(true);



  // 팔로우한 사용자 정보 가져오기
  useEffect(() => {
    const fetchFollowUsers = async () => {
      if (followUser.length === 0) {
        setFollowUsers([]);
        return;
      }

      try {
        const userPromises = followUser.map(async (userId) => {
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${userId}`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            return {
              memberId: data.data.memberId,
              nickname: data.data.nickname,
              memberProfileUrl: data.data.memberProfileUrl
            };
          }
          return null;
        });

        const users = (await Promise.all(userPromises)).filter(user => user !== null) as FollowUser[];
        setFollowUsers(users);
      } catch (error) {
        console.error('팔로우한 사용자 정보 가져오기 실패:', error);
        setFollowUsers([]);
      }
    };

    // 팔로우한 기업 정보 가져오기
    const fetchFollowCompanies = async () => {
      if (followCompany.length === 0) {
        setFollowCompanies([]);
        return;
      }

      try {
        const companyPromises = followCompany.map(async (companyId) => {
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/company/${companyId}`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            return {
              companyId: data.data.companyId,
              companyName: data.data.companyName,
              companyProfileUrl: data.data.companyProfileUrl
            };
          }
          return null;
        });

        const companies = (await Promise.all(companyPromises)).filter(company => company !== null) as FollowCompany[];
        setFollowCompanies(companies);
      } catch (error) {
        console.error('팔로우한 기업 정보 가져오기 실패:', error);
        setFollowCompanies([]);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchFollowUsers(), fetchFollowCompanies()]);
      setLoading(false);
    };

    fetchData();
  }, [followUser, followCompany]);

  if (loading) {
    return <Loading message="팔로우 정보를 불러오는 중..." variant="skeleton" />;
  }

  const hasFollows = followUsers.length > 0 || followCompanies.length > 0;

  if (!hasFollows) {
    return (
      <Empty
        emptyTitle="팔로우한 사용자가 없습니다"
        emptyMessage="아직 팔로우한 사용자가 없습니다."
        icon="fas fa-users"
      />
    );
  }

  // 프로필 데이터 변환
  const userProfiles = followUsers.map(user => ({
    id: user.memberId,
    name: user.nickname,
    profileUrl: user.memberProfileUrl,
    type: 'user' as const,
  }));

  const companyProfiles = followCompanies.map(company => ({
    id: company.companyId,
    name: company.companyName,
    profileUrl: company.companyProfileUrl,
    type: 'company' as const,
  }));

  return (
    <div className="space-y-8">
      {/* 팔로우한 사용자 섹션 */}
      {followUsers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">팔로우한 사용자</h2>
          <ProfileCardGrid
            profiles={userProfiles}
            onProfileClick={onFollowClick}
            columns={4}
          />
        </div>
      )}

      {/* 팔로우한 기업 섹션 */}
      {followCompanies.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">팔로우한 기업</h2>
          <ProfileCardGrid
            profiles={companyProfiles}
            onProfileClick={onFollowClick}
            columns={4}
          />
        </div>
      )}
    </div>
  );
};
