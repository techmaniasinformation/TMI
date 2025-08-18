import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Card, CardContent } from '@/components/domain/Card';
import { getSafeProfileUrl, getSafeCompanyUrl } from '@/utils/defaultImages';
export const FollowSection = ({
  onFollowClick
}) => {
  const {
    followUser,
    followCompany
  } = useUserStore();
  const [followUsers, setFollowUsers] = useState([]);
  const [followCompanies, setFollowCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 팔로우한 사용자 정보 가져오기
  useEffect(() => {
    const fetchFollowUsers = async () => {
      if (followUser.length === 0) {
        setFollowUsers([]);
        return;
      }
      try {
        const userPromises = followUser.map(async userId => {
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
        const users = (await Promise.all(userPromises)).filter(user => user !== null);
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
        const companyPromises = followCompany.map(async companyId => {
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
        const companies = (await Promise.all(companyPromises)).filter(company => company !== null);
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
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "animate-pulse"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-4 bg-gray-200 rounded w-1/4 mb-4"
    }), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    }, [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "h-24 bg-gray-200 rounded"
    })))));
  }
  const hasFollows = followUsers.length > 0 || followCompanies.length > 0;
  if (!hasFollows) {
    return /*#__PURE__*/React.createElement("div", {
      className: "text-center py-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-6"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-users text-6xl text-gray-300 mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-semibold text-gray-600 mb-2"
    }, "\uD314\uB85C\uC6B0\uD55C \uC0AC\uC6A9\uC790\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-500 mb-4"
    }, "\uC0AC\uC6A9\uC790\uB098 \uAE30\uC5C5\uC744 \uD314\uB85C\uC6B0\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, followUsers.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-gray-900 mb-4"
  }, "\uD314\uB85C\uC6B0\uD55C \uC0AC\uC6A9\uC790"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  }, followUsers.map(user => /*#__PURE__*/React.createElement(Card, {
    key: user.memberId,
    className: "cursor-pointer hover:shadow-lg transition-shadow",
    onClick: () => onFollowClick('user', user.memberId)
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 mx-auto mb-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: getSafeProfileUrl(user.memberProfileUrl),
    alt: user.nickname,
    className: "w-full h-full rounded-full object-cover"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "font-medium text-gray-900 truncate"
  }, user.nickname), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500"
  }, "\uC0AC\uC6A9\uC790")))))), followCompanies.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-gray-900 mb-4"
  }, "\uD314\uB85C\uC6B0\uD55C \uAE30\uC5C5"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  }, followCompanies.map(company => /*#__PURE__*/React.createElement(Card, {
    key: company.companyId,
    className: "cursor-pointer hover:shadow-lg transition-shadow",
    onClick: () => onFollowClick('company', company.companyId)
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 mx-auto mb-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: getSafeCompanyUrl(company.companyProfileUrl),
    alt: company.companyName,
    className: "w-full h-full rounded-full object-cover"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "font-medium text-gray-900 truncate"
  }, company.companyName), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500"
  }, "\uAE30\uC5C5")))))));
};