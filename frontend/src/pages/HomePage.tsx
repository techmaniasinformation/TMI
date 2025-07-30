import React from 'react';
import HomePostList from '@/components/domain/HomePostList';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1 max-w-[70%]">
            <HomePostList />
          </div>
          <div className="w-[30%]">
            {/* 인기 게시글 사이드바 - 향후 구현 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">인기 게시글</h3>
              <p className="text-gray-500">인기 게시글 기능이 곧 추가됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;