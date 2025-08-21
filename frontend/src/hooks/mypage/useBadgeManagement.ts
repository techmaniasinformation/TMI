import { useState, useEffect } from 'react';
import { fetchAllBadges, fetchMemberBadges } from "@/api/mypage/badgeService";
import type { Badge, MemberBadge } from "@/types/mypage/badge";

type SelectedBadge = Badge & {
  memberBadgeId?: number;
  receivedAt?: string | null;
  isRepresentative?: boolean;
};

// 배지 이미지 매핑 (실제 이미지 import는 별도 파일에서 관리)
const badgeImages: Record<string, string> = {
  // 실제 이미지 매핑은 별도로 관리
};

export function useBadgeManagement(
  isMyPage: boolean,
  isOtherUser: boolean,
  isPersonal: boolean,
  memberId: number,
  onRepresentativeBadgeChange?: (payload: { badgeId: number | null; badgeUrl: string | null }) => void
) {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [memberBadges, setMemberBadges] = useState<MemberBadge[]>([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<SelectedBadge | null>(null);

  // 서버 재조회
  const refetchMemberBadges = async () => {
    if (!memberId) return;
    try {
      const list = await fetchMemberBadges(memberId);
      setMemberBadges(list);

      const rep = list.find((mb) => mb.isRepresentative);
      if (onRepresentativeBadgeChange) {
        if (rep) {
          const meta = allBadges.find((b) => b.badgeId === rep.badgeId);
          if (meta?.badgeUrl) {
            const badgeImage = badgeImages[meta.badgeUrl] || '/fallback.png';
            onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: badgeImage });
          } else {
            onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: null });
          }
        } else {
          onRepresentativeBadgeChange({ badgeId: null, badgeUrl: null });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  function getBadgeNameByUrl(all: Badge[], url?: string | null) {
    if (!url) return undefined;
    const file = url.split('/').pop() || url;
    const hit = all.find(b => (b.badgeUrl.split('/').pop() || b.badgeUrl) === file);
    return hit?.name;
  }

  // 초기 로드
  useEffect(() => {
    if ((isMyPage || isOtherUser) && isPersonal && memberId > 0) {
      fetchAllBadges().then(setAllBadges).catch(console.error);
      fetchMemberBadges(memberId).then(setMemberBadges).catch(console.error);
    }
  }, [isMyPage, isOtherUser, isPersonal, memberId]);

  // 대표배지 변경 → 상단 동기화
  useEffect(() => {
    const rep = memberBadges.find((mb) => mb.isRepresentative);
    if (onRepresentativeBadgeChange) {
      if (rep) {
        const meta = allBadges.find((b) => b.badgeId === rep.badgeId);
        if (meta?.badgeUrl) {
          const badgeImage = badgeImages[meta.badgeUrl] || '/fallback.png';
          onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: badgeImage });
        } else {
          onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: null });
        }
      } else {
        onRepresentativeBadgeChange({ badgeId: null, badgeUrl: null });
      }
    }
  }, [memberBadges, allBadges, onRepresentativeBadgeChange]);

  const handleBadgeClick = (badge: SelectedBadge) => {
    setSelectedBadge(badge);
    setIsBadgeModalOpen(true);
  };

  const handleBadgeModalClose = () => {
    setIsBadgeModalOpen(false);
  };

  return {
    allBadges,
    memberBadges,
    isBadgeModalOpen,
    selectedBadge,
    refetchMemberBadges,
    getBadgeNameByUrl,
    handleBadgeClick,
    handleBadgeModalClose,
  };
}
