// 팔로우 API 서비스
const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export interface FollowRequest {
  followerId: number;
  followeeId?: number;
  companyId?: string;
}

export interface FollowResponse {
  data: {
    memberFollowId?: number;
    companyFollowId?: number;
  };
}

// 회사 팔로우 추가
export const addCompanyFollow = async (followerId: number, companyId: string): Promise<FollowResponse> => {
  const response = await fetch(`${BASE_URL}/companyFollow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      followerId,
      companyId
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 회사 팔로우 취소
export const removeCompanyFollow = async (followerId: number, companyId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/companyFollow?followerId=${followerId}&companyId=${companyId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

// 개인 사용자 팔로우 추가
export const addMemberFollow = async (followerId: number, followeeId: number): Promise<FollowResponse> => {
  const response = await fetch(`${BASE_URL}/memberFollow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      followerId,
      followeeId
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 개인 사용자 팔로우 취소
export const removeMemberFollow = async (followerId: number, followeeId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/memberFollow?followerId=${followerId}&followeeId=${followeeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};
