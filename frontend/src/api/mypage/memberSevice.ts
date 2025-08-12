import type {
  MemberResponse,
  MemberData,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from "@/types/mypage/member";

// 회원 정보 조회 API
export async function fetchMemberProfile(memberId: number): Promise<MemberData> {
  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    credentials: "include", // ✅ 쿠키 인증 쓰면 반드시 포함
  });

  if (!res.ok) throw new Error("유저 정보 조회 실패");

  const data: MemberResponse = await res.json();
  if (data.status !== "SUCCESS") throw new Error("API 응답 상태 실패");
  return data.data;
}

// 회원 정보 수정 API
// 서버 스펙: multipart는 req(JSON), profileImage(파일)
// 파일 있으면 → multipart + POST/PUT
// 파일 없으면 → JSON + PATCH (memberProfileUrl 키는 바꿀 때만 포함)
export async function updateMemberProfile(
  memberId: number,
  body: UpdateMemberRequest
): Promise<number> {
  const hasFile = !!body.file && body.file instanceof File;

  if (hasFile) {
    // ✅ 파일이 있을 때만 multipart
    const form = new FormData();
    const reqPayload = {
      nickname: body.nickname ?? "",
      blogUrl: body.blogUrl ?? null,
      githubUrl: body.githubUrl ?? null,
      memberProfileUrl: null, // 새 파일 기준으로 서버가 세팅
    };
    form.append("req", new Blob([JSON.stringify(reqPayload)], { type: "application/json" }));
    form.append("profileImage", body.file as File); // ✅ 서버 키명 맞춤

    const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
      method: "PATCH",              // ✅ PATCH+multipart 이슈 회피(서버가 허용하는 메서드 사용)
      body: form,
      credentials: "include",
    });

    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const t = await res.text(); if (t) msg += ` - ${t}`; } catch {}
      throw new Error(msg);
    }
    const data: UpdateMemberResponse = await res.json();
    if (data.status !== "SUCCESS") throw new Error("프로필 수정 실패: API 상태 비정상");
    return data.data.memberId;
  }

  // ✅ 파일 없을 때는 JSON PATCH
  const payload: any = {
    nickname: body.nickname ?? "",
    blogUrl: body.blogUrl ?? null,
    githubUrl: body.githubUrl ?? null,
  };
  // 이미지 URL을 실제로 바꿀 때만 포함 (안 바꾸면 키 자체를 생략)
  if (typeof body.memberProfileUrl !== "undefined") {
    payload.memberProfileUrl = body.memberProfileUrl;
  }

  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const t = await res.text(); if (t) msg += ` - ${t}`; } catch {}
    throw new Error(msg);
  }
  const data: UpdateMemberResponse = await res.json();
  if (data.status !== "SUCCESS") throw new Error("프로필 수정 실패: API 상태 비정상");
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
    try { const text = await res.text(); if (text) msg += ` - ${text}`; } catch {}
    throw new Error(msg);
  }

  try {
    const data = await res.json();
    if (data?.status && data.status !== "SUCCESS") {
      throw new Error("회원탈퇴 실패: API 상태 비정상");
    }
  } catch { /* 바디 없으면 무시 */ }
}
