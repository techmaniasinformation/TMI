// src/components/layout/mypage/MypageTabs.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/domain/Tabs";
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import FollowCompanyCard from './FollowCompanyCard';
import FollowUserCard from './FollowUserCard';
import IconTab1 from '@/assets/icons/IconTab1';
import IconTab2 from '@/assets/icons/IconTab2';
import IconTab3 from '@/assets/icons/IconTab3';
import IconTab4 from '@/assets/icons/IconTab4';
import IconTab5 from '@/assets/icons/IconTab5';
import ServerPagination from '@/components/domain/ServerPagination';

// 이미지
import ai_1 from '@/assets/images/ai_1.png';
import amumu from '@/assets/images/amumu.png';
import aws_1 from '@/assets/images/aws_1.png';
import db_1 from '@/assets/images/db_1.png';
import fctmi_1 from '@/assets/images/fctmi_1.png';
import first_article from '@/assets/images/first_article.png';
import first_comment from '@/assets/images/first_comment.png';
import followmany from '@/assets/images/followmany.png';
import helloworld from '@/assets/images/helloworld.png';
import like10 from '@/assets/images/like10.png';
import like100 from '@/assets/images/like100.png';
import like1000 from '@/assets/images/like1000.png';
import paris from '@/assets/images/paris.png';
import react from '@/assets/images/react.png';
import spring from '@/assets/images/spring.png';
import star_5 from '@/assets/images/star_5.png';
import star_13 from '@/assets/images/star_13.png';
import star_42 from '@/assets/images/star_42.png';
import view1 from '@/assets/images/view1.png';
import view2 from '@/assets/images/view2.png';
import view3 from '@/assets/images/view3.png';
import locked from '@/assets/images/locked.png';
const badgeImages = {
  'ai_1.png': ai_1,
  'amumu.png': amumu,
  'aws_1.png': aws_1,
  'db_1.png': db_1,
  'fctmi_1.png': fctmi_1,
  'first_article.png': first_article,
  'first_comment.png': first_comment,
  'followmany.png': followmany,
  'helloworld.png': helloworld,
  'like10.png': like10,
  'like100.png': like100,
  'like1000.png': like1000,
  'paris.png': paris,
  'react.png': react,
  'spring.png': spring,
  'star_5.png': star_5,
  'star_13.png': star_13,
  'star_42.png': star_42,
  'view_50.png': view1,
  'view_100.png': view2,
  'view_1000.png': view3,
  'locked.png': locked
};
import BadgeModal from '@/components/layout/mypage/BadgeModal';

// ✅ 통합 API 모듈 사용
import { fetchAllBadges } from "@/api/mypage/badgeService"; // (전체 메타가 별도 서비스에 있다면 유지)
import { fetchMemberBadges } from "@/api/mypage/badgeService";
import { getCompanyPosts } from "@/api/company/companyPost";
import { fetchStarredPosts } from "@/api/mypage/starService";
import { fetchMemberComments } from "@/api/mypage/commentService";
import { fetchMemberPosts } from "@/api/mypage/postService";
import { getCompanyFollows, getMemberFollows } from '@/api/followService';
const MyPageTabs = ({
  isCompany,
  isMyPage,
  activeTab,
  setActiveTab,
  currentPage,
  setCurrentPage,
  onRepresentativeBadgeChange
}) => {
  const isPersonal = !isCompany;
  const isOtherUser = isPersonal && !isMyPage;
  const canOpenBadgeModal = isMyPage && isPersonal;
  const {
    id
  } = useParams();
  // [FIX] 안전한 파싱 (기본값 0으로 가드)
  const routeId = id ? Number(id) : 0;

  // [FIX] 유효하지 않은 id일 때 0으로 두어 API 호출 가드
  const memberId = isPersonal ? routeId : 0;
  const companyId = isCompany ? routeId : null;
  const HIDDEN_BADGE_IDS = new Set([22]);

  // 배지 상태
  const [allBadges, setAllBadges] = useState([]);
  const [memberBadges, setMemberBadges] = useState([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // 서버 재조회
  const refetchMemberBadges = async () => {
    if (!memberId) return;
    try {
      const list = await fetchMemberBadges(memberId);
      setMemberBadges(list);
      const rep = list.find(mb => mb.isRepresentative);
      if (onRepresentativeBadgeChange) {
        if (rep) {
          const meta = allBadges.find(b => b.badgeId === rep.badgeId);
          if (meta?.badgeUrl) {
            const badgeImage = badgeImages[meta.badgeUrl] || '/fallback.png';
            onRepresentativeBadgeChange({
              badgeId: rep.badgeId,
              badgeUrl: badgeImage
            });
          } else {
            onRepresentativeBadgeChange({
              badgeId: rep.badgeId,
              badgeUrl: null
            });
          }
        } else {
          onRepresentativeBadgeChange({
            badgeId: null,
            badgeUrl: null
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  function getBadgeNameByUrl(all, url) {
    if (!url) return undefined;
    const file = url.split('/').pop() || url;
    const hit = all.find(b => (b.badgeUrl.split('/').pop() || b.badgeUrl) === file);
    return hit?.name;
  }

  // 초기 로드
  useEffect(() => {
    if ((isMyPage || isOtherUser) && isPersonal && memberId > 0) {
      fetchAllBadges().then(setAllBadges).catch(console.error);
      fetchMemberBadges(memberId).then(setMemberBadges).catch(console.error);
    }
  }, [isMyPage, isOtherUser, isPersonal, memberId]);

  // 대표배지 변경 → 상단 동기화
  useEffect(() => {
    const rep = memberBadges.find(mb => mb.isRepresentative);
    if (onRepresentativeBadgeChange) {
      if (rep) {
        const meta = allBadges.find(b => b.badgeId === rep.badgeId);
        if (meta?.badgeUrl) {
          const badgeImage = badgeImages[meta.badgeUrl] || '/fallback.png';
          onRepresentativeBadgeChange({
            badgeId: rep.badgeId,
            badgeUrl: badgeImage
          });
        } else {
          onRepresentativeBadgeChange({
            badgeId: rep.badgeId,
            badgeUrl: null
          });
        }
      } else {
        onRepresentativeBadgeChange({
          badgeId: null,
          badgeUrl: null
        });
      }
    }
  }, [memberBadges, allBadges, onRepresentativeBadgeChange]);

  /* 댓글 */
  const [comments, setComments] = useState([]);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [commentTotalElements, setCommentTotalElements] = useState(0);
  const [commentLoading, setCommentLoading] = useState(true);
  const [commentError, setCommentError] = useState(null);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      setCommentLoading(true);
      fetchMemberComments(memberId, currentCommentPage, 5).then(({
        comments,
        pageInfo
      }) => {
        setComments(comments);
        setCommentTotalPages(pageInfo.totalPages);
        setCommentTotalElements(pageInfo.totalElements);
      }).catch(err => setCommentError(err.message)).finally(() => setCommentLoading(false));
    }
  }, [isMyPage, isPersonal, memberId, currentCommentPage]);

  /* 작성한 게시글(개인/기업) */
  const [memberPosts, setMemberPosts] = useState([]);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [postTotalElements, setPostTotalElements] = useState(0);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  const [currentPostPage, setCurrentPostPage] = useState(1);
  useEffect(() => {
    if (isPersonal && memberId > 0) {
      setPostLoading(true);
      fetchMemberPosts(memberId, currentPostPage, 5).then(res => {
        setMemberPosts(res.data.posts);
        setPostTotalPages(res.data.pageInfo.totalPages);
        setPostTotalElements(res.data.pageInfo.totalElements);
      }).catch(err => setPostError(err.message)).finally(() => setPostLoading(false));
    }
  }, [isPersonal, memberId, currentPostPage]);
  const [companyPosts, setCompanyPosts] = useState([]);
  const [companyPostTotalPages, setCompanyPostTotalPages] = useState(1);
  const [companyPostTotalElements, setCompanyPostTotalElements] = useState(0);
  const [companyPostLoading, setCompanyPostLoading] = useState(true);
  useEffect(() => {
    if (isCompany && companyId != null && companyId > 0) {
      setCompanyPostLoading(true);
      getCompanyPosts(companyId, currentPostPage, 5).then(res => {
        setCompanyPosts(res.data.posts);
        setCompanyPostTotalPages(res.data.pageInfo.totalPages);
        setCompanyPostTotalElements(res.data.pageInfo.totalElements);
      }).catch(console.error).finally(() => setCompanyPostLoading(false));
    }
  }, [isCompany, companyId, currentPostPage]);

  /* 팔로우 */
  const [followSubTab, setFollowSubTab] = useState('company');
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [totalCompanyPages, setTotalCompanyPages] = useState(1);
  const [currentCompanyPage, setCurrentCompanyPage] = useState(1);
  const [companyTotalElements, setCompanyTotalElements] = useState(0);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [userTotalElements, setUserTotalElements] = useState(0);
  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      getCompanyFollows(memberId, currentCompanyPage - 1, 9).then(res => {
        setFollowedCompanies(res.data.companyFollows);
        setTotalCompanyPages(res.data.pageInfo.totalPages);
        setCompanyTotalElements(res.data.pageInfo.totalElements);
      }).catch(console.error);
    }
  }, [isMyPage, isPersonal, memberId, currentCompanyPage]);
  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      getMemberFollows(memberId, currentUserPage - 1, 9).then(res => {
        setFollowedUsers(res.data.memberFollows);
        setTotalUserPages(res.data.pageInfo.totalPages);
        setUserTotalElements(res.data.pageInfo.totalElements);
      }).catch(console.error);
    }
  }, [isMyPage, isPersonal, memberId, currentUserPage]);

  /* 스타 게시글 */
  const [starredPosts, setStarredPosts] = useState([]);
  const [starTotalPages, setStarTotalPages] = useState(1);
  const [starTotalElements, setStarTotalElements] = useState(0);
  const [starLoading, setStarLoading] = useState(true);
  const [starError, setStarError] = useState(null);
  const [currentStarPage, setCurrentStarPage] = useState(1);
  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      setStarLoading(true);
      fetchStarredPosts(memberId, currentStarPage, 5).then(res => {
        setStarredPosts(res.data.posts);
        setStarTotalPages(res.data.pageInfo.totalPages);
        setStarTotalElements(res.data.pageInfo.totalElements);
      }).catch(err => setStarError(err.message)).finally(() => setStarLoading(false));
    }
  }, [isMyPage, isPersonal, memberId, currentStarPage]);

  /* 렌더링 */
  return /*#__PURE__*/React.createElement(Tabs, {
    value: activeTab,
    onValueChange: v => setActiveTab(v),
    className: "w-full max-w-[1232px] mx-auto"
  }, /*#__PURE__*/React.createElement(TabsList, {
    className: "bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 w-full flex flex-wrap justify-start p-0 h-auto"
  }, (isMyPage || isOtherUser) && isPersonal && /*#__PURE__*/React.createElement(TabsTrigger, {
    value: "profile",
    className: "flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
  }, /*#__PURE__*/React.createElement(IconTab1, {
    className: "w-4 h-4 mr-2 text-inherit"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\uB0B4 \uC815\uBCF4")), isMyPage && isPersonal && /*#__PURE__*/React.createElement(TabsTrigger, {
    value: "comments",
    className: "flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600",
    onClick: () => setCurrentCommentPage(1)
  }, /*#__PURE__*/React.createElement(IconTab2, {
    className: "w-4 h-4 mr-2 text-inherit"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\uC791\uC131\uD55C \uB313\uAE00 (", commentTotalElements, ")")), /*#__PURE__*/React.createElement(TabsTrigger, {
    value: "posts",
    className: "flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600",
    onClick: () => setCurrentPostPage(1)
  }, /*#__PURE__*/React.createElement(IconTab3, {
    className: "w-4 h-4 mr-2 text-inherit"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\uC791\uC131\uD55C \uAC8C\uC2DC\uAE00 (", isCompany ? companyPostTotalElements : postTotalElements, ")")), isMyPage && isPersonal && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TabsTrigger, {
    value: "follow",
    className: "flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600",
    onClick: () => {
      setCurrentCompanyPage(1);
      setCurrentUserPage(1);
    }
  }, /*#__PURE__*/React.createElement(IconTab4, {
    className: "w-4 h-4 mr-2 text-inherit"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\uD314\uB85C\uC6B0 (", companyTotalElements + userTotalElements, ")")), /*#__PURE__*/React.createElement(TabsTrigger, {
    value: "starred",
    className: "flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600",
    onClick: () => setCurrentStarPage(1)
  }, /*#__PURE__*/React.createElement(IconTab5, {
    className: "w-4 h-4 mr-2 text-inherit"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\uC2A4\uD0C0 \uAC8C\uC2DC\uAE00 (", starTotalElements, ")")))), (isMyPage || isOtherUser) && isPersonal && /*#__PURE__*/React.createElement(TabsContent, {
    value: "profile",
    className: "p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-6 text-gray-900 dark:text-white"
  }, "\uC5C5\uC801"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4"
  }, [...allBadges].filter(b => !HIDDEN_BADGE_IDS.has(b.badgeId)).sort((a, b) => {
    const aHas = memberBadges.some(mb => mb.badgeId === a.badgeId);
    const bHas = memberBadges.some(mb => mb.badgeId === b.badgeId);
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return a.badgeId - b.badgeId;
  }).map(badge => {
    const hasBadge = memberBadges.some(mb => mb.badgeId === badge.badgeId);
    const matchedBadge = hasBadge ? memberBadges.find(mb => mb.badgeId === badge.badgeId) : null;
    const handleClick = () => {
      if (!canOpenBadgeModal || !hasBadge) return;
      setSelectedBadge({
        ...badge,
        memberBadgeId: matchedBadge?.memberBadgeId,
        receivedAt: matchedBadge?.receivedAt ?? null,
        isRepresentative: matchedBadge?.isRepresentative ?? false
      });
      setIsBadgeModalOpen(true);
    };
    return /*#__PURE__*/React.createElement("div", {
      key: badge.badgeId,
      onClick: handleClick,
      className: `aspect-square border rounded-xl shadow-sm flex flex-col items-center justify-center transition 
                      ${hasBadge ? canOpenBadgeModal ? 'cursor-pointer hover:shadow-md border-purple-600' : 'cursor-default border-purple-600' : 'cursor-not-allowed border-gray-300 dark:border-gray-600 opacity-50'}`,
      "aria-disabled": !canOpenBadgeModal,
      title: canOpenBadgeModal ? badge.name : undefined
    }, /*#__PURE__*/React.createElement("img", {
      src: hasBadge ? badgeImages[badge.badgeUrl] || '/fallback.png' : badgeImages['locked.png'] || '/fallback.png',
      alt: badge.name,
      className: "w-20 h-20 mb-2 rounded-lg object-contain"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-center text-gray-700 dark:text-gray-200"
    }, badge.name));
  }))), isMyPage && isPersonal && /*#__PURE__*/React.createElement(TabsContent, {
    value: "comments",
    className: "p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-4 text-gray-900 dark:text-white"
  }, "\uC791\uC131\uD55C \uB313\uAE00"), commentLoading ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uBD88\uB7EC\uC624\uB294 \uC911...") : commentError ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-red-500 dark:text-red-400"
  }, "\uC5D0\uB7EC: ", commentError) : comments.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uC791\uC131\uD55C \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, comments.map(comment => /*#__PURE__*/React.createElement(CommentCard, {
    key: comment.commentId,
    postTitle: comment.title,
    comment: comment.comment,
    date: comment.createAt,
    onClick: () => window.location.href = `/post/${comment.postId}`
  }))), commentTotalPages > 1 && /*#__PURE__*/React.createElement(ServerPagination, {
    currentPage: currentCommentPage,
    totalCount: commentTotalElements,
    pageSize: 5,
    onPageChange: setCurrentCommentPage
  })), /*#__PURE__*/React.createElement(TabsContent, {
    value: "posts",
    className: "p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-4 text-gray-900 dark:text-white"
  }, "\uC791\uC131\uD55C \uAC8C\uC2DC\uAE00"), isCompany ? companyPostLoading ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uBD88\uB7EC\uC624\uB294 \uC911...") : companyPosts.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, companyPosts.map(post => /*#__PURE__*/React.createElement(PostCard, {
    key: post.postId,
    post: {
      id: post.postId,
      title: post.title,
      thumbnail: post.thumbnailUrl,
      tags: post.tags,
      views: post.viewCount,
      stars: post.starCount,
      comments: post.commentCount
    },
    onClick: () => window.location.href = `/post/${post.postId}`
  }))), companyPostTotalPages > 1 && /*#__PURE__*/React.createElement(ServerPagination, {
    currentPage: currentPostPage,
    totalCount: companyPostTotalElements,
    pageSize: 5,
    onPageChange: setCurrentPostPage
  })) : postLoading ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uBD88\uB7EC\uC624\uB294 \uC911...") : postError ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-red-500 dark:text-red-400"
  }, "\uC5D0\uB7EC: ", postError) : memberPosts.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, memberPosts.map(post => /*#__PURE__*/React.createElement(PostCard, {
    key: post.postId,
    post: {
      id: post.postId,
      title: post.title,
      thumbnail: post.thumbnailUrl,
      tags: post.tags,
      views: post.viewCount,
      stars: post.starCount,
      comments: post.commentCount
    },
    onClick: () => window.location.href = `/post/${post.postId}`
  }))), postTotalPages > 1 && /*#__PURE__*/React.createElement(ServerPagination, {
    currentPage: currentPostPage,
    totalCount: postTotalElements,
    pageSize: 5,
    onPageChange: setCurrentPostPage
  }))), isMyPage && isPersonal && /*#__PURE__*/React.createElement(TabsContent, {
    value: "follow",
    className: "p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-2 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setFollowSubTab('company');
      setCurrentCompanyPage(1);
    },
    className: `px-4 py-1.5 text-sm rounded-md transition ${followSubTab === 'company' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`
  }, "\uAE30\uC5C5 (", companyTotalElements, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setFollowSubTab('user');
      setCurrentUserPage(1);
    },
    className: `px-4 py-1.5 text-sm rounded-md transition ${followSubTab === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`
  }, "\uAC1C\uC778 (", userTotalElements, ")")), followSubTab === 'company' && /*#__PURE__*/React.createElement(React.Fragment, null, followedCompanies.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uD314\uB85C\uC6B0\uD55C \uAE30\uC5C5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full"
  }, followedCompanies.map(company => /*#__PURE__*/React.createElement(FollowCompanyCard, {
    key: company.companyFollowId,
    id: company.companyId,
    name: company.name,
    image: company.companyProfileUrl,
    onClick: () => window.location.href = `/company/${company.companyId}`
  }))), totalCompanyPages > 1 && /*#__PURE__*/React.createElement(ServerPagination, {
    currentPage: currentCompanyPage,
    totalCount: companyTotalElements,
    pageSize: 9,
    onPageChange: setCurrentCompanyPage
  })), followSubTab === 'user' && /*#__PURE__*/React.createElement(React.Fragment, null, followedUsers.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uD314\uB85C\uC6B0\uD55C \uC720\uC800\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4 w-full max-w-full"
  }, followedUsers.map(user => /*#__PURE__*/React.createElement(FollowUserCard, {
    key: user.memberFollowId,
    id: user.memberId,
    nickname: user.nickname,
    image: user.memberProfileUrl,
    badgeName: getBadgeNameByUrl(allBadges, user.badgeUrl),
    onClick: () => window.location.href = `/member/${user.memberId}`
  }))), totalUserPages > 1 && /*#__PURE__*/React.createElement(ServerPagination, {
    currentPage: currentUserPage,
    totalCount: userTotalElements,
    pageSize: 9,
    onPageChange: setCurrentUserPage
  }))), isMyPage && isPersonal && /*#__PURE__*/React.createElement(TabsContent, {
    value: "starred",
    className: "p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-4 text-gray-900 dark:text-white"
  }, "\uC2A4\uD0C0 \uAC8C\uC2DC\uAE00"), starLoading ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uBD88\uB7EC\uC624\uB294 \uC911...") : starError ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-red-500 dark:text-red-400"
  }, "\uC5D0\uB7EC: ", starError) : starredPosts.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text_sm text-gray-500 dark:text-gray-400"
  }, "\uC2A4\uD0C0\uD55C \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, starredPosts.map(post => /*#__PURE__*/React.createElement(PostCard, {
    key: post.postId,
    post: {
      id: post.postId,
      title: post.title,
      thumbnail: post.thumbnailUrl,
      tags: post.tags,
      views: post.viewCount,
      stars: post.starCount,
      comments: post.commentCount
    },
    onClick: () => window.location.href = `/post/${post.postId}`
  }))), starTotalPages > 1 && /*#__PURE__*/React.createElement(ServerPagination, {
    currentPage: currentStarPage,
    totalCount: starTotalElements,
    pageSize: 5,
    onPageChange: setCurrentStarPage
  })), canOpenBadgeModal && isBadgeModalOpen && selectedBadge && /*#__PURE__*/React.createElement(BadgeModal, {
    isOpen: isBadgeModalOpen,
    badge: selectedBadge,
    onClose: () => setIsBadgeModalOpen(false),
    onRefetch: refetchMemberBadges,
    allMemberBadges: memberBadges.map(mb => ({
      badgeId: mb.badgeId,
      memberBadgeId: mb.memberBadgeId
    }))
  }));
};
export default MyPageTabs;