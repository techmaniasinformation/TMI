import { useState } from 'react';

interface SignupFormData {
  nickname: string;
  profileImage: string | null;
}

export const useSignup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    nickname: '',
    profileImage: null
  });
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setFormData(prev => ({ ...prev, nickname: newNickname }));
    setIsNicknameChecked(false);
    setIsNicknameTaken(false);
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) return;
    
    setIsCheckingNickname(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsNicknameTaken(formData.nickname === '중복');
      setIsNicknameChecked(true);
      setIsCheckingNickname(false);
    }, 1000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ 
          ...prev, 
          profileImage: e.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (isFormValid) {
      console.log('회원가입 제출:', formData);
      // 회원가입 로직 구현
    }
  };

  const isFormValid = formData.nickname.trim() && isNicknameChecked && !isNicknameTaken;

  return {
    formData,
    isNicknameChecked,
    isNicknameTaken,
    isCheckingNickname,
    isFormValid,
    handleNicknameChange,
    handleNicknameCheck,
    handleImageUpload,
    handleSubmit
  };
}; 