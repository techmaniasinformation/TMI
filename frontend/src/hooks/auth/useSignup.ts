import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { useUserStore } from '@/stores/userStore';

export const useSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    socialProvider, 
    socialProviderId, 
    clearSocialLoginInfo,
    setMemberId,
    setUser,
    toggleIsLogin
  } = useUserStore();

  const [formData, setFormData] = useState({
    provider: socialProvider || '',
    providerMemberId: socialProviderId || '',
    nickname: '',
    memberProfileUrl: '',
  });

  const isFormValid = !!formData.nickname.trim();

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, nickname: e.target.value });
    setIsNicknameChecked(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) return;
    setIsCheckingNickname(true);
    try {
      const res = await fetch(
        `https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=${encodeURIComponent(formData.nickname)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) {
        throw new Error('닉네임 확인 요청 실패');
      }
      const json = await res.json();
      setIsNicknameChecked(true);
      setIsNicknameTaken(json.data.isDuplicated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || !isNicknameChecked || isNicknameTaken) return;

    setIsSubmitting(true);
    // data-form으로 변경할 필요 있으려나요....
    try {
      const payload = {
        provider: formData.provider,
        providerMemberId: formData.providerMemberId,
        nickname: formData.nickname,
        memberProfileUrl: formData.memberProfileUrl,  // Base64 혹은 URL
      };

      const res = await fetch('https://i13a509.p.ssafy.io/api/v1/member/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        // body: JSON.stringify(formData),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('회원가입 요청 실패');
      }

      const data = await res.json();
      console.log('회원가입 성공:', data);
      
      // 회원가입 완료 후 전역변수에 사용자 정보 저장
      if (data.data && data.data.memberId) {
        const memberId = data.data.memberId;
        const user = {
          memberId: memberId,
          nickname: formData.nickname,
          memberProfileUrl: formData.memberProfileUrl || '',
        };
        
        // 전역변수에 저장 (isLogin은 자동으로 true로 변경됨)
        setMemberId(memberId);
        setUser(user);
        
        console.log('회원가입 후 전역변수 저장 완료:', { memberId, user });
      }
      
      // 회원가입 완료 후 소셜 로그인 정보 정리
      clearSocialLoginInfo();
      
      alert('회원가입이 완료되었습니다!');
      
      // 홈페이지로 리다이렉트
      navigate('/');

    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isFormValid,
    isNicknameChecked,
    isNicknameTaken,
    isCheckingNickname,
    isSubmitting,
    handleNicknameChange,
    handleImageUpload,
    handleNicknameCheck,
    handleSubmit,
  };
};