import { useState, useEffect } from 'react';
import { fetchMemberPosts } from "@/api/mypage/postService";
import { getCompanyPosts } from "@/api/company/companyPost";
import type { MyPagePost } from "@/types/mypage/post";
import type { CompanyPost } from "@/types/company/companyPost";

export function usePostManagement(
  isPersonal: boolean,
  isCompany: boolean,
  memberId: number,
  companyId: number | null
) {
  // 개인 게시글
  const [memberPosts, setMemberPosts] = useState<MyPagePost[]>([]);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [postTotalElements, setPostTotalElements] = useState(0);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);
  const [currentPostPage, setCurrentPostPage] = useState(1);

  // 기업 게시글
  const [companyPosts, setCompanyPosts] = useState<CompanyPost[]>([]);
  const [companyPostTotalPages, setCompanyPostTotalPages] = useState(1);
  const [companyPostTotalElements, setCompanyPostTotalElements] = useState(0);
  const [companyPostLoading, setCompanyPostLoading] = useState(true);

  // 개인 게시글 로드
  useEffect(() => {
    if (isPersonal && memberId > 0) {
      setPostLoading(true);
      fetchMemberPosts(memberId, currentPostPage, 5)
        .then((res) => {
          setMemberPosts(res.data.posts);
          setPostTotalPages(res.data.pageInfo.totalPages);
          setPostTotalElements(res.data.pageInfo.totalElements);
        })
        .catch((err) => setPostError(err.message))
        .finally(() => setPostLoading(false));
    }
  }, [isPersonal, memberId, currentPostPage]);

  // 기업 게시글 로드
  useEffect(() => {
    if (isCompany && companyId != null && companyId > 0) {
      setCompanyPostLoading(true);
      getCompanyPosts(companyId, currentPostPage, 5)
        .then((res) => {
          setCompanyPosts(res.data.posts);
          setCompanyPostTotalPages(res.data.pageInfo.totalPages);
          setCompanyPostTotalElements(res.data.pageInfo.totalElements);
        })
        .catch(console.error)
        .finally(() => setCompanyPostLoading(false));
    }
  }, [isCompany, companyId, currentPostPage]);

  return {
    // 개인 게시글
    memberPosts,
    postTotalPages,
    postTotalElements,
    postLoading,
    postError,
    currentPostPage,
    setCurrentPostPage,
    // 기업 게시글
    companyPosts,
    companyPostTotalPages,
    companyPostTotalElements,
    companyPostLoading,
  };
}
