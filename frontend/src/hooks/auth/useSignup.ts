import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

export const useSignup = () => {
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
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isFormValid = !!formData.nickname.trim();

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 컴포넌트 언마운트 시 생성된 Object URL 해제
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 8) return;
    setFormData({ ...formData, nickname: value });
    setIsNicknameChecked(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous object URL if it exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleNicknameCheck = async () => {
    const nickname = formData.nickname.trim();
    if (!nickname || nickname.length > 8) {
      alert('닉네임은 1자 이상 8자 이하로 입력해주세요.');
      return;
    }
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
    
    const apiFormData = new FormData();
    
    // 1. JSON 데이터를 Blob으로 만들어 FormData에 추가
    const signupRequest = {
      provider: formData.provider,
      providerMemberId: formData.providerMemberId,
      nickname: formData.nickname,
    };
    apiFormData.append('signupRequest', new Blob([JSON.stringify(signupRequest)], { type: 'application/json' }));

    let profileImageUrl = '';

    try {
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const imageRes = await fetch('https://i13a509.p.ssafy.io/api/v1/images', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageRes.ok) {
          throw new Error('이미지 업로드 실패');
        }

        const imageData = await imageRes.json();
        profileImageUrl = imageData.data.imageUrl;
      }

      const signupRequest = {
        provider: formData.provider,
        providerMemberId: formData.providerMemberId,
        nickname: formData.nickname,
        memberProfileUrl: profileImageUrl,
      };

      const res = await fetch('https://i13a509.p.ssafy.io/api/v1/member/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(signupRequest),
      });

      if (!res.ok) {
        throw new Error('회원가입 요청 실패');
      }

      const data = await res.json();
      console.log('회원가입 성공:', data);

      if (data.data && data.data.memberId) {
        setUser(data.data);
        console.log('회원가입 후 전역변수 저장 완료:', data.data);
      }

      clearSocialLoginInfo();
      alert('회원가입이 완료되었습니다!');
      navigate(prevPath || '/'); // prevPath가 없으면 홈으로 이동

    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    imagePreview,
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
