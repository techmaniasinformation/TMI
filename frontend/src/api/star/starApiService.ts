// 스타 API 서비스
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export interface StarInfo {
  starId: number;
  postId: number;
}

export interface StarListResponse {
  status: string;
  data: {
    stars: StarInfo[];
  };
}

// 사용자의 스타 목록 조회
export const fetchUserStars = async (memberId: number): Promise<StarInfo[]> => {
  const response = await fetch(`${API_BASE_URL}/star?memberId=${memberId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`스타 목록 조회 실패: ${response.status}`);
  }

  const data: StarListResponse = await response.json();
  return data.data?.stars || [];
};

// 특정 게시글의 스타 정보 찾기
export const findStarByPostId = (stars: StarInfo[], postId: string): StarInfo | undefined => {
  return stars.find(star => star.postId.toString() === postId);
};
