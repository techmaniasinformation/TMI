import type {
  MemberResponse,
  MemberData,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from "@/types/mypage/member";

/** 회원 정보 조회 API */
export async function fetchMemberProfile(memberId: number): Promise<MemberData> {
  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    credentials: "include", // 쿠키 인증 쓰면 반드시 포함
  });

  if (!res.ok) throw new Error("유저 정보 조회 실패");

  const data: MemberResponse = await res.json();
  if (data.status !== "SUCCESS") throw new Error("API 응답 상태 실패");
  return data.data;
}

/**
 * 회원 정보 수정 API (항상 multipart 전송)
 * 서버 스펙: req(JSON), profileImage(파일)
 *
 * 의도별 전송 규칙
 *  - 이미지 그대로 유지: memberProfileUrl 키 '생략'
 *  - 이미지 삭제: memberProfileUrl = null
 *  - 이미지 새 업로드: profileImage 파일만 전송 (URL은 null로 넣지 않아도 됨. 서버가 새 파일 기준으로 세팅)
 */
export async function updateMemberProfile(
  memberId: number,
  body: UpdateMemberRequest
): Promise<number> {
  const form = new FormData();
  const usingFile = !!body.file && body.file instanceof File;

  // req(JSON) 구성 — 수정 의도가 있는 필드만 추가
  const reqPayload: any = {};

  if ("nickname" in body) reqPayload.nickname = body.nickname; // 수정 의도 있을 때만
  if ("blogUrl" in body) reqPayload.blogUrl = body.blogUrl ?? null;
  if ("githubUrl" in body) reqPayload.githubUrl = body.githubUrl ?? null;

  if (usingFile) {
    // 새 파일 업로드 시 memberProfileUrl 키는 안 보냄
  } else if ("memberProfileUrl" in body) {
    // null → 삭제, string → 외부 URL 교체
    reqPayload.memberProfileUrl = body.memberProfileUrl;
  }

  form.append("req", new Blob([JSON.stringify(reqPayload)], { type: "application/json" }));

  if (usingFile) {
    form.append("profileImage", body.file as File); // 서버 파트명: profileImage
  }

  const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
    method: "PATCH",
    body: form, // Content-Type 수동 지정 금지 (브라우저가 boundary 붙임)
    credentials: "include",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const t = await res.text();
      if (t) msg += ` - ${t}`;
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
