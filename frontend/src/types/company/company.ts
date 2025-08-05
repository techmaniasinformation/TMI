export interface CompanyStats {
  postCount: number;
  followerCount: number;
  totalViewCount: number;
}

export interface Company {
  companyId: number;
  name: string;
  companyProfileUrl: string | null;
  techBlogUrl: string | null;
  lastUpdatedAt: string;
  stats: CompanyStats;
}

export interface CompanyResponse {
  status: string;
  data: Company;
}