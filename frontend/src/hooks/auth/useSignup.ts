import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore'; 

export const useSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setMemberId, setUser } = useUserStore();
  const { provider, providerId } = location.state ?? {};


  const [formData, setFormData] = useState({
    provider: provider || '',
    providerMemberId: providerId || '',
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
    console.log('🔍 [SIGNUP] 닉네임 중복 확인 시작:', formData.nickname);
    console.log('🌐 [SIGNUP] API Base URL:', import.meta.env.VITE_API_BASE_URL);
    
    setIsCheckingNickname(true);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/v1/member/duplicate?nickname=${encodeURIComponent(formData.nickname)}`;
      console.log('🔍 [SIGNUP] 닉네임 확인 요청 URL:', url);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('🔍 [SIGNUP] 닉네임 확인 응답 상태:', res.status);
      
      if (!res.ok) {
        throw new Error(`닉네임 확인 요청 실패: ${res.status}`);
      }
      const json = await res.json();
      console.log('🔍 [SIGNUP] 닉네임 확인 응답:', json);
      
      setIsNicknameChecked(true);
      setIsNicknameTaken(json.data.isDuplicated);
      console.log('✅ [SIGNUP] 닉네임 중복 확인 완료 - 중복:', json.data.isDuplicated);
    } catch (err) {
      console.error('❌ [SIGNUP] 닉네임 확인 에러:', err);
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || !isNicknameChecked || isNicknameTaken) {
      console.warn('⚠️ [SIGNUP] 폼 유효성 검사 실패');
      console.log('📋 [SIGNUP] 폼 상태 - 유효:', isFormValid, '닉네임확인:', isNicknameChecked, '중복:', isNicknameTaken);
      return;
    }

    console.log('🚀 [SIGNUP] 회원가입 시작');
    console.log('🚀 [SIGNUP] 폼 데이터:', formData);
    
    setIsSubmitting(true);
    try {
      const payload = {
        provider: formData.provider,
        providerMemberId: formData.providerMemberId,
        nickname: formData.nickname,
        memberProfileUrl: formData.memberProfileUrl,  // Base64 혹은 URL
      };

      console.log('🚀 [SIGNUP] 전송할 페이로드:', payload);
      
      // 쿠키 확인 로그 (HttpOnly 쿠키는 document.cookie로 읽을 수 없음)
      const cookies = document.cookie;
      console.log('🚀 [SIGNUP] 현재 JavaScript 접근 가능한 쿠키들:', cookies);
      console.log('🚀 [SIGNUP] REGIST_TOKEN은 HttpOnly 쿠키이므로 JavaScript로 직접 읽을 수 없습니다.');
      console.log('🚀 [SIGNUP] 하지만 브라우저가 자동으로 HTTP 요청에 포함시킬 것입니다.');

      const url = `${import.meta.env.VITE_API_BASE_URL}/v1/member/signup`;
      console.log('🚀 [SIGNUP] 요청 URL:', url);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      console.log('🚀 [SIGNUP] 응답 상태:', res.status);
      console.log('🚀 [SIGNUP] 응답 헤더:', [...res.headers.entries()]);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ [SIGNUP] 에러 응답 내용:', errorText);
        throw new Error(`회원가입 요청 실패: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log('✅ [SIGNUP] 회원가입 성공:', data);
      
      // memberId 전역변수 저장
      const memberId = data.data.memberId;
      setMemberId(memberId);
      
      // 사용자 정보 조회해서 전역변수에 저장
      try {
        const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/member/${memberId}`, {
          credentials: 'include',
        });
        
        if (userRes.ok) {
          const userData = await userRes.json();
          const user = {
            memberId: userData.data.memberId,
            nickname: userData.data.nickname,
            memberProfileUrl: userData.data.memberProfileUrl,
          };
          setUser(user);
          console.log('✅ [SIGNUP] 사용자 정보 저장 완료:', user);
        }
      } catch (error) {
        console.error('❌ [SIGNUP] 사용자 정보 조회 실패:', error);
      }
      
             alert('회원가입이 완료되었습니다!');
       
       // 홈페이지로 리다이렉트
       navigate('/home');

    } catch (error) {
      console.error('❌ [SIGNUP] 회원가입 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`회원가입에 실패했습니다: ${errorMessage}`);
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