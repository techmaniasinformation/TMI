import React from 'react';

// 기본 스켈레톤 컴포넌트
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "bg-gray-200", 
  width = "w-full", 
  height = "h-4" 
}) => (
  <div className={`${className} ${width} ${height} rounded animate-pulse`} />
);

// 검색 결과 스켈레톤
export const SearchResultSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto">
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton width="w-48" height="h-6" />
        <Skeleton width="w-24" height="h-6" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} width="w-20" height="h-8" className="bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>

    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="flex items-start space-x-4">
            <Skeleton width="w-16" height="h-16" className="bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton width="w-3/4" height="h-4" className="bg-gray-200 rounded mb-2" />
              <Skeleton width="w-1/2" height="h-3" className="bg-gray-200 rounded mb-2" />
              <Skeleton width="w-1/4" height="h-3" className="bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8 flex justify-center">
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} width="w-10" height="h-10" className="bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  </div>
);

// 게시글 카드 스켈레톤
export const PostCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 animate-pulse">
    <div className="flex items-start gap-4">
      <Skeleton width="w-10" height="h-10" className="bg-gray-200 rounded-full flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <Skeleton width="w-3/4" height="h-5" className="bg-gray-200 rounded mb-2" />
        
        <div className="flex items-center gap-2 mb-3">
          <Skeleton width="w-20" height="h-4" className="bg-gray-200 rounded" />
          <Skeleton width="w-16" height="h-4" className="bg-gray-200 rounded" />
          <Skeleton width="w-12" height="h-4" className="bg-gray-200 rounded" />
        </div>
        
        <div className="flex gap-2 mb-3">
          <Skeleton width="w-16" height="h-6" className="bg-gray-200 rounded-full" />
          <Skeleton width="w-20" height="h-6" className="bg-gray-200 rounded-full" />
          <Skeleton width="w-14" height="h-6" className="bg-gray-200 rounded-full" />
        </div>
        
        <div className="flex items-center gap-4">
          <Skeleton width="w-12" height="h-4" className="bg-gray-200 rounded" />
          <Skeleton width="w-10" height="h-4" className="bg-gray-200 rounded" />
          <Skeleton width="w-8" height="h-4" className="bg-gray-200 rounded" />
        </div>
      </div>
      
      <Skeleton width="w-48" height="h-32" className="bg-gray-200 rounded-lg flex-shrink-0" />
    </div>
  </div>
);

// 인기 게시글 스켈레톤
export const PopularPostSkeleton = () => (
  <div className="border-b border-gray-100 pb-3 last:border-b-0 animate-pulse">
    <div className="flex items-start gap-3">
      <Skeleton width="w-6" height="h-6" className="bg-gray-200 rounded-full flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <Skeleton width="w-3/4" height="h-4" className="bg-gray-200 rounded mb-1" />
        <div className="flex items-center gap-2">
          <Skeleton width="w-16" height="h-3" className="bg-gray-200 rounded" />
          <Skeleton width="w-8" height="h-3" className="bg-gray-200 rounded" />
          <Skeleton width="w-6" height="h-3" className="bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);
