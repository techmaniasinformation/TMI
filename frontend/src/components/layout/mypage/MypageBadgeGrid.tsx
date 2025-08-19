import React from 'react';
import type { Badge, MemberBadge } from "@/types/mypage/badge";

// 이미지
import ai_1 from '@/assets/images/ai_1.png';
import amumu from '@/assets/images/amumu.png';
import aws_1 from '@/assets/images/aws_1.png';
import db_1 from '@/assets/images/db_1.png';
import fctmi_1 from '@/assets/images/fctmi_1.png';
import first_article from '@/assets/images/first_article.png';
import first_comment from '@/assets/images/first_comment.png';
import followmany from '@/assets/images/followmany.png';
import helloworld from '@/assets/images/helloworld.png';
import like10 from '@/assets/images/like10.png';
import like100 from '@/assets/images/like100.png';
import like1000 from '@/assets/images/like1000.png';
import paris from '@/assets/images/paris.png';
import react from '@/assets/images/react.png';
import spring from '@/assets/images/spring.png';
import star_5 from '@/assets/images/star_5.png';
import star_13 from '@/assets/images/star_13.png';
import star_42 from '@/assets/images/star_42.png';
import view1 from '@/assets/images/view1.png';
import view2 from '@/assets/images/view2.png';
import view3 from '@/assets/images/view3.png';
import locked from '@/assets/images/locked.png';

const badgeImages: Record<string, string> = {
  'ai_1.png': ai_1,
  'amumu.png': amumu,
  'aws_1.png': aws_1,
  'db_1.png': db_1,
  'fctmi_1.png': fctmi_1,
  'first_article.png': first_article,
  'first_comment.png': first_comment,
  'followmany.png': followmany,
  'helloworld.png': helloworld,
  'like10.png': like10,
  'like100.png': like100,
  'like1000.png': like1000,
  'paris.png': paris,
  'react.png': react,
  'spring.png': spring,
  'star_5.png': star_5,
  'star_13.png': star_13,
  'star_42.png': star_42,
  'view_50.png': view1,
  'view_100.png': view2,
  'view_1000.png': view3,
  'locked.png': locked,
};

type SelectedBadge = Badge & {
  memberBadgeId?: number;
  receivedAt?: string | null;
  isRepresentative?: boolean;
};

interface MypageBadgeGridProps {
  allBadges: Badge[];
  memberBadges: MemberBadge[];
  canOpenBadgeModal: boolean;
  onBadgeClick: (badge: SelectedBadge) => void;
}

const MypageBadgeGrid: React.FC<MypageBadgeGridProps> = ({
  allBadges,
  memberBadges,
  canOpenBadgeModal,
  onBadgeClick,
}) => {
  const HIDDEN_BADGE_IDS = new Set<number>([22]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
      {[...allBadges]
        .filter((b) => !HIDDEN_BADGE_IDS.has(b.badgeId))
        .sort((a, b) => {
          const aHas = memberBadges.some((mb) => mb.badgeId === a.badgeId);
          const bHas = memberBadges.some((mb) => mb.badgeId === b.badgeId);
          if (aHas && !bHas) return -1;
          if (!aHas && bHas) return 1;
          return a.badgeId - b.badgeId;
        })
        .map((badge: Badge) => {
          const hasBadge = memberBadges.some((mb) => mb.badgeId === badge.badgeId);
          const matchedBadge = hasBadge
            ? memberBadges.find((mb) => mb.badgeId === badge.badgeId)
            : null;

          const handleClick = () => {
            if (!canOpenBadgeModal || !hasBadge) return;
            onBadgeClick({
              ...badge,
              memberBadgeId: matchedBadge?.memberBadgeId,
              receivedAt: matchedBadge?.receivedAt ?? null,
              isRepresentative: matchedBadge?.isRepresentative ?? false,
            });
          };

          return (
            <div
              key={badge.badgeId}
              onClick={handleClick}
              className={`aspect-square border rounded-xl shadow-sm flex flex-col items-center justify-center transition 
                ${
                  hasBadge
                    ? (canOpenBadgeModal
                        ? 'cursor-pointer hover:shadow-md border-purple-600'
                        : 'cursor-default border-purple-600')
                    : 'cursor-not-allowed border-gray-300 dark:border-gray-600 opacity-50'
                }`}
              aria-disabled={!canOpenBadgeModal}
              title={canOpenBadgeModal ? badge.name : undefined}
            >
              <img
                src={hasBadge ? (badgeImages[badge.badgeUrl] || '/fallback.png') : (badgeImages['locked.png'] || '/fallback.png')}
                alt={badge.name}
                className="w-20 h-20 mb-2 rounded-lg object-contain"
              />
              <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-200">{badge.name}</p>
            </div>
          );
        })}
    </div>
  );
};

export default MypageBadgeGrid;

