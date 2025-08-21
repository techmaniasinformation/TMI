import React from 'react';
import { TabsContent } from "@/components/domain/Tabs";
import CommentCard from './CommentCard';
import ServerPagination from '@/components/domain/ServerPagination';
import type { Comment } from "@/types/mypage/comment";

interface CommentsTabContentProps {
  comments: Comment[];
  commentLoading: boolean;
  commentError: string | null;
  commentTotalPages: number;
  commentTotalElements: number;
  currentCommentPage: number;
  setCurrentCommentPage: React.Dispatch<React.SetStateAction<number>>;
}

const CommentsTabContent: React.FC<CommentsTabContentProps> = ({
  comments,
  commentLoading,
  commentError,
  commentTotalPages,
  commentTotalElements,
  currentCommentPage,
  setCurrentCommentPage,
}) => {
  return (
    <TabsContent value="comments" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">작성한 댓글</h2>
      {commentLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중...</p>
      ) : commentError ? (
        <p className="text-sm text-red-500 dark:text-red-400">에러: {commentError}</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">작성한 댓글이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.commentId}
              postTitle={comment.title}
              comment={comment.comment}
              date={comment.createAt}
              onClick={() => window.location.href = `/post/${comment.postId}`}
            />
          ))}
        </div>
      )}
      {commentTotalPages > 1 && (
        <ServerPagination
          currentPage={currentCommentPage}
          totalCount={commentTotalElements}
          pageSize={5}
          onPageChange={setCurrentCommentPage}
        />
      )}
    </TabsContent>
  );
};

export default CommentsTabContent;
