export interface MyPagePost {
  postId: string;
  memberProfile: string;
  companyProfileUrl: string | null;
  name: string;
  badgeUrl: string | null;
  title: string;
  createAt: string;
  viewCount: number;
  starCount: number;
  commentCount: number;
  tags: string[];
  thumbnailUrl: string;
}

export interface MyPagePostResponse {
  status: string;
  data: {
    posts: MyPagePost[];
    pageInfo: {
      totalElements: number;
      totalPages: number;
      isLast: boolean;
      currPage: number;
    };
  };
}
