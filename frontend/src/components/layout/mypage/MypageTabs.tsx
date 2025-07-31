import React, { useState, useEffect } from 'react';

// Tabs UI 컴포넌트 임포트
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/domain/Tabs";

// 탭 내에서 사용될 카드 컴포넌트들
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import FollowCompanyCard from './FollowCompanyCard';
import FollowUserCard from './FollowUserCard';
import { Button } from '@/components/foundation/button';

// 아이콘들
import IconTab1 from '@/assets/icons/IconTab1';
import IconTab2 from '@/assets/icons/IconTab2';
import IconTab3 from '@/assets/icons/IconTab3';
import IconTab4 from '@/assets/icons/IconTab4';
import IconTab5 from '@/assets/icons/IconTab5';

import { CommentCardProps } from './CommentCard';

// 페이지네이션
import Pagination from '@/components/domain/Pagination';
import usePagination from '@/hooks/mypage/usePagination';

// props 타입 정의
interface MyPageTabsProps {
  isCompany: boolean;
  isMyPage: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
  userStats: any;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

// 마이페이지의 탭 UI 컴포넌트
const MyPageTabs: React.FC<MyPageTabsProps> = ({
  isCompany,
  isMyPage,
  activeTab,
  setActiveTab,
  userStats,
  currentPage,
  setCurrentPage
}) => {
  const [followSubTab, setFollowSubTab] = useState<'company' | 'user'>('company');
  const [comments, setComments] = useState<CommentCardProps[]>([]); 

  useEffect(() => {
    fetch('/mypage_comments.json')
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error('댓글 로딩 실패:', err));
  }, []);

  // usePagination 훅 적용 (댓글에만)
  const {
    currentPage: currentCommentPage,
    setCurrentPage: setCurrentCommentPage,
    totalPages: totalCommentPages,
    paginatedItems: paginatedComments
  } = usePagination<CommentCardProps>(comments, 5);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-[1232px]'>
      {/* 탭 목록 (상단 버튼들) */}
      <TabsList className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 w-full flex justify-start p-0 h-auto">
        {/* 내 정보 탭 - 개인 사용자만 노출 */}
        {!isCompany && (
          <TabsTrigger value="profile" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
            <IconTab1 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">내 정보</span>
          </TabsTrigger>
        )}

        {/* 댓글, 팔로우, 스타 탭 - 본인 + 개인 사용자일 때만 */}
        {!isCompany && isMyPage && (
          <>
            <TabsTrigger value="comments" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
              <IconTab2 className="w-4 h-4 mr-2 text-inherit" />
              <span className="text-sm">작성한 댓글</span>
            </TabsTrigger>

            <TabsTrigger value="follow" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
              <IconTab4 className="w-4 h-4 mr-2 text-inherit" />
              <span className="text-sm">팔로우</span>
            </TabsTrigger>

            <TabsTrigger value="starred" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
              <IconTab5 className="w-4 h-4 mr-2 text-inherit" />
              <span className="text-sm">스타 게시글</span>
            </TabsTrigger>
          </>
        )}

        {/* 게시글 탭 - 모두 노출 */}
        <TabsTrigger value="posts" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
          <IconTab3 className="w-4 h-4 mr-2 text-inherit" />
          <span className="text-sm">작성한 게시글</span>
        </TabsTrigger>
      </TabsList>

      {/* 내 정보 탭 */}
      {!isCompany && (
        <TabsContent value="profile" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">현재는 표시할 정보가 없습니다.</p>
        </TabsContent>
      )}

      {/* 댓글, 팔로우, 스타 탭 - 본인 + 개인 사용자일 때만 */}
      {!isCompany && isMyPage && (
        <>
          <TabsContent value="comments" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">작성한 댓글</h2>

            {comments.length === 0 ? (
              <p className="text-sm text-gray-500">작성한 댓글이 없습니다.</p>
            ) : (
              <div className="space-y-4">
                {paginatedComments.map((comment, idx) => (
                  <CommentCard
                    key={idx}
                    postTitle={comment.postTitle}
                    comment={comment.comment}
                    date={comment.date}
                    onClick={() => window.location.href = '#'}
                  />
                ))}
              </div>
            )}

            {totalCommentPages > 1 && (
              <Pagination
                currentPage={currentCommentPage}
                totalPages={totalCommentPages}
                onPageChange={setCurrentCommentPage}
              />
            )}
          </TabsContent>

          <TabsContent value="follow" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex space-x-2 mb-4">
              <button onClick={() => setFollowSubTab('company')} className={`px-4 py-1.5 text-sm rounded-md transition ${followSubTab === 'company' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                기업
              </button>
              <button onClick={() => setFollowSubTab('user')} className={`px-4 py-1.5 text-sm rounded-md transition ${followSubTab === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                개인
              </button>
            </div>

            {followSubTab === 'company' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FollowCompanyCard id="company1" name="Tech Inc" image="https://example.com/company1.png" onClick={() => {}} />
              </div>
            )}

            {followSubTab === 'user' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FollowUserCard id="user1" nickname="개발자" badge="시니어" image="https://example.com/user1.png" onClick={() => {}} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="starred" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">스타 게시글</h2>
            <PostCard post={{ id: 'post1', title: "좋아요 누른 글", thumbnail: "...", tags: ["React"], views: 111, stars: 10, comments: 2 }} />
          </TabsContent>
        </>
      )}

      {/* 게시글 탭 - 모든 사용자 표시 */}
      <TabsContent value="posts" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">작성한 게시글</h2>
        <PostCard post={{ id: 'post1', title: "React와 TypeScript로 시작하는 웹 개발", thumbnail: "...", tags: ["React", "TypeScript"], views: 1234, stars: 56, comments: 23 }} />

        <div className="mt-6 flex justify-center space-x-2">
          <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>이전</Button>
          <Button>{currentPage}</Button>
          <Button onClick={() => setCurrentPage(prev => prev + 1)}>다음</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MyPageTabs;