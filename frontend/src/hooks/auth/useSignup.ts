import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { signup } from '@/api/auth/authService';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

interface SignupErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  nickname?: string;
  general?: string;
}

export function useSignup() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // 폼 데이터 업데이트
  const handleInputChange = useCallback((field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // 유효성 검사
  const validateForm = useCallback((): boolean => {
    const newErrors: SignupErrors = {};

    // 이메일 검사
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 비밀번호 검사
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검사
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 닉네임 검사
    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.length < 2 || formData.nickname.length > 8) {
      newErrors.nickname = '닉네임은 2~8자 사이여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // 회원가입 제출
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await signup({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });

      if ((response as any).success) {
        setUser((response as any).user);
        navigate('/');
      } else {
        setErrors({ general: (response as any).message || '회원가입에 실패했습니다.' });
      }
    } catch (error: any) {
      setErrors({ 
        general: error.message || '회원가입 중 오류가 발생했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, setUser, navigate]);

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
}
