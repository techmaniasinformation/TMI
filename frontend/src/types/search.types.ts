export interface SearchCondition {
  keyword: string;
  tags: string[];
  company: string;
}

export interface Post {
  id: number;
  title: string;
  author: string;
  authorProfile: string;
  authorBadge?: string;
  tags: string[];
  date: string;
  views: number;
  stars: number;
  thumbnail: string;
  isFollowing?: boolean;
} 