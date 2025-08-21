// 스토어 액션들을 관리하는 통합 훅
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/themeStore';

// ===== User Store 액션 훅 =====
export function useUserActions() {
  const {
    toggleIsLogin,
    setUser,
    clearUser,
    setFollowUser,
    setFollowCompany,
    setSocialLoginInfo,
    clearSocialLoginInfo,
    setPrevPath,
    setSocialProvider,
    updateUserProfile,
    setNewUser,
    setNewUSer,
    checkAuth,
  } = useUserStore();

  return {
    // 로그인 상태 관리
    toggleIsLogin,
    setUser,
    clearUser,
    
    // 팔로우 관리
    setFollowUser,
    setFollowCompany,
    
    // 소셜 로그인 관리
    setSocialLoginInfo,
    clearSocialLoginInfo,
    setSocialProvider,
    
    // 네비게이션 관리
    setPrevPath,
    
    // 프로필 관리
    updateUserProfile,
    
    // 신규 사용자 관리
    setNewUser,
    setNewUSer, // 호환성 유지
    
    // 인증 확인 (임시)
    checkAuth,
  };
}

// ===== User Store 상태 훅 =====
export function useUserState() {
  const {
    isLogin,
    user,
    newUser,
    followUser,
    followCompany,
    socialProvider,
    socialProviderId,
    prevPath,
  } = useUserStore();

  return {
    isLogin,
    user,
    newUser,
    followUser,
    followCompany,
    socialProvider,
    socialProviderId,
    prevPath,
    // 유용한 computed 값들
    isAuthenticated: !!user,
    hasUser: !!user,
    userId: user?.memberId,
    userNickname: user?.nickname,
    userProfileUrl: user?.memberProfileUrl,
  };
}

// ===== Theme Store 액션 훅 =====
export function useThemeActions() {
  const { toggleTheme } = useThemeStore();

  return {
    toggleTheme,
  };
}

// ===== Theme Store 상태 훅 =====
export function useThemeState() {
  const { isDarkMode } = useThemeStore();

  return {
    isDarkMode,
    // 유용한 computed 값들
    theme: isDarkMode ? 'dark' : 'light',
    themeClass: isDarkMode ? 'dark' : '',
  };
}

// ===== 통합 스토어 훅 =====
export function useStoreActions() {
  const userActions = useUserActions();
  const themeActions = useThemeActions();

  return {
    user: userActions,
    theme: themeActions,
  };
}

export function useStoreState() {
  const userState = useUserState();
  const themeState = useThemeState();

  return {
    user: userState,
    theme: themeState,
  };
}

// ===== 개별 도메인별 훅들 (편의성) =====

// 인증 관련 훅
export function useAuth() {
  const { isLogin, user, isAuthenticated, hasUser } = useUserState();
  const { setUser, clearUser, checkAuth } = useUserActions();

  return {
    // 상태
    isLogin,
    user,
    isAuthenticated,
    hasUser,
    
    // 액션
    login: setUser,
    logout: clearUser,
    checkAuth,
  };
}

// 테마 관련 훅  
export function useTheme() {
  const { isDarkMode, theme, themeClass } = useThemeState();
  const { toggleTheme } = useThemeActions();

  return {
    // 상태
    isDarkMode,
    theme,
    themeClass,
    
    // 액션
    toggleTheme,
  };
}

// 팔로우 관련 훅
export function useFollow() {
  const { followUser, followCompany } = useUserState();
  const { setFollowUser, setFollowCompany } = useUserActions();

  return {
    // 상태
    followUser,
    followCompany,
    
    // 액션
    setFollowUser,
    setFollowCompany,
    
    // 유틸리티
    isFollowingUser: (userId: number) => followUser.includes(userId),
    isFollowingCompany: (companyId: number) => followCompany.includes(companyId),
  };
}

// 프로필 관련 훅
export function useProfile() {
  const { user, userNickname, userProfileUrl } = useUserState();
  const { updateUserProfile } = useUserActions();

  return {
    // 상태
    profile: user,
    nickname: userNickname,
    profileUrl: userProfileUrl,
    
    // 액션
    updateProfile: updateUserProfile,
  };
}

// 소셜 로그인 관련 훅
export function useSocialAuth() {
  const { socialProvider, socialProviderId, newUser } = useUserState();
  const { 
    setSocialLoginInfo, 
    clearSocialLoginInfo, 
    setSocialProvider, 
    setNewUser 
  } = useUserActions();

  return {
    // 상태
    socialProvider,
    socialProviderId,
    newUser,
    hasSocialInfo: !!(socialProvider && socialProviderId),
    
    // 액션
    setSocialLoginInfo,
    clearSocialLoginInfo,
    setSocialProvider,
    setNewUser,
  };
}

// 네비게이션 관련 훅
export function useNavigation() {
  const { prevPath } = useUserState();
  const { setPrevPath } = useUserActions();

  return {
    // 상태
    prevPath,
    
    // 액션
    setPrevPath,
    
    // 유틸리티
    goToPrevPath: () => {
      if (prevPath && prevPath !== '/') {
        window.location.href = prevPath;
      }
    },
  };
}
