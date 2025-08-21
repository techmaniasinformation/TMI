import React from 'react';
import { TabsContent } from "@/components/domain/Tabs";
import { FollowCard } from '@/components/layout/mypage/FollowCard';
import ServerPagination from '@/components/domain/ServerPagination';
import type { Badge } from "@/types/mypage/badge";

interface FollowTabContentProps {
  followSubTab: 'company' | 'user';
  setFollowSubTab: React.Dispatch<React.SetStateAction<'company' | 'user'>>;
  followedCompanies: any[];
  followedUsers: any[];
  totalCompanyPages: number;
  totalUserPages: number;
  currentCompanyPage: number;
  currentUserPage: number;
  companyTotalElements: number;
  userTotalElements: number;
  setCurrentCompanyPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentUserPage: React.Dispatch<React.SetStateAction<number>>;
  allBadges: Badge[];
  getBadgeNameByUrl: (all: Badge[], url?: string | null) => string | undefined;
}

const FollowTabContent: React.FC<FollowTabContentProps> = ({
  followSubTab,
  setFollowSubTab,
  followedCompanies,
  followedUsers,
  totalCompanyPages,
  totalUserPages,
  currentCompanyPage,
  currentUserPage,
  companyTotalElements,
  userTotalElements,
  setCurrentCompanyPage,
  setCurrentUserPage,
  allBadges,
  getBadgeNameByUrl,
}) => {
  return (
    <TabsContent value="follow" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => {
            setFollowSubTab('company');
            setCurrentCompanyPage(1);
          }}
          className={`px-4 py-1.5 text-sm rounded-md transition ${
            followSubTab === 'company' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
          }`}
        >
          기업 ({companyTotalElements})
        </button>
        <button
          onClick={() => {
            setFollowSubTab('user');
            setCurrentUserPage(1);
          }}
          className={`px-4 py-1.5 text-sm rounded-md transition ${
            followSubTab === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
          }`}
        >
          개인 ({userTotalElements})
        </button>
      </div>

      {followSubTab === 'company' && (
        <>
          {followedCompanies.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">팔로우한 기업이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full">
              {followedCompanies.map((company) => (
                                 <FollowCard
                   key={company.companyFollowId}
                   type="company"
                   id={company.companyId}
                   name={company.name}
                   image={company.companyProfileUrl}
                   onClick={() => window.location.href = `/company/${company.companyId}`}
                 />
              ))}
            </div>
          )}
          {totalCompanyPages > 1 && (
            <ServerPagination
              currentPage={currentCompanyPage}
              totalCount={companyTotalElements}
              pageSize={9}
              onPageChange={setCurrentCompanyPage}
            />
          )}
        </>
      )}

      {followSubTab === 'user' && (
        <>
          {followedUsers.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">팔로우한 유저가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 w-full max-w-full">
              {followedUsers.map((user) => (
                                 <FollowCard
                   key={user.memberFollowId}
                   type="user"
                   id={user.memberId}
                   name={user.nickname}
                   image={user.memberProfileUrl}
                   badgeName={getBadgeNameByUrl(allBadges, user.badgeUrl)}
                   onClick={() => window.location.href = `/member/${user.memberId}`}
                 />
              ))}
            </div>
          )}
          {totalUserPages > 1 && (
            <ServerPagination
              currentPage={currentUserPage}
              totalCount={userTotalElements}
              pageSize={9}
              onPageChange={setCurrentUserPage}
            />
          )}
        </>
      )}
    </TabsContent>
  );
};

export default FollowTabContent;
