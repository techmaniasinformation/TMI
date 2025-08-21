import { useState, useRef } from 'react';
import { useUserStore } from '@/stores/userStore';

interface UseHeaderStateProps {
  variant?: 'light' | 'dark';
}

export function useHeaderState({ variant = 'light' }: UseHeaderStateProps = {}) {
  const { user } = useUserStore();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const menuRootRef = useRef<HTMLDivElement>(null);

  // 인증 상태 계산
  const isAuthenticated = !!user;

  // 텍스트 색상 결정
  const textColor = variant === 'dark' ? 'text-white' : 'text-dark-bg';

  // 안전한 프로필 이미지 URL
  const safeProfileSrc = user?.memberProfileUrl || '/default-profile.png';

  return {
    // 상태
    user,
    isAuthenticated,
    showProfileMenu,
    recentSearches,
    menuRootRef,
    
    // 스타일
    variant,
    textColor,
    safeProfileSrc,
    
    // 액션
    setShowProfileMenu,
    setRecentSearches,
  };
}
