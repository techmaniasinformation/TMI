const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

/** 기업 팔로우 목록 조회 */
export async function fetchCompanyFollows(followerId: number, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/companyFollow?followerId=${followerId}&page=${page}&size=${size}`);
  if (!res.ok) throw new Error('기업 팔로우 목록을 불러오는데 실패했습니다.');
  return res.json();
}

/** 사용자 팔로우 목록 조회 */
export async function fetchMemberFollows(followerId: number, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/memberFollow?followerId=${followerId}&page=${page}&size=${size}`);
  if (!res.ok) throw new Error('사용자 팔로우 목록을 불러오는데 실패했습니다.');
  return res.json();
}
