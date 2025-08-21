import { useState, useEffect } from 'react';
import { fetchMemberProfile, deleteMember } from '@/api/mypage/memberService';
import { getCompany } from '@/api/company/company';
import type { MemberData } from '@/types/mypage/member';
import type { Company } from '@/types/company/company';

interface UseProfileHeaderProps {
  targetId: number;
  isCompany: boolean;
  refreshKey?: number;
}

export function useProfileHeader({ targetId, isCompany, refreshKey = 0 }: UseProfileHeaderProps) {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

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

  return {
    memberData,
    companyData,
    loading,
  };
}
