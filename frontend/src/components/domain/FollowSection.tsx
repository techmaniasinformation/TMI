import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Card, CardContent } from '@/components/domain/Card';
import { getSafeProfileUrl, getSafeCompanyUrl } from '@/utils/defaultImages';

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
  const { followUser, followCompany } = useUserStore();
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
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasFollows = followUsers.length > 0 || followCompanies.length > 0;

  if (!hasFollows) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <i className="fas fa-users text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">팔로우한 사용자가 없습니다</h3>
          <p className="text-gray-500 mb-4">사용자나 기업을 팔로우하면 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 팔로우한 사용자 섹션 */}
      {followUsers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">팔로우한 사용자</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {followUsers.map((user) => (
              <Card 
                key={user.memberId}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onFollowClick('user', user.memberId)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 mx-auto mb-3">
                    <img
                      src={getSafeProfileUrl(user.memberProfileUrl)}
                      alt={user.nickname}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 truncate">{user.nickname}</h3>
                  <p className="text-sm text-gray-500">사용자</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 팔로우한 기업 섹션 */}
      {followCompanies.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">팔로우한 기업</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {followCompanies.map((company) => (
              <Card 
                key={company.companyId}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onFollowClick('company', company.companyId)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 mx-auto mb-3">
                    <img
                      src={getSafeCompanyUrl(company.companyProfileUrl)}
                      alt={company.companyName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 truncate">{company.companyName}</h3>
                  <p className="text-sm text-gray-500">기업</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
