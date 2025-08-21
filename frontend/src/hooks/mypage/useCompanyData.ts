import { useState, useEffect } from 'react';
import { getCompany } from '@/api/company/company';
import type { Company } from '@/types/company/company';

export function useCompanyData(isCompany: boolean, routeId: number) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isCompany || routeId <= 0) return; // 불필요 호출 방지
    setLoading(true);
    getCompany(routeId)
      .then((res) => setCompany(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isCompany, routeId]);

  const lastUpdateText =
    isCompany && company?.lastUpdatedAt ? company.lastUpdatedAt.slice(0, 10) : '';

  return {
    company,
    loading,
    lastUpdateText,
  };
}
