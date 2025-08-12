// 팔로우 관련 타입 정의
export interface FollowData {
  followerId: number;
  targetId: number;
  targetType: 'company' | 'member';
}

// 팔로우 API 호출 함수
export const followUser = async (followData: FollowData): Promise<{ success: boolean; followId?: number; error?: string }> => {
  try {
    const { followerId, targetId, targetType } = followData;
    
    if (targetType === 'company') {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companies/${targetId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId,
          companyId: targetId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { 
        success: true, 
        followId: result.data?.companyFollowId 
      };
    } else {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/memberFollow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId,
          followeeId: targetId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { 
        success: true, 
        followId: result.data?.memberFollowId 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// 언팔로우 API 호출 함수
export const unfollowUser = async (followId: number, targetType: 'company' | 'member'): Promise<{ success: boolean; error?: string }> => {
  try {
    const endpoint = targetType === 'company' 
      ? `https://i13a509.p.ssafy.io/api/v1/companyFollow/${followId}`
      : `https://i13a509.p.ssafy.io/api/v1/memberFollow/${followId}`;

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// 스타 관련 API 호출 함수
export const starPost = async (memberId: number, postId: string): Promise<{ success: boolean; starId?: number; error?: string }> => {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { 
      success: true, 
      starId: result.data?.starId 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const unstarPost = async (starId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star/${starId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer accessToken'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
