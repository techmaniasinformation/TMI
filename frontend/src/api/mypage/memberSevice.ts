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

// 회원 정보 수정 API (멀티파트 전송; req 파트에 JSON 담기)
export async function updateMemberProfile(
  memberId: number,
  body: UpdateMemberRequest
): Promise<number> {
  const form = new FormData();

  // 서버가 요구하는 'req' 파트: JSON Blob으로 넣기
  const reqPayload = {
    nickname: body.nickname ?? '',
    blogUrl: body.blogUrl ?? null,
    githubUrl: body.githubUrl ?? null,
    memberProfileUrl: body.memberProfileUrl ?? null,
  };
  form.append(
    'req',
    new Blob([JSON.stringify(reqPayload)], { type: 'application/json' })
  );

  // 이미지 파일이 필요한 경우에만 추가 (optional)
  // if (body.file) form.append('file', body.file);

  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    method: 'PATCH',
    body: form,                 // Content-Type 절대 수동 지정하지 말기!
    // credentials: 'include',  // 쿠키 인증이면 주석 해제
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
  if (data.status !== 'SUCCESS') {
    throw new Error('프로필 수정 실패: API 상태 비정상');
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
