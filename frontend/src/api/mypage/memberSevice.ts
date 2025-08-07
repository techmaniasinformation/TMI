import type { MemberResponse, MemberData } from "@/types/mypage/member";

// 회원 정보 조회 API
export async function fetchMemberProfile(memberId: number): Promise<MemberData> {
  // API 호출
  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`);

  // HTTP 에러 처리
  if (!res.ok) {
    throw new Error("유저 정보 조회 실패");
  }

  // JSON 파싱
  const data: MemberResponse = await res.json();

  // API 상태 값 체크
  if (data.status !== "SUCCESS") {
    throw new Error("API 응답 상태 실패");
  }

  // 실제 데이터 반환
  return data.data;
}
