import { useState, useEffect } from 'react';
import { useProfileData } from './useProfileData';
import { useProfileSave } from './useProfileSave';
import { useProfileManagement } from './useProfileManagement';
import { useStarManagement } from './useStarManagement';
import { useFollowManagement } from './useFollowManagement';
import { useBadgeManagement } from './useBadgeManagement';
import { useCommentManagement } from './useCommentManagement';
import { usePostManagement } from './usePostManagement';
import { useCompanyData } from './useCompanyData';

// ===== 통합 Mypage Hook =====
interface UseMypageOptions {
  mode: 'profile' | 'stars' | 'follows' | 'badges' | 'comments' | 'posts' | 'company';
  userId?: number;
  isMyPage?: boolean;
  isPersonal?: boolean;
  isCompany?: boolean;
  routeId?: number;
  initialData?: any;
}

interface MypageState {
  // Profile 모드 상태
  profile?: {
    modalInit: any;
    nicknameDaysLeft: number;
    refreshKey: number;
  };
  
  // Stars 모드 상태
  stars?: {
    starredPosts: any[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
  
  // Follows 모드 상태
  follows?: {
    followedUsers: any[];
    followedCompanies: any[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
  
  // Badges 모드 상태
  badges?: {
    allBadges: any[];
    memberBadges: any[];
    isModalOpen: boolean;
  };
  
  // Comments 모드 상태
  comments?: {
    comments: any[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
  
  // Posts 모드 상태
  posts?: {
    memberPosts: any[];
    companyPosts: any[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
  
  // Company 모드 상태
  company?: {
    company: any;
    loading: boolean;
    lastUpdateText: string;
  };
}

interface MypageActions {
  // Profile 액션
  profile?: {
    saveProfile: (data: any) => Promise<void>;
  };
  
  // Stars 액션
  stars?: {
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    removeStar: (postId: number) => Promise<void>;
  };
  
  // Follows 액션
  follows?: {
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    unfollowUser: (userId: number) => Promise<void>;
    unfollowCompany: (companyId: number) => Promise<void>;
  };
  
  // Badges 액션
  badges?: {
    openModal: () => void;
    closeModal: () => void;
    setRepresentativeBadge: (badgeId: number) => Promise<void>;
    refreshBadges: () => Promise<void>;
  };
  
  // Comments 액션
  comments?: {
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    deleteComment: (commentId: number) => Promise<void>;
  };
  
  // Posts 액션
  posts?: {
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    deletePost: (postId: number) => Promise<void>;
  };
  
  // Company 액션
  company?: {
    toggleFollow: () => Promise<void>;
    refresh: () => Promise<void>;
  };
}

interface MypageServices {
  // 공통 서비스
  common: {
    validateData: (data: any, type: string) => Record<string, string>;
    formatData: (data: any, type: string) => any;
  };
  
  // 모드별 서비스
  profile?: any;
  stars?: any;
  follows?: any;
  badges?: any;
  comments?: any;
  posts?: any;
  company?: any;
}

export function useMypage(options: UseMypageOptions) {
  const { 
    mode, 
    userId, 
    isMyPage = false, 
    isPersonal = false, 
    isCompany = false, 
    routeId = 0,
    initialData 
  } = options;
  
  // 공통 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 모드별 상태 초기화
  const [state, setState] = useState<MypageState>({});
  
  // Profile 관련 Hook
  const profileManagement = useProfileManagement(isMyPage, userId, isCompany);
  
  // Management Hook들
  const starManagement = useStarManagement(isMyPage, isPersonal, userId || 0);
  const followManagement = useFollowManagement(isMyPage, isPersonal, userId || 0);
  const badgeManagement = useBadgeManagement(isMyPage, false, isPersonal, userId || 0);
  const commentManagement = useCommentManagement(isMyPage, isPersonal, userId || 0);
  const postManagement = usePostManagement(isPersonal, isCompany, userId || 0, null);
  
  // Data Hook들
  const companyData = useCompanyData(isCompany, routeId);
  
  // 모드별 상태 설정
  useEffect(() => {
    if (mode === 'profile') {
      setState(prev => ({
        ...prev,
        profile: {
          modalInit: profileManagement.modalInit,
          nicknameDaysLeft: profileManagement.nicknameDaysLeft,
          refreshKey: profileManagement.refreshKey,
        }
      }));
    }
    
    if (mode === 'stars') {
      setState(prev => ({
        ...prev,
        stars: {
          starredPosts: starManagement.starredPosts,
          currentPage: starManagement.currentStarPage,
          totalPages: starManagement.starTotalPages,
          hasMore: starManagement.currentStarPage < starManagement.starTotalPages,
        }
      }));
    }
    
    if (mode === 'follows') {
      setState(prev => ({
        ...prev,
        follows: {
          followedUsers: followManagement.followedUsers,
          followedCompanies: followManagement.followedCompanies,
          currentPage: followManagement.followSubTab === 'company' 
            ? followManagement.currentCompanyPage 
            : followManagement.currentUserPage,
          totalPages: followManagement.followSubTab === 'company' 
            ? followManagement.totalCompanyPages 
            : followManagement.totalUserPages,
          hasMore: followManagement.followSubTab === 'company' 
            ? followManagement.currentCompanyPage < followManagement.totalCompanyPages
            : followManagement.currentUserPage < followManagement.totalUserPages,
        }
      }));
    }
    
    if (mode === 'badges') {
      setState(prev => ({
        ...prev,
        badges: {
          allBadges: badgeManagement.allBadges,
          memberBadges: badgeManagement.memberBadges,
          isModalOpen: badgeManagement.isBadgeModalOpen,
        }
      }));
    }
    
    if (mode === 'comments') {
      setState(prev => ({
        ...prev,
        comments: {
          comments: commentManagement.comments,
          currentPage: commentManagement.currentCommentPage,
          totalPages: commentManagement.commentTotalPages,
          hasMore: commentManagement.currentCommentPage < commentManagement.commentTotalPages,
        }
      }));
    }
    
    if (mode === 'posts') {
      setState(prev => ({
        ...prev,
        posts: {
          memberPosts: postManagement.memberPosts,
          companyPosts: postManagement.companyPosts,
          currentPage: postManagement.currentPostPage,
          totalPages: postManagement.postTotalPages,
          hasMore: postManagement.currentPostPage < postManagement.postTotalPages,
        }
      }));
    }
    
    if (mode === 'company') {
      setState(prev => ({
        ...prev,
        company: {
          company: companyData.company,
          loading: companyData.loading,
          lastUpdateText: companyData.lastUpdateText,
        }
      }));
    }
  }, [
    mode,
    profileManagement,
    starManagement,
    followManagement,
    badgeManagement,
    commentManagement,
    postManagement,
    companyData
  ]);
  
  // 통합된 액션들
  const actions: MypageActions = {
    profile: mode === 'profile' ? {
      saveProfile: async (data: any) => {
        setLoading(true);
        setError(null);
        try {
          const result = await profileManagement.handleProfileSave(
            data.nickname,
            data.blogUrl,
            data.githubUrl,
            data.profileUrl,
            data.file
          );
          if (!result) {
            throw new Error('프로필 저장에 실패했습니다.');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '프로필 저장 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
    
    stars: mode === 'stars' ? {
      loadMore: async () => {
        setLoading(true);
        setError(null);
        try {
          const nextPage = starManagement.currentStarPage + 1;
          if (nextPage <= starManagement.starTotalPages) {
            starManagement.setCurrentStarPage(nextPage);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '더 많은 스타 게시글을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      refresh: async () => {
        setLoading(true);
        setError(null);
        try {
          starManagement.setCurrentStarPage(1);
        } catch (err) {
          setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      removeStar: async (postId: number) => {
        setLoading(true);
        setError(null);
        try {
          // 스타 제거 로직은 별도 API 호출 필요
          console.log('스타 제거:', postId);
        } catch (err) {
          setError(err instanceof Error ? err.message : '스타 제거 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
    
    follows: mode === 'follows' ? {
      loadMore: async () => {
        setLoading(true);
        setError(null);
        try {
          if (followManagement.followSubTab === 'company') {
            const nextPage = followManagement.currentCompanyPage + 1;
            if (nextPage <= followManagement.totalCompanyPages) {
              followManagement.setCurrentCompanyPage(nextPage);
            }
          } else {
            const nextPage = followManagement.currentUserPage + 1;
            if (nextPage <= followManagement.totalUserPages) {
              followManagement.setCurrentUserPage(nextPage);
            }
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '더 많은 팔로우를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      refresh: async () => {
        setLoading(true);
        setError(null);
        try {
          if (followManagement.followSubTab === 'company') {
            followManagement.setCurrentCompanyPage(1);
          } else {
            followManagement.setCurrentUserPage(1);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      unfollowUser: async (userId: number) => {
        setLoading(true);
        setError(null);
        try {
          // 언팔로우 로직은 별도 API 호출 필요
          console.log('사용자 언팔로우:', userId);
        } catch (err) {
          setError(err instanceof Error ? err.message : '사용자 언팔로우 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      unfollowCompany: async (companyId: number) => {
        setLoading(true);
        setError(null);
        try {
          // 언팔로우 로직은 별도 API 호출 필요
          console.log('기업 언팔로우:', companyId);
        } catch (err) {
          setError(err instanceof Error ? err.message : '기업 언팔로우 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
    
    badges: mode === 'badges' ? {
      openModal: () => {
        badgeManagement.handleBadgeClick(badgeManagement.selectedBadge || badgeManagement.allBadges[0]);
      },
      closeModal: () => {
        badgeManagement.handleBadgeModalClose();
      },
      setRepresentativeBadge: async (badgeId: number) => {
        setLoading(true);
        setError(null);
        try {
          // 대표 배지 설정 로직은 별도 API 호출 필요
          console.log('대표 배지 설정:', badgeId);
          await badgeManagement.refetchMemberBadges();
        } catch (err) {
          setError(err instanceof Error ? err.message : '대표 배지 설정 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      refreshBadges: async () => {
        setLoading(true);
        setError(null);
        try {
          await badgeManagement.refetchMemberBadges();
        } catch (err) {
          setError(err instanceof Error ? err.message : '배지 새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
    
    comments: mode === 'comments' ? {
      loadMore: async () => {
        setLoading(true);
        setError(null);
        try {
          const nextPage = commentManagement.currentCommentPage + 1;
          if (nextPage <= commentManagement.commentTotalPages) {
            commentManagement.setCurrentCommentPage(nextPage);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '더 많은 댓글을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      refresh: async () => {
        setLoading(true);
        setError(null);
        try {
          commentManagement.setCurrentCommentPage(1);
        } catch (err) {
          setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      deleteComment: async (commentId: number) => {
        setLoading(true);
        setError(null);
        try {
          // 댓글 삭제 로직은 별도 API 호출 필요
          console.log('댓글 삭제:', commentId);
        } catch (err) {
          setError(err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
    
    posts: mode === 'posts' ? {
      loadMore: async () => {
        setLoading(true);
        setError(null);
        try {
          const nextPage = postManagement.currentPostPage + 1;
          if (nextPage <= postManagement.postTotalPages) {
            postManagement.setCurrentPostPage(nextPage);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '더 많은 게시글을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      refresh: async () => {
        setLoading(true);
        setError(null);
        try {
          postManagement.setCurrentPostPage(1);
        } catch (err) {
          setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      deletePost: async (postId: number) => {
        setLoading(true);
        setError(null);
        try {
          // 게시글 삭제 로직은 별도 API 호출 필요
          console.log('게시글 삭제:', postId);
        } catch (err) {
          setError(err instanceof Error ? err.message : '게시글 삭제 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
    
    company: mode === 'company' ? {
      toggleFollow: async () => {
        setLoading(true);
        setError(null);
        try {
          // 팔로우 토글 로직은 별도 API 호출 필요
          console.log('기업 팔로우 토글');
        } catch (err) {
          setError(err instanceof Error ? err.message : '팔로우 토글 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      refresh: async () => {
        setLoading(true);
        setError(null);
        try {
          // 기업 데이터 새로고침 로직
          console.log('기업 데이터 새로고침');
        } catch (err) {
          setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
  };
  
  // 통합된 서비스들
  const services: MypageServices = {
    common: {
      validateData: (data: any, type: string) => {
        const errors: Record<string, string> = {};
        
        if (type === 'profile') {
          if (!data.nickname?.trim()) {
            errors.nickname = '닉네임을 입력해주세요.';
          }
          if (data.nickname && data.nickname.length < 2) {
            errors.nickname = '닉네임은 2자 이상이어야 합니다.';
          }
        }
        
        return errors;
      },
      formatData: (data: any, type: string) => {
        if (type === 'profile') {
          return {
            ...data,
            nickname: data.nickname?.trim(),
            blogUrl: data.blogUrl?.trim(),
            githubUrl: data.githubUrl?.trim(),
          };
        }
        return data;
      },
    },
    profile: profileManagement,
    stars: starManagement,
    follows: followManagement,
    badges: badgeManagement,
    comments: commentManagement,
    posts: postManagement,
    company: companyData,
  };
  
  return {
    state,
    actions,
    services,
    loading,
    error,
  };
}

// ===== 편의 함수들 (기존 API 호환성) =====

// Profile 모드 전용 Hook
export function useMypageProfile(userId?: number, isMyPage?: boolean, isCompany?: boolean) {
  return useMypage({ mode: 'profile', userId, isMyPage, isCompany });
}

// Stars 모드 전용 Hook
export function useMypageStars(userId?: number, isMyPage?: boolean, isPersonal?: boolean) {
  return useMypage({ mode: 'stars', userId, isMyPage, isPersonal });
}

// Follows 모드 전용 Hook
export function useMypageFollows(userId?: number, isMyPage?: boolean, isPersonal?: boolean) {
  return useMypage({ mode: 'follows', userId, isMyPage, isPersonal });
}

// Badges 모드 전용 Hook
export function useMypageBadges(userId?: number, isMyPage?: boolean, isPersonal?: boolean) {
  return useMypage({ mode: 'badges', userId, isMyPage, isPersonal });
}

// Comments 모드 전용 Hook
export function useMypageComments(userId?: number, isMyPage?: boolean, isPersonal?: boolean) {
  return useMypage({ mode: 'comments', userId, isMyPage, isPersonal });
}

// Posts 모드 전용 Hook
export function useMypagePosts(userId?: number, isPersonal?: boolean, isCompany?: boolean) {
  return useMypage({ mode: 'posts', userId, isPersonal, isCompany });
}

// Company 모드 전용 Hook
export function useMypageCompany(isCompany?: boolean, routeId?: number) {
  return useMypage({ mode: 'company', isCompany, routeId });
}
