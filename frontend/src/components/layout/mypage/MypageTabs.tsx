import React, { useState } from 'react';

// 기본 UI 및 컴포넌트 임포트
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/domain/Tabs";
import PostCard from './PostCard';
import CommentCard, { CommentCardProps } from './CommentCard';
import FollowCompanyCard from './FollowCompanyCard';
import FollowUserCard from './FollowUserCard';

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
  
  // FollowCompanyCard용 JSON 데이터 불러오기
  const { data: followedCompanies } = useFetchJson<{
    id: string;
    name: string;
    image: string;
  }>('/mypage_follows_company.json');

  // 페이지네이션 적용
  const {
    currentPage: currentCompanyPage,
    setCurrentPage: setCurrentCompanyPage,
    totalPages: totalCompanyPages,
    paginatedItems: paginatedCompanies
  } = usePagination(followedCompanies, 9); // 한 페이지당 9개로 설정

  // 개인 유저 FollowUserCard용 JSON 데이터 로딩
  const { data: followedUsers } = useFetchJson<{
    id: string;
    nickname: string;
    badge: string;
    image: string;
  }>('/mypage_follows_user.json');

  // 개인 유저 팔로우 페이지네이션
  const {
    currentPage: currentUserPage,
    setCurrentPage: setCurrentUserPage,
    totalPages: totalUserPages,
    paginatedItems: paginatedUsers
  } = usePagination(followedUsers, 9);  // 한 페이지당 9개

  // 스타 게시글 데이터 로딩
  const { data: starredPosts, loading: starLoading, error: starError } =
  useFetchJson<Post>('/mypage_starred_posts.json');

  // 스타게시글 페이지네이션
  const {
    currentPage: currentStarPage,
    setCurrentPage: setCurrentStarPage,
    totalPages: totalStarPages,
    paginatedItems: paginatedStarredPosts,
  } = usePagination<Post>(starredPosts, 5);  // 5개씩 페이지네이션

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
          <TabsTrigger
            value="comments"
            className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
            onClick={() => setCurrentCommentPage(1)}  // 페이지 초기화
            >
            <IconTab2 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">작성한 댓글</span>
          </TabsTrigger>
        )}

        {/* 작성한 게시글 (모든 사용자에게 노출) */}
        <TabsTrigger
          value="posts"
          className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
          onClick={() => setCurrentPostPage(1)}  // 페이지 초기화
          >
          <IconTab3 className="w-4 h-4 mr-2 text-inherit" />
          <span className="text-sm">작성한 게시글</span>
        </TabsTrigger>

        {/* 팔로우 / 스타 게시글 (본인일 때만) */}
        {isMyPage && isPersonal && (
          <>
            <TabsTrigger
              value="follow"
              className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
              onClick={() => {
                setCurrentCompanyPage(1);
                setCurrentUserPage(1);
              }}
            >
              <IconTab4 className="w-4 h-4 mr-2 text-inherit" />
              <span className="text-sm">팔로우</span>
            </TabsTrigger>
            <TabsTrigger
              value="starred"
              className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
              onClick={() => setCurrentStarPage(1)}
              >
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
          <h2 className="text-lg font-semibold mb-6">업적</h2>

          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 17 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center hover:shadow-md transition"
              >
                <div className="w-10 h-10 mb-2 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  ?
                </div>
                <p className="text-xs text-gray-700 font-medium text-center">이건 머지?</p>
              </div>
            ))}
          </div>
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
            <button
              onClick={() => {
                setFollowSubTab('company');
                setCurrentCompanyPage(1); // 기업 탭 선택 시 1페이지로 초기화
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                followSubTab === 'company' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              기업
            </button>
            <button
              onClick={() => {
                setFollowSubTab('user');
                setCurrentUserPage(1); // 개인 탭 선택 시 1페이지로 초기화
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                followSubTab === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              개인
            </button>
          </div>

          {/* 기업 팔로우 목록 */}
          {followSubTab === 'company' && (
            <>
              {paginatedCompanies.length === 0 ? (
                <p className="text-sm text-gray-500">팔로우한 기업이 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedCompanies.map((company) => (
                    <FollowCompanyCard key={company.id} {...company} onClick={() => {}} />
                  ))}
                </div>
              )}
              {totalCompanyPages > 1 && (
                <Pagination
                  currentPage={currentCompanyPage}
                  totalPages={totalCompanyPages}
                  onPageChange={setCurrentCompanyPage}
                />
              )}
            </>
          )}

          {/* 개인 팔로우 목록 */}
          {followSubTab === 'user' && (
            <>
              {paginatedUsers.length === 0 ? (
                <p className="text-sm text-gray-500">팔로우한 유저가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedUsers.map((user) => (
                    <FollowUserCard key={user.id} {...user} onClick={() => {}} />
                  ))}
                </div>
              )}
              {totalUserPages > 1 && (
                <Pagination
                  currentPage={currentUserPage}
                  totalPages={totalUserPages}
                  onPageChange={setCurrentUserPage}
                />
              )}
            </>
          )}
        </TabsContent>
      )}

      {/* 스타 게시글 */}
      {isMyPage && isPersonal && (
        <TabsContent value="starred" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">스타 게시글</h2>

          {starLoading ? (
            <p className="text-sm text-gray-500">불러오는 중...</p>
          ) : starError ? (
            <p className="text-sm text-red-500">에러: {starError}</p>
          ) : paginatedStarredPosts.length === 0 ? (
            <p className="text-sm text-gray-500">스타한 게시글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {paginatedStarredPosts.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => window.location.href = '#'} />
              ))}
            </div>
          )}

          {totalStarPages > 1 && (
            <Pagination
              currentPage={currentStarPage}
              totalPages={totalStarPages}
              onPageChange={setCurrentStarPage}
            />
          )}
        </TabsContent>
      )}
    </Tabs>
  );
};

export default MyPageTabs;