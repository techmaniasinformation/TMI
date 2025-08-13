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

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_WIDTH = 1024;
  const MAX_HEIGHT = 1024;
  // 닉네임 글자수 체크: 한글도 1글자씩 정확히 체크하기 위해 Array.from 사용
  
  
  // 닉네임 관련 에러 메시지
  // ✅ 자모 금지(완성형만 허용), 2~8자
const NICKNAME_RE = /^[가-힣a-zA-Z0-9]{2,8}$/;
const isValidNickname = (v: string) => NICKNAME_RE.test(v);

// ✅ 유효 글자(완성형 한글/영문/숫자) 카운트 & 금지문자 체크 헬퍼
const ALLOWED_CHAR_RE = /[가-힣a-zA-Z0-9]/;           // 단일 문자 테스트용
const hasDisallowed = (s: string) => /[^가-힣a-zA-Z0-9]/.test(s);
const countAllowed = (s: string) =>
  Array.from(s).reduce((n, ch) => n + (ALLOWED_CHAR_RE.test(ch) ? 1 : 0), 0);

  const [nicknameError, setNicknameError] = useState<string | null>(null);

    //조건: 닉네임이 공백X, 2~8자, 중복 확인 완료, 중복 아님
  const isFormValid =
    isValidNickname(formData.nickname.trim()) &&
    isNicknameChecked &&
    !isNicknameTaken;

  useEffect(() => {
    // 컴포넌트 언마운트 시 생성된 Object URL 해제
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;

    const currentAllowed = countAllowed(formData.nickname);
    const nextAllowed = countAllowed(next);

    // (1) 유효 글자 수가 줄거나 같아지는 경우(삭제/교체 등): 그대로 허용
    if (nextAllowed <= currentAllowed) {
      setFormData({ ...formData, nickname: next });
    } else {
      // (2) 유효 글자가 증가하려는 입력인 경우: 8자 이내만 허용
      if (nextAllowed <= 8) {
        setFormData({ ...formData, nickname: next });
      }
      // nextAllowed > 8 이면 무시 → 더 이상 유효 글자 추가 불가
    }

    // 에러 갱신 (입력값은 그대로 보이게 유지)
    const effective = next; // 화면 표시값 그대로
    const allowedCount = countAllowed(effective);
    if (hasDisallowed(effective)) {
      setNicknameError('허용 외 문자가 포함되어 있어요 (자모·특수·공백 등).');
    } else if (allowedCount < 2) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else {
      setNicknameError(null);
    }
    setIsNicknameChecked(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const okType = /^image\/.*/.test(file.type);
    if (!okType) {
      alert('이미지 파일만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }
    if (file.size > 10485760) {
      alert('이미지는 10MB 이하만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }

    // 📏 가로/세로 길이 제한 검사
    const tempUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.width;
      const h = img.height;
      URL.revokeObjectURL(tempUrl); // 임시 URL 정리

      if (w > 1920 || h > 1080) {
        alert(`이미지 크기는 1920x1080px 이하만 가능합니다.
(현재: ${w}x${h}px)`);
        e.target.value = '';
        return;
      }

      // ✅ 통과 시 미리보기/상태 반영
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    };
    img.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      alert('이미지 로드에 실패했습니다. 다른 파일을 선택해 주세요.');
      e.target.value = '';
    };
    img.src = tempUrl;
  };

 const handleNicknameCheck = async () => {
    const nickname = formData.nickname.trim();

    if (!isValidNickname(nickname)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
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
        setNicknameError(null);
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
    if (!isValidNickname(formData.nickname.trim())) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
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
    apiFormData.append(
      'req', 
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
      console.log('User object after signup:', data.data);
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
    nicknameError,
    nicknameLength: countAllowed(formData.nickname),
    handleNicknameChange,
    handleImageUpload,
    handleNicknameCheck,
    handleSubmit,
  };
};
