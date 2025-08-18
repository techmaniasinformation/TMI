import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
export default function WithdrawalConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  onSuccess,
  loading = false,
  errorMessage = ''
}) {
  const navigate = useNavigate();
  const {
    user,
    clearUser,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo
  } = useUserStore();
  if (!isOpen) return null;
  const bestEffortLogout = async () => {
    try {
      if (user?.memberId && user.memberId > 0) {
        await fetch(`https://i13a509.p.ssafy.io/api/v1/auth/logout/${user.memberId}`, {
          method: 'POST',
          credentials: 'include'
        }).catch(() => null);
      }
    } catch {}
    try {
      clearUser();
      setFollowUser([]);
      setFollowCompany([]);
      clearSocialLoginInfo();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch {}
  };
  const handleConfirmClick = async () => {
    if (loading) return;
    try {
      // 1) 실제 탈퇴 API
      await Promise.resolve(onConfirm());
      // 2) 로그아웃 + 상태 정리
      await bestEffortLogout();

      // 3) 성공 알림: 부모 콜백이 있으면 완료 모달 띄우고, 없으면 바로 이동
      if (onSuccess) {
        onSuccess(); // ✅ 부모가 완료 모달 열도록
      } else {
        navigate('/', {
          replace: true
        });
      }
    } catch {
      /* 에러 표시/처리는 부모가 errorMessage로 내려줌 */
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-light-header dark:bg-dark-header rounded-lg shadow-lg w-[512px] h-[220px] px-6 pt-6 relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    className: "absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
    disabled: loading,
    "aria-label": "\uB2EB\uAE30"
  }, "\xD7"), /*#__PURE__*/React.createElement("div", {
    className: "mt-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center text-gray-800 dark:text-white mb-12"
  }, /*#__PURE__*/React.createElement("p", null, "\uD0C8\uD1F4 \uC2DC \uBAA8\uB4E0 \uC815\uBCF4\uAC00 \uC601\uAD6C \uC0AD\uC81C\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("p", {
    className: "mt-3"
  }, "\uC9C4\uD589\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?")), errorMessage && /*#__PURE__*/React.createElement("p", {
    role: "alert",
    className: "text-center text-sm text-red-600 dark:text-red-400 mb-2"
  }, errorMessage), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    disabled: loading,
    className: `px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement("button", {
    onClick: handleConfirmClick,
    disabled: loading,
    className: `px-4 py-2 bg-red-500 text-white rounded-md ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`
  }, loading ? '처리 중…' : '탈퇴')))));
}