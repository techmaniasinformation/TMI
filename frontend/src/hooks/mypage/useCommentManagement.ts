import { useState, useEffect } from 'react';
import { fetchMemberComments } from "@/api/mypage/commentService";
import type { Comment } from "@/types/mypage/comment";

export function useCommentManagement(
  isMyPage: boolean,
  isPersonal: boolean,
  memberId: number
) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [commentTotalElements, setCommentTotalElements] = useState(0);
  const [commentLoading, setCommentLoading] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);

  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      setCommentLoading(true);
      fetchMemberComments(memberId, currentCommentPage, 5)
        .then(({ comments, pageInfo }) => {
          setComments(comments);
          setCommentTotalPages(pageInfo.totalPages);
          setCommentTotalElements(pageInfo.totalElements);
        })
        .catch((err) => setCommentError(err.message))
        .finally(() => setCommentLoading(false));
    }
  }, [isMyPage, isPersonal, memberId, currentCommentPage]);

  return {
    comments,
    commentTotalPages,
    commentTotalElements,
    commentLoading,
    commentError,
    currentCommentPage,
    setCurrentCommentPage,
  };
}
