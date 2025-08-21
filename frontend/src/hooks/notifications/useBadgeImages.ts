// ===== 배지 이미지 import & 매핑 =====
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

// ---- 유틸: 경로 처리/폴백 ----
const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';
const BADGE_CDN_BASE =
  (import.meta as any).env?.VITE_BADGE_CDN ?? `${BASE_URL}/badge/images`;

const cleanUrl = (u?: string | null) => (u && u.trim() ? u : undefined);
const resolveBadgeSrc = (file?: string | null) => {
  const f = (file ?? '').trim();
  if (!f) return undefined;
  if (/^https?:\/\//i.test(f)) return f;
  return `${BADGE_CDN_BASE}/${f}`;
};

export function useBadgeImages() {
  const getBadgeImage = (badgeUrl: string) => {
    return badgeImages[badgeUrl] || resolveBadgeSrc(badgeUrl);
  };

  return {
    badgeImages,
    cleanUrl,
    resolveBadgeSrc,
    getBadgeImage,
  };
}
