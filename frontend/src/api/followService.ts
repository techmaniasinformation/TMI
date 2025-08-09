// /src/api/followService.ts
import type {
  MemberFollowListResp,
  CompanyFollowListResp,
  FollowMutateResp,
  MemberFollow,
  CompanyFollow,
} from '@/types/mypage/follow';

const BASE = 'https://i13a509.p.ssafy.io/api/v1';

/* ----------------------------------------------------
 * 공통 유틸: 응답 파싱 + 에러 메시지 생성
 * --------------------------------------------------*/
async function parseBody(res: Response) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : null; } catch { return text || null; }
}

function buildError(res: Response, body: any, fallback: string) {
  // 서버가 메시지를 주면 그걸 우선 사용
  const serverMsg =
    (body && (body.message || body.error || body.status || body.detail)) || '';

  // 상태코드별 커스텀 문구
  let msg = '';
  switch (res.status) {
    case 400:
      msg = '자기 자신을 팔로우 할 수 없습니다.';
      break;
    case 401:
    case 403:
      msg = '권한이 없습니다. 로그인 상태를 확인해주세요.';
      break;
    case 404:
      msg = '대상을 찾을 수 없습니다. 이미 해제되었을 수 있어요.';
      break;
    case 409:
      msg = '이미 처리된 요청입니다. (중복 팔로우/언팔로우)';
      break;
    case 500:
      msg = '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
      break;
    default:
      msg = fallback;
  }

  // 서버 메시지가 있으면 뒤에 덧붙여서 디버깅에도 도움되게
  if (serverMsg && typeof serverMsg === 'string') {
    msg = `${msg}\n(${serverMsg})`;
  }

  return new Error(msg);
}

/** ===================== 조회 ===================== **/

// 내가 팔로우한 "회원" 목록
export async function getMemberFollows(
  followerId: number,
  page = 0,
  size = 9
): Promise<MemberFollowListResp> {
  const res = await fetch(`${BASE}/memberFollow?followerId=${followerId}&page=${page}&size=${size}`);
  const body = await parseBody(res);
  if (!res.ok) throw buildError(res, body, '사용자 팔로우 목록 조회 실패');
  return body as MemberFollowListResp;
}

// 내가 팔로우한 "회사" 목록
export async function getCompanyFollows(
  followerId: number,
  page = 0,
  size = 9
): Promise<CompanyFollowListResp> {
  const res = await fetch(`${BASE}/companyFollow?followerId=${followerId}&page=${page}&size=${size}`);
  const body = await parseBody(res);
  if (!res.ok) throw buildError(res, body, '기업 팔로우 목록 조회 실패');
  return body as CompanyFollowListResp;
}

/** ===================== 등록 ===================== **/

// 회원 팔로우
export async function createMemberFollow(
  followerId: number,
  followeeId: number
): Promise<FollowMutateResp> {
  const res = await fetch(`${BASE}/memberFollow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ followerId, followeeId }),
  });
  const body = await parseBody(res);
  if (!res.ok) throw buildError(res, body, '팔로우 요청 처리 중 오류가 발생했습니다.');
  return body as FollowMutateResp; // { status, data: { memberFollowId } }
}

// 회사 팔로우
export async function createCompanyFollow(
  followerId: number,
  companyId: number
): Promise<FollowMutateResp> {
  const res = await fetch(`${BASE}/companyFollow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ followerId, companyId }),
  });
  const body = await parseBody(res);
  if (!res.ok) throw buildError(res, body, '기업 팔로우 요청 처리 중 오류가 발생했습니다.');
  return body as FollowMutateResp; // { status, data: { companyFollowId } }
}

/** ===================== 삭제 ===================== **/

// 회원 언팔
export async function deleteMemberFollow(memberFollowId: number): Promise<FollowMutateResp> {
  const res = await fetch(`${BASE}/memberFollow/${memberFollowId}`, { method: 'DELETE' });
  const body = await parseBody(res);
  if (!res.ok) throw buildError(res, body, '언팔로우 처리 중 오류가 발생했습니다.');
  return body as FollowMutateResp;
}

// 회사 언팔
export async function deleteCompanyFollow(companyFollowId: number): Promise<FollowMutateResp> {
  const res = await fetch(`${BASE}/companyFollow/${companyFollowId}`, { method: 'DELETE' });
  const body = await parseBody(res);
  if (!res.ok) throw buildError(res, body, '기업 언팔로우 처리 중 오류가 발생했습니다.');
  return body as FollowMutateResp;
}

/** ========== followId 유틸 (단건 여부 확인용) ========== **/

// 회원 팔로우 ID 찾기 (전용 API 없어서 목록에서 탐색)
export async function findMemberFollowId(followerId: number, followeeId: number, pageSize = 50) {
  const list = await getMemberFollows(followerId, 0, pageSize);
  const hit = list.data.memberFollows.find((m: MemberFollow) => m.memberId === followeeId);
  return hit ? hit.memberFollowId : null;
}

// 회사 팔로우 ID 찾기
export async function findCompanyFollowId(followerId: number, companyId: number, pageSize = 50) {
  const list = await getCompanyFollows(followerId, 0, pageSize);
  const hit = list.data.companyFollows.find((c: CompanyFollow) => c.companyId === companyId);
  return hit ? hit.companyFollowId : null;
}
