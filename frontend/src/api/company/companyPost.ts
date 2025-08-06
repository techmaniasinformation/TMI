import type { CompanyPostResponse } from "@/types/company/companyPost";

const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

export async function getCompanyPosts(companyId: number, page: number, size: number): Promise<CompanyPostResponse> {
  const res = await fetch(`${BASE_URL}/post?companyId=${companyId}&page=${page}&size=${size}`);
  if (!res.ok) throw new Error("기업 게시글 불러오기 실패");
  return res.json();
}
