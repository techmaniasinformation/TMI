const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

// 대표 배지 설정
export async function patchRepresentativeBadge(memberBadgeId: number) {
  const res = await fetch(`${BASE_URL}/memberBadge/${memberBadgeId}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("대표 배지 설정 실패");
  // 응답: { status: "SUCCESS", data: { memberBadgeId: number } }
  return res.json();
}
