import React from 'react';
import { getSafeProfileUrl } from '@/utils/defaultImages';
import type { MemberData } from '@/types/mypage/member';
import type { Company } from '@/types/company/company';

import Blog from '@/assets/icons/blog.svg';
import GitHub from '@/assets/icons/Github.svg';
import Update from '@/assets/icons/Update.svg';

interface ProfileInfoProps {
  isCompany: boolean;
  memberData: MemberData | null;
  companyData: Company | null;
  repBadgeUrl?: string | null;
  lastUpdate: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  isCompany,
  memberData,
  companyData,
  repBadgeUrl,
  lastUpdate,
}) => {
  const getProfileImage = (url: string | null | undefined) => getSafeProfileUrl(url);

  return (
    <div className="flex items-start space-x-4">
      <img
        src={getProfileImage(isCompany ? companyData?.companyProfileUrl : memberData?.memberProfileUrl)}
        alt="profile"
        className="w-20 h-20 rounded-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/default-profile.png';
        }}
      />
      <div className="flex-1">
        {/* 이름 + 배지 */}
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isCompany ? companyData?.name : memberData?.nickname}
          </h1>
          {!isCompany && repBadgeUrl && (
            <img
              key={repBadgeUrl}
              src={repBadgeUrl}
              alt="대표 배지"
              className="w-8 h-8 rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getSafeProfileUrl(null);
              }}
            />
          )}
          {isCompany && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium px-2 py-0.5 rounded-md">
              기업
            </span>
          )}
        </div>

        {/* 블로그 / 깃허브 */}
        {!isCompany && (
          <div className="flex flex-wrap gap-4 mt-4">
            {memberData?.blogUrl && (
              <a href={memberData.blogUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <img src={Blog} alt="blog" className="w-4 h-4 mr-2" />
                블로그
              </a>
            )}
            {memberData?.githubUrl && (
              <a href={memberData.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <img src={GitHub} alt="github" className="w-4 h-4 mr-2" />
                깃허브
              </a>
            )}
          </div>
        )}

        {/* 기업 정보 */}
        {isCompany && (
          <>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <img src={Update} alt="update icon" className="w-4 h-4 mr-2" />
              최근 업데이트: {lastUpdate}
            </div>
            {companyData?.techBlogUrl && (
              <div className="flex items-center mt-4">
                <a
                  href={companyData.techBlogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
  );
};

export default ProfileInfo;
