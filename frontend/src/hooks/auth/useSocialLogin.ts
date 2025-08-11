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
    setMemberId,
    setUser, //  user 상태 저장을 위해 추가
    setStarLst,
    setFollowUser,
    setFollowCompany,
    setSocialLoginInfo,
    clearUser,
    isLogin,
    memberId: globalMemberId,
    user,
  } = useUserStore();

  // 이전 경로 함께 전달하는 소셜 로그인
  const handleSocialLoginWithLocation = (
    provider: 'kakao' | 'naver' | 'google',
    from: string = '/'
  ) => {
    // 현재 경로를 sessionStorage에 저장
    sessionStorage.setItem('redirectAfterLogin', from);
    // 로그인 URL로 이동
    window.location.href = `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`;
  };

  //쿼리 파라미터 기반 리다이렉트 처리
  useEffect(() => {
    console.log('useSocialLogin useEffect 실행됨');
    console.log('location.search:', location.search);
    console.log('location.pathname:', location.pathname);
    console.log('전체 URL:', window.location.href);
    console.log('window.location.search:', window.location.search);
    
    // 현재 전역변수 상태 확인
    console.log('🔍 현재 전역변수 상태:', {
      isLogin,
      memberId: globalMemberId,
      user: user ? { memberId: user.memberId, nickname: user.nickname } : null
    });
    
    // window.location.search를 우선 사용
    const searchString = window.location.search || location.search;
    
    // 쿼리 파라미터가 없으면 처리하지 않음
    if (!searchString) {
      console.log('쿼리 파라미터 없음, 처리 중단');
      return;
    }
    
    // 이미 처리된 경우 중복 실행 방지
    if (hasProcessed.current) {
      console.log('이미 처리됨, 중복 실행 방지');
      return;
    }
    
    // 이미 처리된 경우 중복 실행 방지
    if (location.pathname === '/signup') {
      console.log('이미 회원가입 페이지에 있음, 처리 중단');
      return;
    }
    
    // &&&&로그인 완료 후 이전 페이지 경로
    const redirectAfterLogin =
      sessionStorage.getItem('redirectAfterLogin') || '/';

    // 회원 정보 - searchString 사용
    const searchParams = new URLSearchParams(searchString);
    console.log('사용된 searchString:', searchString);
    const isNew = searchParams.get('isNew');

    const provider = searchParams.get('provider');
    const providerMemberId = searchParams.get('providerMemberId');
    console.log(provider, providerMemberId);
    
    const memberId = searchParams.get('memberId');

    //신규 회원: provider, providerId가 반드시 있어야 회원가입으로 이동
    if (isNew === 'true') {
      console.log('useSocialLogin - 신규 회원 감지');
      console.log('useSocialLogin - provider:', provider);
      console.log('useSocialLogin - providerMemberId:', providerMemberId);
      
             if (provider && providerMemberId) {
         // 전역 변수에 소셜 로그인 정보 저장
         setSocialLoginInfo(provider, providerMemberId);
         console.log('useSocialLogin - 소셜 로그인 정보 저장:', { provider, providerId: providerMemberId });
         
         // 전역변수 상태 확인
         console.log('🔍 신규 회원 처리 후 전역변수 상태:', {
           isLogin,
           memberId: globalMemberId,
           user: user ? { memberId: user.memberId, nickname: user.nickname } : null
         });
         
         hasProcessed.current = true; // 처리 완료 표시
         navigate('/signup');
       } else {
        console.log('useSocialLogin - 회원가입 정보 누락');
        alert('회원가입 정보가 누락되었습니다. 다시 시도해주세요.');
        navigate('/login');
      }
      return;
    }

    // 기존 회원: 로그인 처리
    if (isNew === 'false') {
      console.log('useSocialLogin - 기존 회원 감지');
      
      if (memberId !== null) {
        const numericMemberId = Number(memberId);
        console.log('useSocialLogin - memberId:', numericMemberId);
        
        // memberId 전역변수 저장 (isLogin은 자동으로 true로 변경됨)
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
                         setUser(user); // ✅ zustand 전역에 저장 (isLogin은 자동으로 true로 변경됨)
             console.log('useSocialLogin - 사용자 정보 저장 완료:', user);
             
             // 전역변수 상태 확인
             console.log('🔍 기존 회원 처리 후 전역변수 상태:', {
               isLogin,
               memberId: globalMemberId,
               user: user ? { memberId: user.memberId, nickname: user.nickname } : null
             });
          })
          .catch((error) => {
            console.error('유저 정보 가져오기 실패:', error);
            // 에러 발생 시 로그인 상태 초기화
            setMemberId(-1);
            clearUser();
          });

        // ⭐️ 스타 게시글 리스트 저장
        fetch(`https://i13a509.p.ssafy.io/api/v1/star?memberId=${numericMemberId}`, {
          method: 'GET',
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch star list');
            return res.json();
          })
          .then((response) => {
            const starIdLst = response.data.stars.map((item: any) => item.starId);
            setStarLst(starIdLst);
            console.log('⭐️ 로그인 시 스타 게시글 목록:', starIdLst);
          })
          .catch((error) => {
            console.error('⭐️ 스타 목록 가져오기 실패:', error);
          });

        // 팔로우 (멤버 id) 리스트 저장
        fetch(`https://i13a509.p.ssafy.io/api/v1/follow/member?memberId=${numericMemberId}`, {
          method: 'GET',
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch follow list');
            return res.json();
          })
          .then((response) => {
            const followUserIds = response.data.follows.map((item: any) => item.followId);
            setFollowUser(followUserIds);
            console.log('팔로우 사용자 목록:', followUserIds);
          })
          .catch((error) => {
            console.error('팔로우 목록 가져오기 실패:', error);
          });

      } else {
        console.log('useSocialLogin - memberId 누락');
        alert('로그인 정보가 누락되었습니다. 다시 시도해주세요.');
        navigate('/login');
        return;
      }



             // 로그인 완료, 이전 페이지로 리다이렉트
       hasProcessed.current = true; // 처리 완료 표시
      //  navigate(redirectAfterLogin);
      navigate('/home');
       // 로그인 전 경로는 사용했으니 지워주는 것이 안전
       sessionStorage.removeItem('redirectAfterLogin');
       return;
    }
  }, [location.search, location.pathname]); // 필요한 값만 의존성으로 설정

  return {
    handleSocialLoginWithLocation,
  };
};

export default useSocialLogin;
