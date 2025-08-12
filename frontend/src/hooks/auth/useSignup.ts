import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

export const useSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    socialProvider,
    socialProviderId,
    prevPath,
    clearSocialLoginInfo,
    setUser,
  } = useUserStore();

  const [formData, setFormData] = useState({
    provider: socialProvider || '',
    providerMemberId: socialProviderId || '',
    nickname: '',
    memberProfileUrl: '', // This will hold the preview URL
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const isFormValid = !!formData.nickname.trim();

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (formData.memberProfileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(formData.memberProfileUrl);
      }
    };
  }, [formData.memberProfileUrl]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 8) return;
    setFormData({ ...formData, nickname: value });
    setIsNicknameChecked(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous object URL to prevent memory leaks
      if (formData.memberProfileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(formData.memberProfileUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, memberProfileUrl: previewUrl }));
      setImageFile(file);
    }
  };

  const handleNicknameCheck = async () => {
    const nickname = formData.nickname.trim();
    if (!nickname) return;
    if (nickname.length > 8) {
      alert('닉네임은 최대 8자까지 가능합니다.');
      return;
    }
    setIsCheckingNickname(true);
    try {
      const res = await fetch(
        `https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=${encodeURIComponent(nickname)}`
      );
      if (!res.ok) throw new Error('닉네임 확인 요청 실패');
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

    const signupData = new FormData();
    const requestDto = {
        provider: formData.provider,
        providerMemberId: formData.providerMemberId,
        nickname: formData.nickname,
      };
  
      const json = JSON.stringify(requestDto);
      const blob = new Blob([json], { type: "application/json" });
  
      signupData.append('req', blob); 

    if (imageFile) {
        signupData.append('profileImage', imageFile); 
    }

    try {
      const res = await fetch('https://i13a509.p.ssafy.io/api/v1/member/signup', {
        method: 'POST',
        credentials: 'include',
        body: signupData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '회원가입 요청 실패');
      }

      const data = await res.json();
      console.log('회원가입 성공:', data);

      if (data.data && data.data.memberId) {
        const { memberId, nickname, memberProfileUrl } = data.data;
        const user = { memberId, nickname, memberProfileUrl: memberProfileUrl || '' };
        setUser(user);
        console.log('회원가입 후 전역변수 저장 완료:', { user });
      }

      clearSocialLoginInfo();
      alert('회원가입이 완료되었습니다!');
      navigate(prevPath || '/');

    } catch (error: any) {
      console.error('회원가입 실패:', error);
      alert(error.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
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
