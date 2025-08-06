import type { CompanyResponse } from "@/types/company/company";

const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

export async function getCompany(companyId: number): Promise<CompanyResponse> {
  const res = await fetch(`${BASE_URL}/company/${companyId}`);
  if (!res.ok) throw new Error("기업 정보 불러오기 실패");
  return res.json();
}
