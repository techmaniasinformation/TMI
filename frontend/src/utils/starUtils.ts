// 스타 관련 유틸리티 함수들

// 서버에서 사용자의 스타 목록을 가져오는 함수
export const fetchUserStarList = async (memberId: number) => {
  try {
    const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star?memberId=${memberId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch star list: ${response.status}`);
    }

    const result = await response.json();
    const stars = result.data?.stars || [];
    
    // postId 목록과 starId 매핑 생성
    const postIds = stars.map((star: any) => star.postId);
    const starIdMap = new Map();
    
    stars.forEach((star: any) => {
      if (star.postId && star.starId) {
        starIdMap.set(star.postId, star.starId);
      }
    });

    return {
      success: true,
      postIds,
      starIdMap,
      stars
    };
  } catch (error) {
    console.error('❌ [starUtils] 스타 목록 가져오기 실패:', error);
    return {
      success: false,
      postIds: [],
      starIdMap: new Map(),
      stars: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// 특정 게시글의 스타 상태를 확인하는 함수
export const checkPostStarStatus = (postId: string, stars: any[]) => {
  const currentStar = stars.find((star: any) => star.postId === postId);
  return {
    isStarred: !!currentStar,
    starId: currentStar?.starId || null
  };
};

// 스타 추가 함수
export const addStar = async (memberId: number, postId: string) => {
  try {
    const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberId,
        postId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      starId: result.data?.starId,
      data: result.data
    };
  } catch (error) {
    console.error('❌ [starUtils] 스타 추가 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// 스타 취소 함수
export const removeStar = async (starId: number) => {
  try {
    const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star/${starId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer accessToken'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('❌ [starUtils] 스타 취소 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
