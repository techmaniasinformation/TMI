// hooks/auth/useSocialLogin.ts
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useUserStore } from '@/stores/userStore';


const useSocialLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  const {
    toggleIsLogin, //isLogin 정리되면 삭제 예정
    setUser, //  user 상태 저장을 위해 추가
    setFollowUser,
    setFollowCompany,
    setSocialLoginInfo,
    clearUser,
    setPrevPath,
    setSocialProvider,
    prevPath,
    user,
  } = useUserStore();
  const isLogin = user !== null && user.memberId > 0;

  // 이전 경로 함께 전달하는 소셜 로그인
  const handleSocialLoginWithLocation = (
    provider: 'kakao' | 'naver' | 'google',
    from: string = '/'
  ) => {
    // 현재 경로를 sessionStorage에 저장
    sessionStorage.setItem('redirectAfterLogin', from);
    setSocialProvider(provider);
    // 로그인 URL로 이동
    window.location.href = `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`;
  };

  //쿼리 파라미터 기반 리다이렉트 처리
  useEffect(() => {
    // window.location.search를 우선 사용
    const searchString = window.location.search || location.search;
    
    // 쿼리 파라미터가 없으면 처리하지 않음
    if (!searchString) {
      return;
    }
    
    // 이미 처리된 경우 중복 실행 방지
    if (hasProcessed.current) {
      return;
    }
    
    // 이미 처리된 경우 중복 실행 방지
    if (location.pathname === '/signup') {
      return;
    }
    
    // &&&&로그인 완료 후 이전 페이지 경로
    const redirectAfterLogin =
      sessionStorage.getItem('redirectAfterLogin') || '/';

    // 회원 정보 - searchString 사용
    const searchParams = new URLSearchParams(searchString);
    const isNew = searchParams.get('isNew');

    const provider = searchParams.get('provider');
    const providerMemberId = searchParams.get('providerMemberId');
    
    const memberId = searchParams.get('memberId');

    //신규 회원: provider, providerId가 반드시 있어야 회원가입으로 이동
    if (isNew === 'true') {
      if (provider && providerMemberId) {
        // 전역 변수에 소셜 로그인 정보 저장
        setSocialLoginInfo(provider, providerMemberId);
        
        hasProcessed.current = true; // 처리 완료 표시
        navigate('/signup');
      } else {
        alert('회원가입 정보가 누락되었습니다. 다시 시도해주세요.');
        navigate('/login');
      }
      return;
    }

    // 기존 회원: 로그인 처리
    if (isNew === 'false') {
      if (memberId !== null) {
        const numericMemberId = Number(memberId);
        
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
            setUser(user); // ✅ zustand 전역에 저장 (isLogin은 자동으로 true로 변경됨)
            
             // 전역변수 상태 확인
             console.log('🔍 기존 회원 처리 후 전역변수 상태:', {
               isLogin,
               user: user ? { memberId: user.memberId, nickname: user.nickname } : null
             });
          })
          .catch((error) => {
            console.error('유저 정보 가져오기 실패:', error);
            // 에러 발생 시 로그인 상태 초기화
            clearUser();
          });



        // 팔로우 (멤버 id) 리스트 저장
        fetch(`https://i13a509.p.ssafy.io/api/v1/memberFollow?followerId=${numericMemberId}&all=true`, {
          method: 'GET',
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch follow list');
            return res.json();
          })
          .then((response) => {
            const followUserIds = response.data.memberFollows.map((item: any) => item.memberId);
            setFollowUser(followUserIds);
            console.log('팔로우 사용자 목록:', followUserIds);
          })
          .catch((error) => {
            console.error('팔로우 사용자 목록 가져오기 실패:', error);
          });

          //팔로우 회사 리스트 저장
        // 팔로우 (멤버 id) 리스트 저장
        fetch(`https://i13a509.p.ssafy.io/api/v1/companyFollow?followerId=${numericMemberId}&all=true`, {
          method: 'GET',
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch follow list');
            return res.json();
          })
          .then((response) => {
            const followCompanyIds = response.data.companyFollows.map((item: any) => item.companyId);
            setFollowCompany(followCompanyIds);
            console.log('팔로우 사용자 목록:', followCompanyIds);
          })
          .catch((error) => {
            console.error('팔로우 기업 목록 가져오기 실패:', error);
          });

      } else {
        alert('로그인 정보가 누락되었습니다. 다시 시도해주세요.');
        navigate('/login');
        return;
      }



             // 로그인 완료, 이전 페이지로 리다이렉트//구현 전 
       hasProcessed.current = true; // 처리 완료 표시 ??? 이거 무슨 코드지
      console.log('네비게이트 전', prevPath)
       navigate(prevPath);
       // 로그인 전 경로는 사용했으니 지워주는 것이 안전
      setPrevPath('/')
      console.log('네비게이트 후', prevPath);
       return;
    }
  }, [location.search, location.pathname]); // 필요한 값만 의존성으로 설정

  return {
    handleSocialLoginWithLocation,
  };
};

export default useSocialLogin;
