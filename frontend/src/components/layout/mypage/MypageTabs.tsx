import React, { useState, useEffect } from 'react';

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
import Pagination from '@/components/domain/ServerPagination';
import usePagination from '@/hooks/mypage/usePagination';
import useFetchJson from '@/hooks/mypage/useFetchJson';

// 배지 임포트
import badgeFirstArticle from '@/assets/images/first_article.png';
import badgeFirstComment from '@/assets/images/first_comment.png';
import badgeHelloWorld from '@/assets/images/helloworld.png';

import badgeStar5 from '@/assets/images/star_5.png';
import badgeStar13 from '@/assets/images/star_13.png';
import badgeStar42 from '@/assets/images/star_42.png';

import badgeAmumu from '@/assets/images/amumu.png';
import badgeFCTMI from '@/assets/images/FCTMI.png';
import badgeFollow from '@/assets/images/followmany.png';

import badgelike10 from '@/assets/images/like_10.png';
import badgelike100 from '@/assets/images/like_100.png';
import badgelike1000 from '@/assets/images/like_1000.png';

import badgeView50 from '@/assets/images/view1.png';
import badgeView100 from '@/assets/images/view2.png';
import badgeView1000 from '@/assets/images/view3.png';

import badgeParis from '@/assets/images/paris.png';

import badgeSpring from '@/assets/images/spring.png';
import badgeReact from '@/assets/images/react.png';
import badgeAI from '@/assets/images/AI.png';
import badgeDB from '@/assets/images/DB.png';
import badgeAWS from '@/assets/images/AWS.png';

// 배지 모달
import BadgeModal from '@/components/layout/mypage/BadgeModal';

// 기업 게시글 api
import { getCompanyPosts } from "@/api/company/companyPost";
import type { CompanyPost } from "@/types/company/companyPost";

// 스타 게시글 api
import { fetchStarredPosts } from "@/api/mypage/starService";
import type { Post as StarPost } from "@/types/mypage/star";

// 배지 리스트
const badgeList = [
  { id: 1, name: '이건 머지?', image: badgeFirstArticle, filename: 'first_article.png'},
  { id: 2, name: '얘는 머지?', image: badgeFirstComment, filename: 'first_comment.png'},
  { id: 3, name: '헬로 월드', image: badgeHelloWorld, filename: 'helloworld.png'},
  { id: 4, name: '별이 5개', image: badgeStar5, filename: 'star_5.png'},
  { id: 5, name: '별이 13개', image: badgeStar13, filename: 'star_13.png'},
  { id: 6, name: '별이 42개', image: badgeStar42, filename: 'star_42.png'},
  { id: 7, name: '날선몰', image: badgeAmumu, filename: 'amumu.png'},
  { id: 8, name: 'FC TMI', image: badgeFCTMI, filename: 'fctmi.png'},
  { id: 9, name: '인기 폭발', image: badgeFollow, filename: 'followmany.png'},
  { id: 10, name: '추천 10개', image: badgelike10, filename: 'like_10.png'},
  { id: 11, name: '추천 100개', image: badgelike100, filename: 'like_100.png'},
  { id: 12, name: '천근추', image: badgelike1000, filename: 'like_1000.png'},
  { id: 13, name: '웅성', image: badgeView50, filename: 'view_50.png'},
  { id: 14, name: '웅성웅성', image: badgeView100, filename: 'view_100.png'},
  { id: 15, name: '웅성웅성웅성', image: badgeView1000, filename: 'view_1000.png'},
  { id: 16, name: '벌레잡는 파리채', image: badgeParis, filename: 'paris.png'},
  { id: 18, name: 'Spring', image: badgeSpring, filename: 'spring.png'},
  { id: 19, name: 'React', image: badgeReact, filename: 'react.png'},
  { id: 20, name: 'AI', image: badgeAI, filename: 'ai.png'},
  { id: 21, name: 'DB', image: badgeDB, filename: 'db.png'},
  { id: 22, name: 'AWS', image: badgeAWS, filename: 'aws.png'},

];


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


  // 기업 게시글 API 데이터 상태
  const [companyPosts, setCompanyPosts] = useState<CompanyPost[]>([]);
  const [companyPostTotalPages, setCompanyPostTotalPages] = useState(1);
  const [companyPostTotalElements, setCompanyPostTotalElements] = useState(0);
  
  // 팔로우 탭의 서브 탭 상태 ('company' or 'user')
  const [followSubTab, setFollowSubTab] = useState<'company' | 'user'>('company');
  
  // 배지 모달 상태
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<typeof badgeList[0] | null>(null);

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

  // 기업 게시글 API 호출
  useEffect(() => {
    if (isCompany) {
      getCompanyPosts(9, currentPostPage, 5) // companyId는 나중에 동적 전달
        .then((res) => {
          setCompanyPosts(res.data.posts);
          setCompanyPostTotalPages(res.data.pageInfo.totalPages);
          setCompanyPostTotalElements(res.data.pageInfo.totalElements); // 전체 개수 저장
        })
        .catch(console.error);
    }
  }, [isCompany, currentPostPage]);

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

  // 스타 게시글 API 상태
  const [starredPosts, setStarredPosts] = useState<StarPost[]>([]);
  const [starTotalPages, setStarTotalPages] = useState(1);
  const [starTotalElements, setStarTotalElements] = useState(0);
  const [starLoading, setStarLoading] = useState(true);
  const [starError, setStarError] = useState<string | null>(null);
  const [currentStarPage, setCurrentStarPage] = useState(1);

  // 스타 게시글 API 호출
  useEffect(() => {
    if (isMyPage && isPersonal) {
      setStarLoading(true);
      fetchStarredPosts(1, currentStarPage, 5) // TODO: memberId 동적 전달
        .then((res) => {
          setStarredPosts(res.data.posts);
          setStarTotalPages(res.data.pageInfo.totalPages);
          setStarTotalElements(res.data.pageInfo.totalElements);
        })
        .catch((err) => setStarError(err.message))
        .finally(() => setStarLoading(false));
    }
  }, [isMyPage, isPersonal, currentStarPage]);


  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-[1232px] mx-auto'>
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
            <span className="text-sm">작성한 댓글 ({comments.length})</span>
          </TabsTrigger>
        )}

        {/* 작성한 게시글 (모든 사용자에게 노출) */}
        <TabsTrigger
          value="posts"
          className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
          onClick={() => setCurrentPostPage(1)}  // 페이지 초기화
          >
          <IconTab3 className="w-4 h-4 mr-2 text-inherit" />
          <span className="text-sm">작성한 게시글 ({posts.length})</span>
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
              <span className="text-sm">스타 게시글 ({starredPosts.length})</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>

      {/* 탭 콘텐츠 영역들 */}

      {/* 내 정보 */}
      {(isMyPage || isOtherUser) && isPersonal && (
        <TabsContent value="profile" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">업적</h2>
          <div className="grid grid-cols-7 gap-4">
            {badgeList.map((badge) => (
              <div
                key={badge.id}
                onClick={() => {
                  setSelectedBadge(badge);
                  setIsBadgeModalOpen(true);
                }}
                className="aspect-square bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center hover:shadow-md transition"
              >
                <img src={badge.image} alt={badge.name} className="w-25 h-25 mb-2 rounded-lg object-cover" />
                <p className="text-xl font-bold text-gray-700 text-center">{badge.name}</p>
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
            <Pagination currentPage={currentCommentPage} totalCount={comments.length} pageSize={5} onPageChange={setCurrentCommentPage} />
          )}
        </TabsContent>
      )}

      {/* 게시글 */}
      <TabsContent value="posts" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">작성한 게시글</h2>

        {isCompany ? (
          companyPosts.length === 0 ? (
            <p className="text-sm text-gray-500">게시글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {companyPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={{
                    id: post.postId,
                    title: post.title,
                    thumbnail: post.thumbnailUrl,
                    tags: post.tags,
                    views: post.viewCount,
                    stars: post.starCount,
                    comments: post.commentCount
                  }}
                  onClick={() => window.location.href = `/post/${post.postId}`}
                />
              ))}
            </div>
          )
        ) : (
          paginatedPosts.length === 0 ? (
            <p className="text-sm text-gray-500">게시글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {paginatedPosts.map((post, idx) => (
                <PostCard key={idx} post={post} onClick={() => window.location.href = '#'} />
              ))}
            </div>
          )
        )}

        {isCompany ? (
          companyPostTotalPages > 1 && (
            <Pagination
              currentPage={currentPostPage}
              totalCount={companyPostTotalElements}
              pageSize={5}
              onPageChange={setCurrentPostPage}
            />
          )
        ) : (
          totalPostPages > 1 && (
            <Pagination
              currentPage={currentPostPage}
              totalCount={posts.length}
              pageSize={5}
              onPageChange={setCurrentPostPage}
            />
          )
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
              기업 ({followedCompanies.length})
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
              개인 ({followedUsers.length})
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
                  totalCount={followedCompanies.length}
                  pageSize={9}
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
                  totalCount={followedUsers.length}
                  pageSize={9}
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
          ) : starredPosts.length === 0 ? (
            <p className="text-sm text-gray-500">스타한 게시글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {starredPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={{
                    id: post.postId,
                    title: post.title,
                    thumbnail: post.thumbnailUrl,
                    tags: post.tags,
                    views: post.viewCount,
                    stars: post.starCount,
                    comments: post.commentCount
                  }}
                  onClick={() => window.location.href = `/post/${post.postId}`}
                />
              ))}
            </div>
          )}

          {starTotalPages > 1 && (
            <Pagination
              currentPage={currentStarPage}
              totalCount={starTotalElements}
              pageSize={5}
              onPageChange={setCurrentStarPage}
            />
          )}
        </TabsContent>
      )}

      {/* 배지 모달 */}
      <BadgeModal
        isOpen={isBadgeModalOpen}
        badge={selectedBadge}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </Tabs>
  );
};

export default MyPageTabs;