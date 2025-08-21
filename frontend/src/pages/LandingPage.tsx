import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/foundation/button';
import { useAuth, useTheme } from '@/hooks/store/useStoreActions'; //테마 및 로그인 상태 정보
import LandingCard from '@/components/inter/LandingCard'; //인기 게시글 3개
import { usePopularPosts } from '@/hooks/posts/usePopularPosts';
import { formatUTCToKSTDate } from '@/utils/dateUtils';

interface PostData {
    postId: string;
  memberProfile?: string | null;
  companyProfileUrl?: string | null;
  name: string;
  badgeUrl?: string | null;
  title: string;
  createAt: string;
  viewCount: number;
  starCount: number;
  commentCount: number;
  tags: string[];
  thumbnailUrl: string;
}

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 테마 관련 변수 받기
  const { isDarkMode } = useTheme();

  // ##### 현재 로그인 여부, 로그인 했을 시 user 객체
  const { user } = useAuth();
  const isLogin = user !== null && user.memberId > 0;

  // 인기게시글 데이터 가져오기 (랜딩페이지에서는 3개만)
  const { posts: popularPosts, loading, error } = usePopularPosts(3);

  const handleSignupClick = (): void => {
    // 로그인/회원가입 페이지로 이동
    navigate('/login', {
      state: { from: location.pathname },
    });

  };

  const handleExploreClick = (): void => {
    navigate('/home');

  };

  // ######## 카드 클릭시 게시글 상세 페이지로 이동
  const handleCardClick = (postId: number) => {
    navigate(`/post/${postId}`);

  };

  return (
    <div className='min-h-screen bg-gray-900 relative overflow-hidden'>
      {/* Galaxy Background */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80'
        style={{
          // 배경 이미지. 추후에 더 좋은 배경 찾으면 변경 가능
          backgroundImage: `url('https://readdy.ai/api/search-image?query=real%20milky%20way%20galaxy%20photograph%20taken%20from%20earth%2C%20authentic%20night%20sky%20photography%20showing%20bright%20milky%20way%20core%20with%20visible%20stars%20and%20cosmic%20dust%2C%20professional%20astrophotography%20of%20galaxy%20stretching%20across%20dark%20sky%2C%20realistic%20space%20photo%20with%20natural%20colors%20and%20lighting%2C%20actual%20milky%20way%20galaxy%20visible%20from%20earth%20surface%2C%20high%20quality%20astronomical%20photograph%20with%20deep%20space%20view&width=1920&height=1080&seq=real-milky-way-bg&orientation=landscape')`,
        }}
      />

      {/* Animated Stars Overlay */}
      {/* 별똥별 애니메이션 */}
      <div className='absolute inset-0'>
        <div className='absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse'></div>

        <div className='absolute top-32 right-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-500'></div>

        <div className='absolute top-64 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-1000'></div>

        <div className='absolute bottom-40 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700'></div>

        <div className='absolute bottom-20 left-1/2 w-1 h-1 bg-blue-200 rounded-full animate-pulse delay-300'></div>

        <div className='absolute top-1/3 right-10 w-1 h-1 bg-white rounded-full animate-pulse delay-1200'></div>

        <div className='absolute top-1/2 left-16 w-1 h-1 bg-purple-200 rounded-full animate-pulse delay-800'></div>

        <div className='absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-100 rounded-full animate-pulse delay-400'></div>

      </div>

      {/* Shooting Stars */}
      <div className='absolute inset-0'>
        {/* Shooting Star 1 */}
        <div className='absolute top-1/4 left-0 w-1 h-1 bg-white rounded-full opacity-0 animate-shooting-star-1'>

          <div className='absolute w-20 h-0.5 bg-gradient-to-r from-white via-blue-200 to-transparent -translate-y-0.5'></div>

        </div>
        {/* Shooting Star 2 */}
        <div className='absolute top-1/3 right-0 w-1 h-1 bg-purple-200 rounded-full opacity-0 animate-shooting-star-2'>

          <div className='absolute w-16 h-0.5 bg-gradient-to-l from-purple-200 via-white to-transparent -translate-y-0.5 right-0'></div>

        </div>
        {/* Shooting Star 3 */}
        <div className='absolute top-2/3 left-1/4 w-1 h-1 bg-blue-200 rounded-full opacity-0 animate-shooting-star-3'>

          <div className='absolute w-12 h-0.5 bg-gradient-to-r from-blue-200 via-white to-transparent -translate-y-0.5'></div>

        </div>
      </div>

      {/* Blue Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/15 to-indigo-900/25'></div>


      <main className='relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12'>

        <div className='text-center max-w-4xl'>
          {/* Main Heading */}
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-12 leading-tight'>

            <span className='text-white'>
              <span className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl whitespace-nowrap'>

                테크 블로그를 표류하는 디벨로퍼를 위한
              </span>
              <br />
              <span className='text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black'>

                TMI
              </span>
            </span>
          </h1>

          <p className='text-sm md:text-base text-blue-200 mb-12 tracking-wider uppercase'>

            easy search, high quality by sharing
          </p>
          {/* Subheading */}
          <p className='text-lg md:text-xl text-gray-300 mb-4 italic'>
            테크 블로그의 은하계에서 길을 잃은 개발자들을 위한 가이드북
          </p>

          {/* Navigation Buttons */}
          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>

            {!isLogin && (
              <Button
                variant={'primary'}
                onMouseEnter={() => setIsHovered('signup')}
                onMouseLeave={() => setIsHovered(null)}
                onClick={handleSignupClick}
                className={`group relative px-8 py-4 cursor-pointer whitespace-nowrap border-0.5 border-transparent transform ${
                  isHovered === 'signup' ? 'scale-105' : 'scale-100'
                } w-[200px]`}
              >
                <div className='flex items-center justify-center space-x-2'>
                  {/* 로켓 아이콘 건의 */}
                  <i className='fa-solid fa-rocket w-5 h-5 flex items-center justify-center'></i>

                  <span>로그인/회원가입</span>
                </div>
              </Button>
            )}
            <Button
              variant={isDarkMode ? 'dark' : 'default'}
              onMouseEnter={() => setIsHovered('explore')}
              onMouseLeave={() => setIsHovered(null)}
              onClick={handleExploreClick}
              className={`group relative px-8 py-4 cursor-pointer whitespace-nowrap border transform ${
                isHovered === 'explore' ? 'scale-105' : 'scale-100'
              } w-[200px]`}
            >
              <div className='flex items-center justify-center space-x-2'>
                {/* 돋보기 아이콘 건의 */}
                <i className='fa-solid fa-magnifying-glass w-5 h-5 flex items-center justify-center'></i>

                <span>둘러보기</span>
              </div>
            </Button>
          </div>

          {/* Additional Info */}
          <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mt-16 text-gray-400 text-sm'>

            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>

              <span>Curated by developers, for developers</span>
            </div>
            <div className='flex items-center space-x-2'>
              <i className='ri-star-line w-4 h-4 flex items-center justify-center'></i>

              <span>Quality content, zero noise</span>
            </div>
            <div className='flex items-center space-x-2'>
              <i className='ri-team-line w-4 h-4 flex items-center justify-center'></i>

              <span>Join the community</span>
            </div>
          </div>

          {/* Floating Elements */}
          <div className='absolute top-20 left-10 opacity-30'>
            <div className='w-20 h-20 border border-blue-300/30 rounded-full animate-pulse'></div>

          </div>
          <div className='absolute bottom-32 right-16 opacity-20'>
            <div className='w-16 h-16 border border-purple-300/30 rounded-full animate-pulse delay-1000'></div>

          </div>
          <div className='absolute top-1/2 right-8 opacity-25'>
            <div className='w-12 h-12 border border-white/20 rounded-full animate-pulse delay-500'></div>

          </div>
        </div>

        {/* Featured Posts Section */}
        <div className='w-full max-w-6xl mt-24 mb-12'>
          <h2 className='text-2xl md:text-3xl font-bold text-white text-center mb-12'>

            인기 게시글
          </h2>
          {/* 각 카드는 inter에다가 컴포넌트 만들기 */}
          {/* 각 카드는 inter에다가 컴포넌트 만들기 */}
          {/* role color 적용은 추후에 생각해볼 것.  */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {loading ? (
              <div className='text-gray-400 text-center w-full'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>

                인기게시글을 불러오는 중입니다...
              </div>
            ) : error ? (
              <div className='text-red-400 text-center w-full'>
                <p>인기게시글을 불러오는데 실패했습니다.</p>
                <p className='text-sm'>{error}</p>
              </div>
            ) : popularPosts.length > 0 ? (
              popularPosts.map((post) => (
                <LandingCard
                  key={post.postId}
                  {...post}
                  postId={post.postId.toString()}
                  createAt={formatUTCToKSTDate(post.createAt)}
                  roleColor='bg-blue-600'
                  hoverBorder='hover:border-blue-500/50'
                  hoverShadow='hover:shadow-blue-500/20'
                  onClick={() => handleCardClick(post.postId)}
                  variant={isDarkMode ? 'dark' : 'light'}
                />
              ))
            ) : (
              <p className='text-gray-400 text-center w-full'>
                인기게시글이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Explore Button */}
        <div className='mt-12 mb-8'>
          <Button
            variant={isDarkMode ? 'dark' : 'default'}
            onMouseEnter={() => setIsHovered('explore')}
            onMouseLeave={() => setIsHovered(null)}
            onClick={handleExploreClick}
            className={`group relative px-8 py-4 cursor-pointer whitespace-nowrap border transform ${
              isHovered === 'explore' ? 'scale-105' : 'scale-100'
            } w-[350px]`}
          >
            <div className='flex items-center justify-center space-x-2'>
              {/* 돋보기 아이콘 건의 */}
              <i className='fa-solid fa-magnifying-glass w-5 h-5 flex items-center justify-center'></i>

              <span>둘러보기</span>
            </div>
          </Button>
        </div>
      </main>

      {/* Bottom Gradient */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/80 to-transparent'></div>

    </div>
  );
};

export default LandingPage;