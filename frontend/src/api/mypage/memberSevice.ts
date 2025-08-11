import type {
  MemberResponse,
  MemberData,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from "@/types/mypage/member";

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

// 회원 정보 수정 API (JSON 전송; 멀티파트 아님)
export async function updateMemberProfile(
  memberId: number,
  body: UpdateMemberRequest
): Promise<number> {
  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    method: "PUT",             // 서버가 PATCH가 아니라면 PUT 사용 (예시 요청과 맞춤)
    headers: {
      "Content-Type": "application/json",
    },
    // 쿠키 세션을 쓰는 경우엔 아래 주석 해제
    // credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const text = await res.text();
      if (text) msg += ` - ${text}`;
    } catch {}
    throw new Error(msg);
  }

  const data: UpdateMemberResponse = await res.json();
  if (data.status !== "SUCCESS") {
    throw new Error("프로필 수정 실패: API 상태 비정상");
  }

  // 서버 예시 응답에 맞춰 memberId 반환
  return data.data.memberId;
}