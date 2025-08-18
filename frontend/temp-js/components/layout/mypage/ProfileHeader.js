import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserStatsCard from './UserStatsCard';
import { fetchMemberProfile, deleteMember } from '@/api/mypage/memberSevice';
import { getCompany } from '@/api/company/company';
import GitHub from '@/assets/icons/Github.svg';
import Blog from '@/assets/icons/blog.svg';
import Follow from '@/assets/icons/Follow.svg';
import ArticleFix from '@/assets/icons/articlefix.svg';
import UserDelete from '@/assets/icons/userdelete.svg';
import Update from '@/assets/icons/Update.svg';
import { getSafeProfileUrl } from '@/utils/defaultImages';
import WithdrawalConfirmModal from '@/components/layout/mypage/WithdrawalConfirmModal';
import WithdrawalCompleteModal from '@/components/layout/mypage/WithdrawalCompleteModal';
import { useUserStore } from '@/stores/userStore';
export default function ProfileHeader({
  isFollowing,
  isCompany,
  isMyPage,
  lastUpdate,
  onFollowToggle,
  onEditClick,
  repBadgeUrl,
  refreshKey = 0
}) {
  const {
    id
  } = useParams();
  const routeId = Number(id);
  const navigate = useNavigate();
  const {
    user,
    clearUser,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo
  } = useUserStore();
  const myId = user?.memberId ?? null;

  // 내 페이지면 내 id, 아니면 URL id
  const targetId = isMyPage && myId && myId > 0 ? myId : routeId;
  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [showWithdrawalComplete, setShowWithdrawalComplete] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);

  // 프로필 데이터 불러오기
  useEffect(() => {
    if (!targetId || Number.isNaN(targetId) || targetId <= 0) return;
    let ignore = false;
    async function loadProfile() {
      setLoading(true);
      try {
        if (isCompany) {
          const res = await getCompany(targetId);
          if (!ignore) setCompanyData(res.data);
        } else {
          const data = await fetchMemberProfile(targetId);
          if (!ignore) setMemberData(data);
        }
      } catch (err) {
        console.error('프로필 정보 조회 실패:', err);
        if (!ignore) {
          setMemberData(null);
          setCompanyData(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      ignore = true;
    };
  }, [isCompany, targetId, refreshKey]);
  const getProfileImage = url => getSafeProfileUrl(url);

  // 회원 탈퇴 클릭
  const handleWithdrawalClick = () => {
    setWithdrawError(null);
    setShowWithdrawalConfirm(true);
  };

  // 회원 탈퇴 확정
  const handleWithdrawalConfirm = async () => {
    if (!targetId || Number.isNaN(targetId) || targetId <= 0) return;
    setWithdrawing(true);
    setWithdrawError(null);
    try {
      await deleteMember(targetId);
      setShowWithdrawalConfirm(false);
      setShowWithdrawalComplete(true);
    } catch (e) {
      setWithdrawError(e?.message || '회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setWithdrawing(false);
    }
  };

  // 회원 탈퇴 완료 후 로그아웃 처리
  const handleWithdrawalComplete = async () => {
    try {
      const idForLogout = myId || targetId;
      if (idForLogout && idForLogout > 0) {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 3000);
        await fetch(`https://i13a509.p.ssafy.io/api/v1/auth/logout/${idForLogout}`, {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal
        }).catch(() => null);
        clearTimeout(t);
      }
      clearUser();
      setFollowUser([]);
      setFollowCompany([]);
      clearSocialLoginInfo();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      navigate('/', {
        replace: true
      });
    }
  };

  // 로딩 중
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "w-[1232px] h-[150px] bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-gray-500 dark:text-gray-400"
    }, "\uBD88\uB7EC\uC624\uB294 \uC911..."));
  }

  // 데이터 없을 때
  if (isCompany && !companyData || !isCompany && !memberData) {
    return /*#__PURE__*/React.createElement("div", {
      className: "w-[1232px] h-[150px] bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-red-500 dark:text-red-400"
    }, "\uD504\uB85C\uD544 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-[1232px] mx-auto bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row md:justify-between md:items-start gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-4"
  }, /*#__PURE__*/React.createElement("img", {
    src: getProfileImage(isCompany ? companyData?.companyProfileUrl : memberData?.memberProfileUrl),
    alt: "profile",
    className: "w-20 h-20 rounded-full object-cover",
    onError: e => {
      e.currentTarget.src = '/default-profile.png';
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center flex-wrap gap-2 mt-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold text-gray-900 dark:text-white"
  }, isCompany ? companyData?.name : memberData?.nickname), !isCompany && repBadgeUrl && /*#__PURE__*/React.createElement("img", {
    key: repBadgeUrl,
    src: repBadgeUrl,
    alt: "\uB300\uD45C \uBC30\uC9C0",
    className: "w-8 h-8 rounded-md",
    onError: e => {
      e.target.src = getSafeProfileUrl(null);
    }
  }), isCompany && /*#__PURE__*/React.createElement("span", {
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium px-2 py-0.5 rounded-md"
  }, "\uAE30\uC5C5")), !isCompany && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-4 mt-4"
  }, memberData?.blogUrl && /*#__PURE__*/React.createElement("a", {
    href: memberData.blogUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
  }, /*#__PURE__*/React.createElement("img", {
    src: Blog,
    alt: "blog",
    className: "w-4 h-4 mr-2"
  }), "\uBE14\uB85C\uADF8"), memberData?.githubUrl && /*#__PURE__*/React.createElement("a", {
    href: memberData.githubUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
  }, /*#__PURE__*/React.createElement("img", {
    src: GitHub,
    alt: "github",
    className: "w-4 h-4 mr-2"
  }), "\uAE43\uD5C8\uBE0C")), isCompany && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1"
  }, /*#__PURE__*/React.createElement("img", {
    src: Update,
    alt: "update icon",
    className: "w-4 h-4 mr-2"
  }), "\uCD5C\uADFC \uC5C5\uB370\uC774\uD2B8: ", lastUpdate), companyData?.techBlogUrl && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center mt-4"
  }, /*#__PURE__*/React.createElement("a", {
    href: companyData.techBlogUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
  }, /*#__PURE__*/React.createElement("img", {
    src: Blog,
    alt: "blog",
    className: "w-4 h-4 mr-2"
  }), "\uBE14\uB85C\uADF8"))))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-start md:items-end gap-4"
  }, /*#__PURE__*/React.createElement(UserStatsCard, {
    posts: isCompany ? companyData?.stats.postCount ?? 0 : memberData?.memberStats.postCount ?? 0,
    comments: isCompany ? 0 : memberData?.memberStats.commentCount ?? 0,
    followers: isCompany ? companyData?.stats.followerCount ?? 0 : memberData?.memberStats.followerCount ?? 0,
    views: isCompany ? companyData?.stats.totalViewCount ?? 0 : memberData?.memberStats.totalViewCount ?? 0,
    isCompany: isCompany
  }), isMyPage && !isCompany ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "w-[132px] bg-prime-btn text-white text-sm rounded-md py-2 px-3 hover:bg-prime-btn-hover flex items-center justify-center",
    onClick: onEditClick
  }, /*#__PURE__*/React.createElement("img", {
    src: ArticleFix,
    alt: "edit icon",
    className: "w-4 h-4 mr-2"
  }), "\uD504\uB85C\uD544 \uC218\uC815"), /*#__PURE__*/React.createElement("button", {
    onClick: handleWithdrawalClick,
    disabled: withdrawing,
    className: `w-[120px] bg-red-500 text-white text-sm rounded-md py-2 px-3 flex items-center justify-center
                  ${withdrawing ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`
  }, /*#__PURE__*/React.createElement("img", {
    src: UserDelete,
    alt: "delete icon",
    className: "w-4 h-4 mr-2"
  }), withdrawing ? '처리 중...' : '회원 탈퇴')) : /*#__PURE__*/React.createElement("button", {
    onClick: onFollowToggle,
    className: `w-[120px] text-white text-sm rounded-md py-2 px-3 flex items-center justify-center
                ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-prime-btn hover:bg-prime-btn-hover'}`
  }, /*#__PURE__*/React.createElement("img", {
    src: Follow,
    alt: "follow icon",
    className: "w-4 h-4 mr-2"
  }), isFollowing ? '언팔로우' : '팔로우'))), /*#__PURE__*/React.createElement(WithdrawalConfirmModal, {
    isOpen: showWithdrawalConfirm,
    onCancel: () => setShowWithdrawalConfirm(false),
    onConfirm: handleWithdrawalConfirm,
    loading: withdrawing,
    errorMessage: withdrawError ?? ''
  }), /*#__PURE__*/React.createElement(WithdrawalCompleteModal, {
    isOpen: showWithdrawalComplete,
    onConfirm: handleWithdrawalComplete
  }));
}