import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

interface WithdrawalConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;  // 탈퇴 API 실행 (부모)
  onSuccess?: () => void;                  // 완료 모달 띄우기용 콜백(부모)
  loading?: boolean;
  errorMessage?: string;
}

export default function WithdrawalConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  onSuccess,
  loading = false,
  errorMessage = '',
}: WithdrawalConfirmModalProps) {
  const navigate = useNavigate();
  const {
    memberId, clearUser, setMemberId, setStarLst, setFollowUser, setFollowCompany, clearSocialLoginInfo,
  } = useUserStore();

  if (!isOpen) return null;

  const bestEffortLogout = async () => {
    try {
      if (memberId && memberId > 0) {
        await fetch(`https://i13a509.p.ssafy.io/api/v1/auth/logout/${memberId}`, {
          method: 'POST',
          credentials: 'include',
        }).catch(() => null);
      }
    } catch {}
    try {
      setMemberId(-1);
      clearUser();
      setStarLst([]);
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
        onSuccess();         // ✅ 부모가 완료 모달 열도록
      } else {
        navigate('/', { replace: true });
      }
    } catch {
      /* 에러 표시/처리는 부모가 errorMessage로 내려줌 */
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[512px] h-[220px] px-6 pt-6 relative">
        <button onClick={onCancel} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" disabled={loading} aria-label="닫기">
          &times;
        </button>
        <div className="pt-4">
          <p className="text-center text-gray-800 mb-4">
            탈퇴 후 7일 이내 재가입이 불가합니다. 정말 탈퇴하시겠습니까?
          </p>

          {errorMessage && (
            <p role="alert" className="text-center text-sm text-red-600 mb-2">{errorMessage}</p>
          )}

          <div className="flex justify-end space-x-2">
            <button onClick={onCancel} disabled={loading} className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
              취소
            </button>
            <button onClick={handleConfirmClick} disabled={loading} className={`px-4 py-2 bg-red-500 text-white rounded-md ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`}>
              {loading ? '처리 중…' : '탈퇴'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
