export interface CompanyPost {
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

export interface PageInfo {
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  currPage: number;
}

export interface CompanyPostResponse {
  status: string;
  data: {
    posts: CompanyPost[];
    pageInfo: PageInfo;
  };
}
