import React, { useState } from 'react';

// 기본 UI 및 컴포넌트 임포트
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/domain/Tabs";
import PostCard from './PostCard';
import CommentCard, { CommentCardProps } from './CommentCard';
import FollowCompanyCard from './FollowCompanyCard';
import FollowUserCard from './FollowUserCard';
import { Button } from '@/components/foundation/button';

// 아이콘 컴포넌트
import IconTab1 from '@/assets/icons/IconTab1';
import IconTab2 from '@/assets/icons/IconTab2';
import IconTab3 from '@/assets/icons/IconTab3';
import IconTab4 from '@/assets/icons/IconTab4';
import IconTab5 from '@/assets/icons/IconTab5';

// 훅
import Pagination from '@/components/domain/Pagination';
import usePagination from '@/hooks/mypage/usePagination';
import useFetchJson from '@/hooks/mypage/useFetchJson';

// 게시글 타입 정의
interface Post {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  views: number;
  stars: number;
  comments: number;
}

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

const MyPageTabs: React.FC<MyPageTabsProps> = ({
  isCompany,
  isMyPage,
  activeTab,
  setActiveTab,
  userStats,
  currentPage,
  setCurrentPage
}) => {
  // 현재 페이지가 개인(회사 아님)인지 여부
  const isPersonal = !isCompany;
  const isOtherUser = isPersonal && !isMyPage;

  // 팔로우 탭의 서브 탭 상태 ('company' or 'user')
  const [followSubTab, setFollowSubTab] = useState<'company' | 'user'>('company');

  // 댓글 데이터 로딩
  const { data: comments } = useFetchJson<CommentCardProps>('/mypage_comments.json');
  const {
    currentPage: currentCommentPage,
    setCurrentPage: setCurrentCommentPage,
    totalPages: totalCommentPages,
    paginatedItems: paginatedComments
  } = usePagination<CommentCardProps>(comments, 5);

  // 게시글 데이터 로딩
  const { data: posts } = useFetchJson<Post>('/mypage_posts.json');
  const {
    currentPage: currentPostPage,
    setCurrentPage: setCurrentPostPage,
    totalPages: totalPostPages,
    paginatedItems: paginatedPosts
  } = usePagination<Post>(posts, 5);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-[1232px]'>
      {/* 탭 목록 */}
      <TabsList className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 w-full flex justify-start p-0 h-auto">
        {/* 내 정보 (본인 또는 타 유저일 때) */}
        {(isMyPage || isOtherUser) && isPersonal && (
          <TabsTrigger value="profile" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
            <IconTab1 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">내 정보</span>
          </TabsTrigger>
        )}

        {/* 작성한 댓글 (본인일 때) */}
        {isMyPage && isPersonal && (
          <TabsTrigger value="comments" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
            <IconTab2 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">작성한 댓글</span>
          </TabsTrigger>
        )}

        {/* 작성한 게시글 (모든 사용자에게 노출) */}
        <TabsTrigger value="posts" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
          <IconTab3 className="w-4 h-4 mr-2 text-inherit" />
          <span className="text-sm">작성한 게시글</span>
        </TabsTrigger>

        {/* 팔로우 / 스타 게시글 (본인일 때만) */}
        {isMyPage && isPersonal && (
          <>
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
      </TabsList>

      {/* 탭 콘텐츠 영역들 */}

      {/* 내 정보 */}
      {(isMyPage || isOtherUser) && isPersonal && (
        <TabsContent value="profile" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">현재는 표시할 정보가 없습니다.</p>
        </TabsContent>
      )}

      {/* 댓글 */}
      {isMyPage && isPersonal && (
        <TabsContent value="comments" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">작성한 댓글</h2>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">작성한 댓글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {paginatedComments.map((comment, idx) => (
                <CommentCard key={idx} {...comment} onClick={() => window.location.href = '#'} />
              ))}
            </div>
          )}
          {totalCommentPages > 1 && (
            <Pagination currentPage={currentCommentPage} totalPages={totalCommentPages} onPageChange={setCurrentCommentPage} />
          )}
        </TabsContent>
      )}

      {/* 게시글 */}
      <TabsContent value="posts" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">작성한 게시글</h2>
        {paginatedPosts.length === 0 ? (
          <p className="text-sm text-gray-500">게시글이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {paginatedPosts.map((post, idx) => (
              <PostCard key={idx} post={post} onClick={() => window.location.href = '#'} />
            ))}
          </div>
        )}
        {totalPostPages > 1 && (
          <Pagination currentPage={currentPostPage} totalPages={totalPostPages} onPageChange={setCurrentPostPage} />
        )}
      </TabsContent>

      {/* 팔로우 */}
      {isMyPage && isPersonal && (
        <TabsContent value="follow" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* 서브 탭 버튼 */}
          <div className="flex space-x-2 mb-4">
            <button onClick={() => setFollowSubTab('company')} className={`px-4 py-1.5 text-sm rounded-md transition ${followSubTab === 'company' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              기업
            </button>
            <button onClick={() => setFollowSubTab('user')} className={`px-4 py-1.5 text-sm rounded-md transition ${followSubTab === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              개인
            </button>
          </div>

          {/* 기업 탭 */}
          {followSubTab === 'company' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FollowCompanyCard id="company1" name="Tech Inc" image="https://example.com/company1.png" onClick={() => {}} />
            </div>
          )}

          {/* 개인 탭 */}
          {followSubTab === 'user' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FollowUserCard id="user1" nickname="개발자" badge="시니어" image="https://example.com/user1.png" onClick={() => {}} />
            </div>
          )}
        </TabsContent>
      )}

      {/* 스타 게시글 */}
      {isMyPage && isPersonal && (
        <TabsContent value="starred" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">스타 게시글</h2>
          {/* 임시 데이터 */}
          <PostCard post={{ id: 'post1', title: "좋아요 누른 글", thumbnail: "...", tags: ["React"], views: 111, stars: 10, comments: 2 }} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default MyPageTabs;