// 스타 API 서비스
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export interface Star {
  starId: number;
  postId: number;
  memberId: number;
}

export interface StarListResponse {
  status: string;
  data: {
    stars: Star[];
  };
}

// 사용자의 스타 목록 조회
export const fetchUserStars = async (memberId: number): Promise<Star[]> => {
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
export const findStarByPostId = async (memberId: number, postId: string): Promise<Star | null> => {
  const stars = await fetchUserStars(memberId);
  return stars.find(star => star.postId.toString() === postId) || null;
};

// 스타 추가
export const addStar = async (memberId: number, postId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/star`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        memberId,
        postId
      })
    });

    if (!response.ok) {
      throw new Error(`스타 추가 실패: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '스타 추가 실패' 
    };
  }
};

// 스타 취소
export const removeStar = async (starId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/star/${starId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`스타 취소 실패: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '스타 취소 실패' 
    };
  }
};
