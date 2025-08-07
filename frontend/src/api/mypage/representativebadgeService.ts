const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

// 대표 배지 설정 (memberBadgeId 기준)
export async function patchRepresentativeBadge(memberBadgeId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/memberBadge/${memberBadgeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("대표 배지 설정 실패");
  }
}