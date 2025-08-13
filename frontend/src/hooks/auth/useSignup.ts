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

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

    //조건: 닉네임이 공백X, 1~8자, 중복 확인 완료, 중복 아님
  const isFormValid = 
    !!formData.nickname.trim() &&
    formData.nickname.length > 0 &&
    formData.nickname.length <= 8 &&
    isNicknameChecked &&
    !isNicknameTaken;

   // 닉네임 관련 에러 메시지 상태 추가
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    // 컴포넌트 언마운트 시 생성된 Object URL 해제
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // 허용 문자만 필터링 (한글, 영어, 숫자)
    value = value.replace(/[^가-힣a-zA-Z0-9]/g, '');

    // 8글자 초과 시 잘라내기
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    setFormData({ ...formData, nickname: value });
    setIsNicknameChecked(false);

    // 입력 시 에러 메시지 초기화
    if (value.length === 0) {
      setNicknameError('닉네임을 입력해주세요.');
    } else if (value.length > 8) {
      setNicknameError('닉네임은 8자 이하로 입력해주세요.');
    } else {
      setNicknameError('');
    }
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

    // &&& alert → 상태 기반 에러 메시지로 변경
    if (!nickname) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (nickname.length > 8) {
      setNicknameError('닉네임은 8자 이하로 입력해주세요.');
      return;
    }

    setIsCheckingNickname(true);
    try {
      const res = await fetch(
        `https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=${encodeURIComponent(nickname)}`,
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

      if (json.data.isDuplicated) {
        setNicknameError('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameError('');
      }
    } catch (err) {
      console.error(err);
      setNicknameError('닉네임 중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingNickname(false);
    }
  };


  const handleSubmit = async () => {
    // 에러 메시지 기반 유효성 검사
    if (!formData.nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (formData.nickname.length > 8) {
      setNicknameError('닉네임은 8자 이하로 입력해주세요.');
      return;
    }
    if (!isNicknameChecked || isNicknameTaken) {
      setNicknameError('닉네임 중복 확인을 완료해주세요.');
      return;
    }
    setIsSubmitting(true);
    
    const apiFormData = new FormData();
    
    // 1. JSON 데이터를 Blob으로 만들어 FormData에 추가
    const signupRequest = {
      provider: formData.provider,
      providerMemberId: formData.providerMemberId,
      nickname: formData.nickname,
    };
    apiFormData.append('req', 
      new Blob([JSON.stringify(signupRequest)], 
      { type: 'application/json' }));

    // 이미지 파일이 있으면 'profileImage' 키로 같이 추가 
  if (imageFile) {
    apiFormData.append('profileImage', imageFile);
  }

  try {
    const res = await fetch('https://i13a509.p.ssafy.io/api/v1/member/signup', {
      method: 'POST',
      body: apiFormData, // Content-Type 지정하지 않음
      credentials: 'include',
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
    navigate(prevPath || '/');
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
