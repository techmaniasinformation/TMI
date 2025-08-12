import React, { useState, useEffect } from 'react';
import { patchRepresentativeBadge } from '@/api/mypage/representativebadgeService';

// 배지 이미지들 import
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

// 배지 이미지 매핑
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

interface BadgeModalProps {
  isOpen: boolean;
  badge: {
    badgeId: number;
    memberBadgeId?: number; // 반드시 있어야 PATCH 가능
    name: string;
    description: string;
    badgeUrl: string;
    receivedAt?: string | null;
    isRepresentative?: boolean;
  } | null;
  onClose: () => void;
  onSelect: (badge: BadgeModalProps['badge']) => void;
}

export default function BadgeModal({
  isOpen,
  onClose,
  badge,
  onSelect,
}: BadgeModalProps) {
  const [badgeImageUrl, setBadgeImageUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (badge?.badgeUrl) {
      const imageUrl = badgeImages[badge.badgeUrl] || '/fallback.png';
      setBadgeImageUrl(imageUrl);
    }
  }, [badge?.badgeUrl]);

  if (!isOpen || !badge) return null;

  const isOwned = !!badge.memberBadgeId;
  const isRep = !!badge.isRepresentative;

  const handleToggleRepresentative = async () => {
    if (!isOwned && !isRep) {
      alert('획득한 배지만 대표 배지로 설정할 수 있습니다.');
      return;
    }
    try {
      setSubmitting(true);

      if (isRep) {
        // 해제: 22번(기본 배지)로 설정
        await patchRepresentativeBadge(22);
        onSelect?.({ ...badge, isRepresentative: false });
      } else {
        // 설정
        await patchRepresentativeBadge(badge.memberBadgeId!);
        onSelect?.({ ...badge, isRepresentative: true });
      }

      onClose();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || '대표 배지 변경에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = badge.receivedAt
    ? new Date(badge.receivedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) + ' 획득'
    : '아직 획득하지 않은 배지';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <img
            src={badgeImageUrl || '/fallback.png'}
            alt={badge.name}
            className="w-32 h-32 mx-auto mb-4 rounded-lg object-contain"
          />
          <h3 className="text-xl font-semibold mb-2">{badge.name}</h3>
          <p className="text-gray-600 mb-2">{badge.description}</p>
          <p className="text-sm text-gray-500 mb-6">{formattedDate}</p>

          <div className="flex gap-2">
            <button
              onClick={handleToggleRepresentative}
              disabled={submitting || (!isOwned && !isRep)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors
                ${submitting || (!isOwned && !isRep)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isRep
                    ? 'bg-red-600 text-white hover:bg-red-700'   // 해제일 때 빨간색
                    : 'bg-blue-600 text-white hover:bg-blue-700' // 설정일 때 파란색
                }`}
            >
              {submitting
                ? '변경 중…'
                : isRep
                ? '대표 배지 해제'
                : '대표 배지로 설정'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
          </div>

          {!isOwned && !isRep && (
            <p className="mt-3 text-xs text-red-500">
              이 배지는 아직 획득하지 않아 대표 배지로 설정할 수 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
