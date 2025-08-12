import type {
  MemberResponse,
  MemberData,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from "@/types/mypage/member";

// 회원 정보 조회 API
export async function fetchMemberProfile(memberId: number): Promise<MemberData> {
  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    // 인증 필요 시 주석 해제
    // credentials: "include",
  });

  if (!res.ok) throw new Error("유저 정보 조회 실패");

  const data: MemberResponse = await res.json();
  if (data.status !== "SUCCESS") throw new Error("API 응답 상태 실패");
  return data.data;
}

// 회원 정보 수정 API (멀티파트: req(JSON) + file)
export async function updateMemberProfile(
  memberId: number,
  body: UpdateMemberRequest
): Promise<number> {
  const form = new FormData();

  const usingFile = !!body.file && body.file instanceof File;

  // 서버 요구 스펙: 'req' 파트에 JSON
  const reqPayload = {
    nickname: body.nickname ?? "",
    blogUrl: body.blogUrl ?? null,
    githubUrl: body.githubUrl ?? null,
    // 파일 보낼 땐 URL은 서버가 새 파일 기준으로 세팅하도록 null 권장
    memberProfileUrl: usingFile ? null : (body.memberProfileUrl ?? null),
  };
  form.append("req", new Blob([JSON.stringify(reqPayload)], { type: "application/json" }));

  // 파일 있으면 추가
  if (usingFile) {
    form.append("file", body.file as File);
  }

  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    method: "PATCH",
    body: form,                // Content-Type 자동 지정 (절대 수동 지정 X)
    credentials: "include",    // 쿠키 인증이면 필수
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

  // 응답 바디가 있을 때만 상태 방어적으로 체크
  try {
    const data = await res.json();
    if (data?.status && data.status !== "SUCCESS") {
      throw new Error("회원탈퇴 실패: API 상태 비정상");
    }
  } catch {
    // 바디 없으면(204 등) 무시
  }
}
