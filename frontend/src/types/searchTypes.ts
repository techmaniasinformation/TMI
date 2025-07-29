export interface SearchCondition {
  keyword: string;
  tags: string[];
  company: string;
}

export interface Post {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
    company: string;
  };
  tags: string[];
  content: string;
  createdAt: string;
  views: number;
  likes: number;
} 