import HomePostList from '@/components/domain/HomePostList';
import { PopularPosts } from '@/components/domain/PopularPosts';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* 메인 게시글 목록 */}
          <div className="flex-1 max-w-[70%]">
            <HomePostList />
          </div>
          
          {/* 인기 게시글 사이드바 */}
          <div className="w-[30%]">
            <PopularPosts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;