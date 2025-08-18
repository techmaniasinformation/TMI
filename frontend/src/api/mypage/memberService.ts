import type {
  MemberResponse,
  MemberData,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from "@/types/mypage/member";

/** 회원 정보 조회 API */
export async function fetchMemberProfile(memberId: number): Promise<MemberData | null> {
  try {
    const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
      credentials: "include", // 쿠키 인증 쓰면 반드시 포함
    });

    if (!res.ok) {
      console.error(`유저 정보 조회 실패 (HTTP ${res.status})`);
      return null;
    }

    const data: MemberResponse = await res.json();
    if (data.status !== "SUCCESS") {
      console.warn("API 응답 상태 실패", data);
      return null;
    }
    return data.data;
  } catch (err) {
    console.error("유저 정보 조회 중 오류:", err);
    return null;
  }
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
): Promise<number | null> {
  const formData = new FormData();
  const isFileUpload = body.file instanceof Blob;

  // req(JSON) 구성 — 수정 의도가 있는 필드만 추가
  const requestPayload: Record<string, any> = {};
  if (body.nickname !== undefined) requestPayload.nickname = body.nickname;
  if (body.blogUrl !== undefined) requestPayload.blogUrl = body.blogUrl ?? null;
  if (body.githubUrl !== undefined) requestPayload.githubUrl = body.githubUrl ?? null;

  if (!isFileUpload && "memberProfileUrl" in body) {
    // null → 삭제, string → 외부 URL 교체
    requestPayload.memberProfileUrl = body.memberProfileUrl;
  }

  formData.append("req", new Blob([JSON.stringify(requestPayload)], { type: "application/json" }));
  if (isFileUpload) {
    formData.append("profileImage", body.file as File); // 서버 파트명: profileImage
  }

  try {
    const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
      method: "PATCH",
      body: formData, // Content-Type 수동 지정 금지 (브라우저가 boundary 붙임)
      credentials: "include",
    });

    if (!response.ok) {
      console.error(`프로필 수정 HTTP 오류 (HTTP ${response.status})`);
      return null;
    }

    let data: UpdateMemberResponse;
    try {
      data = await response.json();
    } catch {
      console.warn("응답 JSON 파싱 실패");
      return null;
    }

    if (data.status === "SUCCESS") {
      return data.data.memberId;
    } else {
      console.warn("프로필 수정 실패: API 상태 비정상", data);
      return null;
    }
  } catch (err) {
    console.error("프로필 수정 중 오류:", err);
    return null;
  }
}

/** 회원 탈퇴 (PATCH /member/{id}/delete) */
export async function deleteMember(memberId: number): Promise<boolean> {
  try {
    const res = await fetch(
      `https://i13a509.p.ssafy.io/api/v1/member/${memberId}/delete`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (!res.ok) {
      console.error(`회원탈퇴 실패 (HTTP ${res.status})`);
      return false;
    }

    // 응답 바디가 있을 때만 상태 체크
    try {
      const data = await res.json();
      if (data?.status && data.status !== "SUCCESS") {
        console.warn("회원탈퇴 실패: API 상태 비정상", data);
        return false;
      }
    } catch {
      // 바디 없으면(204 등) 무시
    }

    return true;
  } catch (err) {
    console.error("회원탈퇴 중 오류:", err);
    return false;
  }
}
