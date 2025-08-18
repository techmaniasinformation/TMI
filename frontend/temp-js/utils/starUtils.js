// 스타 관련 유틸리티 함수들

// 서버에서 사용자의 스타 목록을 가져오는 함수
export const fetchUserStarList = async memberId => {
  try {
    const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star?memberId=${memberId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch star list: ${response.status}`);
    }
    const result = await response.json();
    const stars = result.data?.stars || [];
    console.log(`📋 [fetchUserStarList] 서버에서 받은 원본 스타 데이터:`, stars);

    // postId를 문자열로 통일하여 저장 (타입 일관성 보장)
    const postIds = stars.map(star => String(star.postId));
    const starIdMap = new Map();
    stars.forEach(star => {
      if (star.postId && star.starId) {
        // postId를 문자열로 변환하여 저장
        starIdMap.set(String(star.postId), star.starId);
      }
    });
    console.log(`📋 [fetchUserStarList] 변환된 데이터 - postIds:`, postIds);
    console.log(`📋 [fetchUserStarList] 변환된 데이터 - starIdMap:`, Array.from(starIdMap.entries()));
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
export const checkPostStarStatus = (postId, stars) => {
  // postId를 숫자로 변환하여 비교 (서버에서 숫자로 오는 경우 대비)
  const numericPostId = Number(postId);
  const currentStar = stars.find(star => star.postId === postId || star.postId === numericPostId);
  console.log(`🔍 [checkPostStarStatus] 검색 조건 - postId: "${postId}" (타입: ${typeof postId}), numericPostId: ${numericPostId}`);
  console.log(`🔍 [checkPostStarStatus] 스타 목록에서 검색 - 찾은 결과:`, currentStar);
  return {
    isStarred: !!currentStar,
    starId: currentStar?.starId || null
  };
};

// 스타 추가 함수
export const addStar = async (memberId, postId) => {
  try {
    const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
export const removeStar = async starId => {
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