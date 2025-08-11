// 회원 통계 정보 타입
export interface MemberStats {
  postCount: number;       // 작성한 게시글 수
  commentCount: number;    // 작성한 댓글 수
  followerCount: number;   // 팔로워 수
  totalViewCount: number;  // 전체 조회 수
}

// 회원 기본 정보 타입
export interface MemberData {
  memberId: number;              // 회원 ID
  nickname: string;              // 닉네임
  memberProfileUrl: string | null; // 프로필 이미지 URL (없으면 null)
  blogUrl: string | null;         // 블로그 주소
  githubUrl: string | null;       // 깃허브 주소
  memberStats: MemberStats;       // 통계 정보
}

// API 응답 타입
export interface MemberResponse {
  status: string;     // API 상태 ("SUCCESS" / "FAIL")
  data: MemberData;   // 실제 회원 데이터
}

// 회원 정보 수정 요청 바디
export interface UpdateMemberRequest {
  nickname: string;
  memberProfileUrl?: string | null;
  blogUrl?: string | null;
  githubUrl?: string | null;
}

// 회원 정보 수정 응답 (서버 예시: { status: "SUCCESS", data: { memberId: 789 } })
export interface UpdateMemberResponse {
  status: string;
  data: {
    memberId: number;
  };
}
