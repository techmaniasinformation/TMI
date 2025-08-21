import React from 'react';
import { usePost, usePostCreate, usePostEdit, usePostDetail, usePostList, usePostSearch, usePostPopular } from './usePost';

// ===== 새로운 통합 usePost 사용 예시 =====
export function UsePostExample() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">usePost Hook 통합 예시</h2>
      
      {/* 1. Create 모드 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. Create 모드</h3>
        <CreatePostExample />
      </div>

      {/* 2. Edit 모드 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. Edit 모드</h3>
        <EditPostExample />
      </div>

      {/* 3. Detail 모드 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3. Detail 모드</h3>
        <DetailPostExample />
      </div>

      {/* 4. List 모드 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4. List 모드</h3>
        <ListPostExample />
      </div>

      {/* 5. Search 모드 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5. Search 모드</h3>
        <SearchPostExample />
      </div>

      {/* 6. Popular 모드 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">6. Popular 모드</h3>
        <PopularPostExample />
      </div>
    </div>
  );
}

// Create 모드 예시 컴포넌트
function CreatePostExample() {
  const { state, actions, services, loading, error } = usePostCreate();

  const handleSave = async () => {
    if (actions.create) {
      await actions.create.save();
    }
  };

  const handleReset = () => {
    if (actions.create) {
      actions.create.reset();
    }
  };

  return (
    <div className="border rounded p-4">
      <h4 className="font-semibold mb-2">게시글 작성</h4>
      
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      
      <div className="space-y-2">
        <input
          type="text"
          placeholder="제목"
          value={state.create?.title || ''}
          onChange={(e) => actions.create?.setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <textarea
          placeholder="내용"
          value={state.create?.content || ''}
          onChange={(e) => actions.create?.setContent(e.target.value)}
          className="w-full p-2 border rounded h-20"
        />
        
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
          
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit 모드 예시 컴포넌트
function EditPostExample() {
  const { state, actions, services, loading, error } = usePostEdit(123);

  const handleSave = async () => {
    if (actions.edit) {
      await actions.edit.save();
    }
  };

  const handleCancel = () => {
    if (actions.edit) {
      actions.edit.cancel();
    }
  };

  return (
    <div className="border rounded p-4">
      <h4 className="font-semibold mb-2">게시글 수정</h4>
      
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      
      <div className="space-y-2">
        <input
          type="text"
          placeholder="제목"
          value={state.edit?.title || ''}
          onChange={(e) => actions.edit?.setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <textarea
          placeholder="내용"
          value={state.edit?.content || ''}
          onChange={(e) => actions.edit?.setContent(e.target.value)}
          className="w-full p-2 border rounded h-20"
        />
        
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            취소
          </button>
        </div>
        
        {false && (
          <div className="text-yellow-600 text-sm">변경사항이 있습니다.</div>
        )}
      </div>
    </div>
  );
}

// Detail 모드 예시 컴포넌트
function DetailPostExample() {
  const { state, actions, services, loading, error } = usePostDetail(123);

  const handleToggleStar = async () => {
    if (actions.detail) {
      await actions.detail.toggleStar();
    }
  };

  const handleAddComment = async () => {
    if (actions.detail) {
      await actions.detail.addComment('새로운 댓글입니다.');
    }
  };

  return (
    <div className="border rounded p-4">
      <h4 className="font-semibold mb-2">게시글 상세</h4>
      
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      
      <div className="space-y-2">
        <div className="p-2 bg-gray-100 rounded">
          <h5 className="font-medium">게시글 정보</h5>
          <p>제목: {state.detail?.post?.title || '로딩 중...'}</p>
          <p>스타 수: {state.detail?.starCount || 0}</p>
          <p>댓글 수: {state.detail?.commentCount || 0}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleToggleStar}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
          >
            {loading ? '처리 중...' : (state.detail?.isStarred ? '스타 해제' : '스타 추가')}
          </button>
          
          <button
            onClick={handleAddComment}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            댓글 추가
          </button>
        </div>
      </div>
    </div>
  );
}

// List 모드 예시 컴포넌트
function ListPostExample() {
  const { state, actions, services, loading, error } = usePostList('tech');

  const handleLoadMore = async () => {
    if (actions.list) {
      await actions.list.loadMore();
    }
  };

  const handleRefresh = async () => {
    if (actions.list) {
      await actions.list.refresh();
    }
  };

  return (
    <div className="border rounded p-4">
      <h4 className="font-semibold mb-2">게시글 목록</h4>
      
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      
      <div className="space-y-2">
        <div className="p-2 bg-gray-100 rounded">
          <p>총 게시글: {state.list?.posts?.length || 0}개</p>
          <p>현재 페이지: {state.list?.currentPage || 1}</p>
          <p>카테고리: {state.list?.category || '전체'}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleLoadMore}
            disabled={loading || !state.list?.hasMore}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? '로딩 중...' : '더 보기'}
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
}

// Search 모드 예시 컴포넌트
function SearchPostExample() {
  const { state, actions, services, loading, error } = usePostSearch();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = async () => {
    if (actions.search) {
      await actions.search.search(searchQuery);
    }
  };

  const handleLoadMore = async () => {
    if (actions.search) {
      await actions.search.loadMore();
    }
  };

  const handleClear = () => {
    if (actions.search) {
      actions.search.clear();
    }
    setSearchQuery('');
  };

  return (
    <div className="border rounded p-4">
      <h4 className="font-semibold mb-2">게시글 검색</h4>
      
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      
      <div className="space-y-2">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="검색어 입력"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            검색
          </button>
        </div>
        
        <div className="p-2 bg-gray-100 rounded">
          <p>검색어: {state.search?.query || '없음'}</p>
          <p>검색 결과: {state.search?.results?.length || 0}개</p>
          <p>현재 페이지: {state.search?.currentPage || 1}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleLoadMore}
            disabled={loading || !state.search?.hasMore}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            더 보기
          </button>
          
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}

// Popular 모드 예시 컴포넌트
function PopularPostExample() {
  const { state, actions, services, loading, error } = usePostPopular();

  const handleSetPeriod = async (period: 'daily' | 'weekly' | 'monthly') => {
    if (actions.popular) {
      await actions.popular.setPeriod(period);
    }
  };

  const handleRefresh = async () => {
    if (actions.popular) {
      await actions.popular.refresh();
    }
  };

  return (
    <div className="border rounded p-4">
      <h4 className="font-semibold mb-2">인기 게시글</h4>
      
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      
      <div className="space-y-2">
        <div className="p-2 bg-gray-100 rounded">
          <p>기간: {state.popular?.period || 'daily'}</p>
          <p>인기 게시글: {state.popular?.posts?.length || 0}개</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleSetPeriod('daily')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            일간
          </button>
          
          <button
            onClick={() => handleSetPeriod('weekly')}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            주간
          </button>
          
          <button
            onClick={() => handleSetPeriod('monthly')}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
          >
            월간
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
}
