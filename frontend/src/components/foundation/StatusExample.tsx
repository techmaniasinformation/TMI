import React, { useState } from 'react';
import { Status, Loading, Error, Empty, StatusContainer } from './Status';

// ===== 새로운 통합 Status 사용 예시 =====
export function StatusExample() {
  const [currentStatus, setCurrentStatus] = useState<'loading' | 'error' | 'empty' | 'content'>('loading');

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Status 컴포넌트 통합 예시</h2>
      
      {/* 상태 전환 버튼들 */}
      <div className="flex space-x-2 mb-6">
        <button 
          onClick={() => setCurrentStatus('loading')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          로딩 상태
        </button>
        <button 
          onClick={() => setCurrentStatus('error')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          에러 상태
        </button>
        <button 
          onClick={() => setCurrentStatus('empty')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          빈 상태
        </button>
        <button 
          onClick={() => setCurrentStatus('content')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          콘텐츠 상태
        </button>
      </div>

      {/* 1. 통합 Status 컴포넌트 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">1. 통합 Status 컴포넌트</h3>
        <div className="border rounded p-4 min-h-[200px]">
          {currentStatus === 'loading' && (
            <Status
              type="loading"
              message="데이터를 불러오는 중..."
              variant="spinner"
              size="lg"
            />
          )}
          {currentStatus === 'error' && (
            <Status
              type="error"
              title="데이터 로드 실패"
              message="데이터를 불러오는 중 오류가 발생했습니다."
              errorVariant="error"
              onRetry={() => setCurrentStatus('loading')}
            />
          )}
          {currentStatus === 'empty' && (
            <Status
              type="empty"
              emptyTitle="데이터가 없습니다"
              emptyMessage="표시할 데이터가 없습니다."
              icon="fas fa-inbox"
            />
          )}
          {currentStatus === 'content' && (
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-2">콘텐츠가 로드되었습니다!</h4>
              <p className="text-gray-600">여기에 실제 콘텐츠가 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. 개별 컴포넌트 사용 (기존 API 호환성) */}
      <div>
        <h3 className="text-lg font-semibold mb-2">2. 개별 컴포넌트 사용 (기존 API 호환성)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Loading</h4>
            <Loading message="로딩 중..." variant="dots" />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Error</h4>
            <Error 
              title="오류 발생" 
              errorVariant="warning"
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Empty</h4>
            <Empty 
              emptyTitle="빈 상태" 
              emptyMessage="데이터가 없습니다." 
              icon="fas fa-folder-open"
            />
          </div>
        </div>
      </div>

      {/* 3. StatusContainer 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">3. StatusContainer 사용</h3>
        <div className="border rounded p-4 min-h-[200px]">
                    <StatusContainer
            loading={currentStatus === 'loading'}
            error={currentStatus === 'error' ? '데이터 로드 실패' : null}
            empty={currentStatus === 'empty'}
            emptyMessage="표시할 데이터가 없습니다."
            onRetry={() => setCurrentStatus('loading')}
          >
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-2">콘텐츠가 로드되었습니다!</h4>
              <p className="text-gray-600">여기에 실제 콘텐츠가 표시됩니다.</p>
            </div>
          </StatusContainer>
        </div>
      </div>

      {/* 4. 다양한 로딩 variant */}
      <div>
        <h3 className="text-lg font-semibold mb-2">4. 다양한 로딩 variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Spinner</h4>
            <Status type="loading" variant="spinner" />
          </div>
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Dots</h4>
            <Status type="loading" variant="dots" />
          </div>
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Skeleton</h4>
            <Status type="loading" variant="skeleton" />
          </div>
        </div>
      </div>

      {/* 5. 다양한 에러 variant */}
      <div>
        <h3 className="text-lg font-semibold mb-2">5. 다양한 에러 variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Error</h4>
            <Status type="error" message="오류가 발생했습니다." errorVariant="error" />
          </div>
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Warning</h4>
            <Status type="error" message="경고가 발생했습니다." errorVariant="warning" />
          </div>
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Info</h4>
            <Status type="error" message="정보를 확인해주세요." errorVariant="info" />
          </div>
        </div>
      </div>
    </div>
  );
}
