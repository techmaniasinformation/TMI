import type {
  MemberResponse,
  MemberData,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from "@/types/mypage/member";

/** 회원 정보 조회 */
export async function fetchMemberProfile(memberId: number): Promise<MemberData> {
  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("유저 정보 조회 실패");
  }

  const data: MemberResponse = await res.json();
  if (data.status !== "SUCCESS") {
    throw new Error("API 응답 상태 실패");
  }
  return data.data;
}

/** 회원 정보 수정 (JSON) */
export async function updateMemberProfile(
  memberId: number,
  body: UpdateMemberRequest
): Promise<number> {
  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
  return data.data.memberId;
}

/** 회원 탈퇴 (PATCH /member/{id}/delete) */
export async function deleteMember(memberId: number): Promise<void> {
  const res = await fetch(
    `https://i13a509.p.ssafy.io/api/v1/member/${memberId}/delete`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    let msg = `회원탈퇴 실패 (HTTP ${res.status})`;
    try {
      const text = await res.text();
      if (text) msg += ` - ${text}`;
    } catch {}
    throw new Error(msg);
  }

  // 서버가 {status:"SUCCESS"} 형태를 주는 경우 방어적으로 체크
  try {
    const data = await res.json();
    if (data?.status && data.status !== "SUCCESS") {
      throw new Error("회원탈퇴 실패: API 상태 비정상");
    }
  } catch {
    // 응답이 비어있거나 JSON이 아니면 무시 (204 등)
  }
}
