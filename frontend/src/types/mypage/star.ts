export interface Post {
  postId: string;
  title: string;
  thumbnailUrl: string;
  tags: string[];
  viewCount: number;
  starCount: number;
  commentCount: number;
}

export interface StarredPostsResponse {
  status: string;
  data: {
    posts: Post[];
    pageInfo: {
      totalPages: number;
      totalElements: number;
    };
  };
}
