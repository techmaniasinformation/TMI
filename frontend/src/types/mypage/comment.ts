export interface Comment {
  commentId: number;
  memberProfileUrl: string;
  name: string;
  badgeUrl: string | null;
  comment: string;
  link: string;
  createAt: string;
  recommendCount: number;
}

export interface CommentResponse {
  status: string;
  data: {
    comments: Comment[];
    pageInfo: {
      totalElements: number;
      totalPages: number;
      isLast: boolean;
      currPage: number;
    };
  };
}
