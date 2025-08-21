// API 관련 모든 액션들을 관리하는 통합 훅
import { useState } from 'react';
import { deleteMember } from '@/api/mypage/memberService';
import { patchRepresentativeBadge, DEFAULT_BADGE_ID } from '@/api/mypage/badgeService';

// ===== 회원 관련 API 훅 =====
interface UseMemberActionsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useMemberActions({ onSuccess, onError }: UseMemberActionsProps = {}) {
  const [loading, setLoading] = useState(false);

  const handleDeleteMember = async (memberId: number) => {
    setLoading(true);
    try {
      await deleteMember(memberId);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원 탈퇴 중 오류가 발생했습니다.';
      onError?.(new Error(errorMessage));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteMember: handleDeleteMember,
    loading,
  };
}

// ===== 배지 관련 API 훅 =====
interface UseBadgeActionsProps {
  onRefetch?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useBadgeActions({ onRefetch, onSuccess, onError }: UseBadgeActionsProps = {}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSetRepresentative = async (memberBadgeId: number) => {
    setSubmitting(true);
    try {
      await patchRepresentativeBadge(memberBadgeId);
      if (onRefetch) {
        await onRefetch();
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '대표 배지 설정 실패';
      onError?.(new Error(errorMessage));
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRepresentative = async (
    memberBadgeId: number | null,
    allMemberBadges: { badgeId: number; memberBadgeId: number }[],
    isCurrentlyRepresentative: boolean
  ) => {
    setSubmitting(true);
    try {
      if (isCurrentlyRepresentative) {
        // 해제: 기본 배지(22)의 memberBadgeId로 다시 설정
        const defaultId = allMemberBadges.find(mb => mb.badgeId === DEFAULT_BADGE_ID)?.memberBadgeId;
        if (!defaultId) {
          throw new Error('기본 배지를 찾을 수 없습니다.');
        }
        await patchRepresentativeBadge(defaultId);
      } else {
        // 설정: 선택 배지의 memberBadgeId로 설정
        if (!memberBadgeId) {
          throw new Error('이 배지는 아직 획득하지 않았습니다.');
        }
        await patchRepresentativeBadge(memberBadgeId);
      }

      if (onRefetch) {
        await onRefetch();
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '대표 배지 변경 실패';
      onError?.(new Error(errorMessage));
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    setRepresentative: handleSetRepresentative,
    toggleRepresentative: handleToggleRepresentative,
    submitting,
  };
}

// ===== 통합 API 훅 =====
export function useApiActions(props: {
  onRefetch?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const memberActions = useMemberActions(props);
  const badgeActions = useBadgeActions(props);

  return {
    member: memberActions,
    badge: badgeActions,
  };
}
