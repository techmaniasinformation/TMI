import { useState, useEffect } from 'react';
import { getCompanyFollows, getMemberFollows } from '@/api/followService';

export function useFollowManagement(
  isMyPage: boolean,
  isPersonal: boolean,
  memberId: number
) {
  const [followSubTab, setFollowSubTab] = useState<'company' | 'user'>('company');
  
  // 기업 팔로우
  const [followedCompanies, setFollowedCompanies] = useState<any[]>([]);
  const [totalCompanyPages, setTotalCompanyPages] = useState(1);
  const [currentCompanyPage, setCurrentCompanyPage] = useState(1);
  const [companyTotalElements, setCompanyTotalElements] = useState(0);

  // 사용자 팔로우
  const [followedUsers, setFollowedUsers] = useState<any[]>([]);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [userTotalElements, setUserTotalElements] = useState(0);

  // 기업 팔로우 로드
  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      getCompanyFollows(memberId, currentCompanyPage - 1, 9)
        .then((res) => {
          setFollowedCompanies(res.data.companyFollows);
          setTotalCompanyPages(res.data.pageInfo.totalPages);
          setCompanyTotalElements(res.data.pageInfo.totalElements);
        })
        .catch(console.error);
    }
  }, [isMyPage, isPersonal, memberId, currentCompanyPage]);

  // 사용자 팔로우 로드
  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      getMemberFollows(memberId, currentUserPage - 1, 9)
        .then((res) => {
          setFollowedUsers(res.data.memberFollows);
          setTotalUserPages(res.data.pageInfo.totalPages);
          setUserTotalElements(res.data.pageInfo.totalElements);
        })
        .catch(console.error);
    }
  }, [isMyPage, isPersonal, memberId, currentUserPage]);

  return {
    followSubTab,
    setFollowSubTab,
    // 기업 팔로우
    followedCompanies,
    totalCompanyPages,
    currentCompanyPage,
    companyTotalElements,
    setCurrentCompanyPage,
    // 사용자 팔로우
    followedUsers,
    totalUserPages,
    currentUserPage,
    userTotalElements,
    setCurrentUserPage,
  };
}
