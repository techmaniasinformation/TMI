// hooks/auth/useSocialLogin.ts
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

const useSocialLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    toggleIsLogin,//isLogin 정리되면 삭제 예정
    setMemberId,
    setUser,        //  user 상태 저장을 위해 추가
    setMyStarLst,
    setMyFollowLst,
  } = useUserStore();

  // 이전 경로 함께 전달하는 소셜 로그인
  const handleSocialLoginWithLocation = (
    provider: 'kakao' | 'naver' | 'google',
    from: string = '/'
  ) => {
    // 현재 경로를 sessionStorage에 저장
    sessionStorage.setItem('redirectAfterLogin', from);
    
    // 로컬 개발 환경에서는 테스트용 URL 사용
    const isLocal = window.location.hostname === 'localhost';
    const baseUrl = isLocal ? 'http://localhost:8080' : 'https://i13a509.p.ssafy.io/api/v1';
    const oauthPath = isLocal ? `/test/oauth2/authorization/${provider}` : `/oauth2/authorization/${provider}`;
    
    window.location.href = `${baseUrl}${oauthPath}`;
  };

  //쿼리 파라미터 기반 리다이렉트 처리
  useEffect(() => {
    // &&&&로그인 완료 후 이전 페이지 경로
    const redirectAfterLogin =
      sessionStorage.getItem('redirectAfterLogin') || '/';

    // 회원 정보
    const searchParams = new URLSearchParams(location.search); // &&& location.search에서 쿼리 추출
    const isNew = searchParams.get('isNew');

    const provider = searchParams.get('provider');
    const providerId = searchParams.get('providerMemberId');
    console.log(provider, providerId);
    //
    const memberId = searchParams.get('memberId');

    //신규 회원: provider, providerId가 반드시 있어야 회원가입으로 이동
    if (isNew === 'true') {
      if (provider && providerId) {
        navigate('/signup', {
          state: {
            provider,
            providerId,
          },
        });
      } else {
        alert('회원가입 정보가 누락되었습니다. 다시 시도해주세요.');
        navigate('/login');
      }
      return;
    }

    // 기존 회원: provider 정보 없이도 홈으로 이동
    //  이후 방향 : 로그인 이전 경로 받아다가, 로그인 이전 페이지로 보내기.
    if (isNew === 'false') {
      // isLogin 빼고 memberId로만 로그인 상태 관리
      toggleIsLogin();  // 즉 이 줄 지워질 수 있음
      // memberId 전역변수 저장 및 user 정보 전달
      if (memberId !== null) {
        const numericMemberId = Number(memberId);
        setMemberId(numericMemberId);

        // ✅ 사용자 정보 요청 후 저장
        fetch(`https://i13a509.p.ssafy.io/api/v1/member/${numericMemberId}`, {
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch user info');
            return res.json();
          })
          .then((response) => {
            const data = response.data;
            const user = {
              memberId: data.memberId,
              nickname: data.nickname,
              memberProfileUrl: data.memberProfileUrl,
            };
            setUser(user); // ✅ zustand 전역에 저장
          })
          .catch((error) => {
            console.error('유저 정보 가져오기 실패:', error);
          });
      }

      //스타 게시글 리스트 저장

      //팔로우 (멤버 id) 리스트 저장
      
      // 로그인 완료, 이전 페이지로 리다이렉트
      navigate(redirectAfterLogin);
      // 로그인 전 경로는 사용했으니 지워주는 것이 안전
      sessionStorage.removeItem('redirectAfterLogin');
      return;
    }
  }, [location.search, navigate]);

  return {
    handleSocialLoginWithLocation,
  };
};

export default useSocialLogin;
