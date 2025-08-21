import { useState, useEffect } from 'react';
import { fetchStarredPosts } from "@/api/mypage/starService";
import type { Post as StarPost } from "@/types/mypage/star";

export function useStarManagement(
  isMyPage: boolean,
  isPersonal: boolean,
  memberId: number
) {
  const [starredPosts, setStarredPosts] = useState<StarPost[]>([]);
  const [starTotalPages, setStarTotalPages] = useState(1);
  const [starTotalElements, setStarTotalElements] = useState(0);
  const [starLoading, setStarLoading] = useState(true);
  const [starError, setStarError] = useState<string | null>(null);
  const [currentStarPage, setCurrentStarPage] = useState(1);

  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      setStarLoading(true);
      fetchStarredPosts(memberId, currentStarPage, 5)
        .then((res) => {
          setStarredPosts(res.data.posts);
          setStarTotalPages(res.data.pageInfo.totalPages);
          setStarTotalElements(res.data.pageInfo.totalElements);
        })
        .catch((err) => setStarError(err.message))
        .finally(() => setStarLoading(false));
    }
  }, [isMyPage, isPersonal, memberId, currentStarPage]);

  return {
    starredPosts,
    starTotalPages,
    starTotalElements,
    starLoading,
    starError,
    currentStarPage,
    setCurrentStarPage,
  };
}
