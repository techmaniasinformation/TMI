import { useState, useCallback, useEffect } from 'react';
import { usePostCreateState } from './usePostCreateState';
import { usePostEditState } from './usePostEditState';
import { usePostDetailActions } from './usePostDetailActions';
import { usePostCreateActions } from './usePostCreateActions';
import { usePostEditActions } from './usePostEditActions';
import { usePostCreateSaveService } from './usePostCreateSaveService';
import { usePostEditSaveService } from './usePostEditSaveService';
import { useCommentActions } from './useCommentActions';
import { useCommentState } from './useCommentState';
import { useStarActions } from './useStarActions';
import { useStarState } from './useStarState';
import { usePostsListState } from './usePostsListState';
import { usePostsListActions } from './usePostsListActions';
import { useSearchResultsState } from './useSearchResultsState';
import { useSearchResultsActions } from './useSearchResultsActions';
import { usePopularPostsState } from './usePopularPostsState';
import { usePopularPostsActions } from './usePopularPostsActions';

// ===== 통합 Post Hook =====
interface UsePostOptions {
  mode: 'create' | 'edit' | 'detail' | 'list' | 'search' | 'popular';
  postId?: number;
  initialData?: any;
  searchQuery?: string;
  category?: string;
}

interface PostState {
  // Create 모드 상태
  create?: {
    linkUrl: string;
    title: string;
    content: string;
    tags: string[];
    isLoading: boolean;
    isAILoading: boolean;
    aiSummary: string;
    urlError: string;
    aiError: string;
    titleError: string;
    contentError: string;
    newTag: string;
    showTagSuggestions: boolean;
    tagError: string;
    isPreviewMode: boolean;
  };
  
  // Edit 모드 상태
  edit?: {
    linkUrl: string;
    title: string;
    content: string;
    tags: string[];
    isLoading: boolean;
    isAILoading: boolean;
    aiSummary: string;
    urlError: string;
    aiError: string;
    titleError: string;
    contentError: string;
    newTag: string;
    showTagSuggestions: boolean;
    tagError: string;
    isPreviewMode: boolean;
  };
  
  // Detail 모드 상태
  detail?: {
    post: any;
    comments: any[];
    isStarred: boolean;
    starCount: number;
    commentCount: number;
  };
  
  // List 모드 상태
  list?: {
    posts: any[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    category: string;
  };
  
  // Search 모드 상태
  search?: {
    results: any[];
    query: string;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
  
  // Popular 모드 상태
  popular?: {
    posts: any[];
    period: 'daily' | 'weekly' | 'monthly';
  };
}

interface PostActions {
  // Create 액션
  create?: {
    setLinkUrl: (url: string) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setTags: (tags: string[]) => void;
    addTag: (tag: string) => boolean;
    removeTag: (tag: string) => void;
    clearErrors: () => void;
    setAISummaryData: (summary: string, aiTags: string[]) => void;
    togglePreview: () => void;
    save: () => Promise<void>;
    reset: () => void;
  };
  
  // Edit 액션
  edit?: {
    setLinkUrl: (url: string) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setTags: (tags: string[]) => void;
    addTag: (tag: string) => boolean;
    removeTag: (tag: string) => void;
    clearErrors: () => void;
    setAISummaryData: (summary: string, aiTags: string[]) => void;
    togglePreview: () => void;
    save: () => Promise<void>;
    cancel: () => void;
  };
  
  // Detail 액션
  detail?: {
    toggleStar: () => Promise<void>;
    addComment: (content: string) => Promise<void>;
    deleteComment: (commentId: number) => Promise<void>;
    refresh: () => Promise<void>;
  };
  
  // List 액션
  list?: {
    loadMore: () => Promise<void>;
    setCategory: (category: string) => void;
    refresh: () => Promise<void>;
  };
  
  // Search 액션
  search?: {
    search: (query: string) => Promise<void>;
    loadMore: () => Promise<void>;
    clear: () => void;
  };
  
  // Popular 액션
  popular?: {
    setPeriod: (period: 'daily' | 'weekly' | 'monthly') => Promise<void>;
    refresh: () => Promise<void>;
  };
}

interface PostServices {
  // 공통 서비스
  common: {
    validatePost: (data: any) => Record<string, string>;
    formatPostData: (data: any) => any;
  };
  
  // 모드별 서비스
  create?: any;
  edit?: any;
  detail?: any;
  list?: any;
  search?: any;
  popular?: any;
}

export function usePost(options: UsePostOptions) {
  const { mode, postId, initialData, searchQuery, category } = options;
  
  // 공통 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 모드별 상태 초기화
  const [state, setState] = useState<PostState>({});
  
  // Create 모드 Hook
  const createState = usePostCreateState();
  const createActions = usePostCreateActions(createState);
  const createSaveService = usePostCreateSaveService(createState);
  
  // Edit 모드 Hook
  const editState = usePostEditState();
  const editActions = usePostEditActions(String(postId || ''), editState);
  const editSaveService = usePostEditSaveService(String(postId || ''), editState);
  
  // Detail 모드 Hook
  const detailActions = usePostDetailActions(null);
  
  // Comment 관련 Hook
  const commentState = useCommentState();
  const commentActions = useCommentActions(String(postId || ''), commentState);
  
  // Star 관련 Hook
  const starState = useStarState();
  const starActions = useStarActions({ postId: String(postId || ''), state: starState });
  
  // List 모드 Hook
  const listState = usePostsListState();
  const listActions = usePostsListActions({
    ...listState,
    currentTab: 'latest' as 'latest' | 'following',
    followMemberId: null,
    state: listState
  });
  
  // Search 모드 Hook
  const searchState = useSearchResultsState();
  const searchActions = useSearchResultsActions({
    ...searchState,
    searchParams: new URLSearchParams(),
    state: searchState
  });
  
  // Popular 모드 Hook
  const popularState = usePopularPostsState();
  const popularActions = usePopularPostsActions({
    ...popularState,
    size: 10,
    state: popularState
  });
  
  // 모드별 상태 설정
  useEffect(() => {
    if (mode === 'create') {
      setState(prev => ({
        ...prev,
        create: {
          linkUrl: createState.linkUrl,
          title: createState.title,
          content: createState.content,
          tags: createState.tags,
          isLoading: createState.isLoading,
          isAILoading: createState.isAILoading,
          aiSummary: createState.aiSummary,
          urlError: createState.urlError,
          aiError: createState.aiError,
          titleError: createState.titleError,
          contentError: createState.contentError,
          newTag: createState.newTag,
          showTagSuggestions: createState.showTagSuggestions,
          tagError: createState.tagError,
          isPreviewMode: createState.isPreviewMode,
        }
      }));
    }
    
    if (mode === 'edit') {
      setState(prev => ({
        ...prev,
        edit: {
          linkUrl: editState.linkUrl,
          title: editState.title,
          content: editState.content,
          tags: editState.tags,
          isLoading: editState.isLoading,
          isAILoading: editState.isAILoading,
          aiSummary: editState.aiSummary,
          urlError: editState.urlError,
          aiError: editState.aiError,
          titleError: editState.titleError,
          contentError: editState.contentError,
          newTag: editState.newTag,
          showTagSuggestions: editState.showTagSuggestions,
          tagError: editState.tagError,
          isPreviewMode: editState.isPreviewMode,
        }
      }));
    }
    
    if (mode === 'list') {
      setState(prev => ({
        ...prev,
        list: {
          posts: listState.posts,
          currentPage: listState.currentPage,
          totalPages: listState.totalPages,
          hasMore: listState.isLast === false,
          category: category || 'latest',
        }
      }));
    }
    
    if (mode === 'search') {
      setState(prev => ({
        ...prev,
        search: {
          results: searchState.posts,
          query: searchQuery || '',
          currentPage: 1,
          totalPages: Math.ceil(searchState.totalCount / 10),
          hasMore: searchState.posts.length < searchState.totalCount,
        }
      }));
    }
    
    if (mode === 'popular') {
      setState(prev => ({
        ...prev,
        popular: {
          posts: popularState.posts,
          period: 'daily',
        }
      }));
    }
  }, [
    mode,
    createState,
    editState,
    listState,
    searchState,
    popularState,
    category,
    searchQuery
  ]);
  
  // 통합된 액션들
  const actions: PostActions = {
    create: mode === 'create' ? {
      setLinkUrl: createState.setLinkUrl,
      setTitle: createState.setTitle,
      setContent: createState.setContent,
      setTags: () => {},
      addTag: createState.addTag,
      removeTag: createState.removeTag,
      clearErrors: createState.clearErrors,
      setAISummaryData: createState.setAISummaryData,
      togglePreview: createState.togglePreview,
      save: async () => {
        setLoading(true);
        setError(null);
        try {
          await createSaveService.handleSave();
        } catch (err) {
          setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      reset: () => {
        createState.setLinkUrl('');
        createState.setTitle('');
        createState.setContent('');
        // Reset tags
        createState.clearErrors();
      },
    } : undefined,
    
    edit: mode === 'edit' ? {
      setLinkUrl: editState.setLinkUrl,
      setTitle: editState.setTitle,
      setContent: editState.setContent,
      setTags: editState.setTags,
      addTag: editState.addTag,
      removeTag: editState.removeTag,
      clearErrors: editState.clearErrors,
      setAISummaryData: editState.setAISummaryData,
      togglePreview: editState.togglePreview,
      save: async () => {
        setLoading(true);
        setError(null);
        try {
          await editSaveService.handleSave();
        } catch (err) {
          setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      cancel: editActions.handleCancel,
    } : undefined,
    
    detail: mode === 'detail' ? {
      toggleStar: async () => {
        setLoading(true);
        setError(null);
        try {
          await starActions.toggleStar();
        } catch (err) {
          setError(err instanceof Error ? err.message : '스타 토글 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      addComment: async (content: string) => {
        setLoading(true);
        setError(null);
        try {
          await commentActions.addComment();
        } catch (err) {
          setError(err instanceof Error ? err.message : '댓글 추가 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      deleteComment: async (commentId: number) => {
        setLoading(true);
        setError(null);
        try {
          await commentActions.deleteComment(commentId);
        } catch (err) {
          setError(err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      refresh: async () => {
        setLoading(true);
        setError(null);
        try {
          // 새로고침 로직은 별도 구현 필요
          console.log('게시글 새로고침');
        } catch (err) {
          setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
    
    list: mode === 'list' ? {
      loadMore: async () => {
        setLoading(true);
        setError(null);
        try {
          await listActions.fetchPosts();
        } catch (err) {
          setError(err instanceof Error ? err.message : '더 많은 게시글을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      setCategory: (category: string) => {
        // 카테고리 설정 로직은 별도 구현 필요
        console.log('카테고리 설정:', category);
      },
      refresh: async () => {
        setLoading(true);
        setError(null);
        try {
          await listActions.fetchPosts();
        } catch (err) {
          setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
    
    search: mode === 'search' ? {
      search: async (query: string) => {
        setLoading(true);
        setError(null);
        try {
          await searchActions.executeSearch();
        } catch (err) {
          setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      loadMore: async () => {
        setLoading(true);
        setError(null);
        try {
          await searchActions.executeSearch();
        } catch (err) {
          setError(err instanceof Error ? err.message : '더 많은 결과를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      clear: () => {
        // 검색 결과 초기화 로직은 별도 구현 필요
        console.log('검색 결과 초기화');
      },
    } : undefined,
    
    popular: mode === 'popular' ? {
      setPeriod: async (period: 'daily' | 'weekly' | 'monthly') => {
        setLoading(true);
        setError(null);
        try {
          // 기간 설정 로직은 별도 구현 필요
          console.log('기간 설정:', period);
        } catch (err) {
          setError(err instanceof Error ? err.message : '기간 설정 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      refresh: async () => {
        setLoading(true);
        setError(null);
        try {
          // 인기 게시글 새로고침 로직은 별도 구현 필요
          console.log('인기 게시글 새로고침');
        } catch (err) {
          setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
    } : undefined,
  };
  
  // 통합된 서비스들
  const services: PostServices = {
    common: {
      validatePost: (data: any) => {
        const errors: Record<string, string> = {};
        if (!data.title?.trim()) {
          errors.title = '제목을 입력해주세요.';
        }
        if (!data.content?.trim()) {
          errors.content = '내용을 입력해주세요.';
        }
        return errors;
      },
      formatPostData: (data: any) => {
        return {
          ...data,
          title: data.title?.trim(),
          content: data.content?.trim(),
          tags: data.tags?.filter((tag: string) => tag.trim()),
        };
      },
    },
    create: createSaveService,
    edit: editSaveService,
    detail: detailActions,
    list: listActions,
    search: searchActions,
    popular: popularActions,
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

// Create 모드 전용 Hook
export function usePostCreate() {
  return usePost({ mode: 'create' });
}

// Edit 모드 전용 Hook
export function usePostEdit(postId: number) {
  return usePost({ mode: 'edit', postId });
}

// Detail 모드 전용 Hook
export function usePostDetail(postId: number) {
  return usePost({ mode: 'detail', postId });
}

// List 모드 전용 Hook
export function usePostList(category?: string) {
  return usePost({ mode: 'list', category });
}

// Search 모드 전용 Hook
export function usePostSearch() {
  return usePost({ mode: 'search' });
}

// Popular 모드 전용 Hook
export function usePostPopular() {
  return usePost({ mode: 'popular' });
}
