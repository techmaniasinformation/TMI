import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useImageCompression } from '@/hooks/useImageCompression';
export const useSignup = () => {
  const navigate = useNavigate();
  const {
    socialProvider,
    socialProviderId,
    prevPath,
    clearSocialLoginInfo,
    setUser
  } = useUserStore();
  const [formData, setFormData] = useState({
    provider: socialProvider || '',
    providerMemberId: socialProviderId || '',
    nickname: ''
  });

  // 이미지 압축 커스텀 훅 사용
  const {
    selectedImage,
    imagePreview,
    handleImageUpload
  } = useImageCompression();
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 닉네임 관련 에러 메시지
  // ✅ 자모 금지(완성형만 허용), 2~8자
  const NICKNAME_RE = /^[가-힣a-zA-Z0-9]{2,8}$/;
  const isValidNickname = v => NICKNAME_RE.test(v);

  // ✅ 유효 글자(완성형 한글/영문/숫자) 카운트 & 금지문자 체크 헬퍼
  const ALLOWED_CHAR_RE = /[가-힣a-zA-Z0-9]/; // 단일 문자 테스트용
  const hasDisallowed = s => /[^가-힣a-zA-Z0-9]/.test(s);
  const countAllowed = s => Array.from(s).reduce((n, ch) => n + (ALLOWED_CHAR_RE.test(ch) ? 1 : 0), 0);
  const [nicknameError, setNicknameError] = useState(null);

  //조건: 닉네임이 공백X, 2~8자, 중복 확인 완료, 중복 아님
  const isFormValid = isValidNickname(formData.nickname.trim()) && isNicknameChecked && !isNicknameTaken;
  const handleNicknameChange = e => {
    const next = e.target.value;
    const currentAllowed = countAllowed(formData.nickname);
    const nextAllowed = countAllowed(next);

    // (1) 유효 글자 수가 줄거나 같아지는 경우(삭제/교체 등): 그대로 허용
    if (nextAllowed <= currentAllowed) {
      setFormData({
        ...formData,
        nickname: next
      });
    } else {
      // (2) 유효 글자가 증가하려는 입력인 경우: 8자 이내만 허용
      if (nextAllowed <= 8) {
        setFormData({
          ...formData,
          nickname: next
        });
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
  const handleNicknameCheck = async () => {
    const nickname = formData.nickname.trim();
    if (!isValidNickname(nickname)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
      return;
    }
    setIsCheckingNickname(true);
    try {
      const res = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=${encodeURIComponent(nickname)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('닉네임 확인 요청 실패');
      const json = await res.json();
      setIsNicknameChecked(true);
      setIsNicknameTaken(json.data.isDuplicated);

      // 중복 확인 결과는 UI에서 별도로 표시하므로 nicknameError는 설정하지 않음
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
      nickname: formData.nickname
    };
    apiFormData.append('req', new Blob([JSON.stringify(signupRequest)], {
      type: 'application/json'
    }));

    // 이미지 파일이 있으면 'profileImage' 키로 같이 추가 
    if (selectedImage) {
      apiFormData.append('profileImage', selectedImage);
    }
    try {
      const res = await fetch('https://i13a509.p.ssafy.io/api/v1/member/signup', {
        method: 'POST',
        body: apiFormData,
        // Content-Type 지정하지 않음
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('회원가입 요청 실패');
      }
      const data = await res.json();
      console.log('회원가입 성공:', data);
      if (data.data && data.data.memberId) {
        const memberId = data.data.memberId;

        // Fetch full user details after signup
        const userDetailsRes = await fetch(`https://i13a509.p.ssafy.io/api/v1/member/${memberId}`, {
          credentials: 'include'
        });
        if (!userDetailsRes.ok) throw new Error('Failed to fetch user details after signup');
        const userDetails = await userDetailsRes.json();
        const completeUser = {
          memberId: userDetails.data.memberId,
          nickname: userDetails.data.nickname,
          memberProfileUrl: userDetails.data.memberProfileUrl
        };
        setUser(completeUser);
        console.log('회원가입 후 전역변수 저장 완료:', completeUser);
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
    handleSubmit
  };
};