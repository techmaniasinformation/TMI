import React, { useState } from 'react';
// import { useSignup } from '@/hooks/auth/useSignup';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { useThemeStore } from '@/stores/themeStore';

// ####### useUserStore 보류!!!
// 다크모드 관련
const signupPageVariants = cva(
    'flex items-center justify-center transition-colors duration-300 py-8',
  {
    variants: {
      variant: {
        light: 'bg-light-bg text-dark-bg ',
        dark: 'bg-dark-bg text-white ',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

interface SignupPageProps extends VariantProps<typeof signupPageVariants> {}

const SignupPage: React.FC<SignupPageProps> = () => {
  // const {
  //   formData,
  //   isFormValid,
  //   handleNicknameChange,
  //   handleImageUpload,
  //   handleSubmit,
  // } = useSignup();
// 초기 설정은 닉네임 프로필 이미지만
    const [formData, setFormData] = useState({
    nickname: '',
    profileImage: '',
  });

    // 입력 유효성 검증
  const isFormValid = !!formData.nickname.trim();

  //닉네임 중복 확인 관련 상태를 페이지 내부에서 정의
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  // 회원가입 진행 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  //닉네임 입력
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, nickname: e.target.value });
    setIsNicknameChecked(false); // 입력 바뀌면 중복 확인 초기화
  };


    // 프로필 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

//닉네임 중복 확인 함수 정의
const handleNicknameCheck = async () => {
  if (!formData.nickname.trim()) return;
  setIsCheckingNickname(true);
  try {
    // &&& body 제거하고 쿼리 파라미터로 닉네임 전달
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
    setIsNicknameTaken(json.data.isDuplicated); // &&& API 응답 key에 맞춰 조정 필요
  } catch (error) {
    console.error('닉네임 확인 실패:', error);
  } finally {
    setIsCheckingNickname(false);
  }
};


// 회원가입 요청 
  const handleSubmit = async () => {
    if (!isFormValid || !isNicknameChecked || isNicknameTaken) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('https://i13a509.p.ssafy.io/api/v1/member/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: formData.nickname,
          profileImage: formData.profileImage,
          // 추가 정보 필요 시 여기에 포함
        }),
      });

      if (!res.ok) {
        throw new Error('회원가입 요청 실패');
      }

      const data = await res.json();
      console.log('회원가입 성공:', data);

      alert('회원가입이 완료되었습니다!');
      // &&& 회원가입 후 페이지 이동 로직 추가 (예: 로그인 페이지로 이동)
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-md mx-auto px-6 py-16'>
      {/* Header */}
      <div className='text-center mb-16'>
        <h1 className='text-3xl font-bold mb-4'>회원가입</h1>
        <p>새로운 계정을 만들어보세요</p>
      </div>

      {/* Form Container */}
      <div className='bg-white rounded-2xl shadow-lg p-10'>
        {/* Nickname Input Section */}
        <div className='mb-10'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            닉네임 <span className='text-red-500'>*</span>
          </label>
          <div className='flex gap-3'>
            <div className='flex-1'>
              <input
                type='text'
                value={formData.nickname}
                onChange={(e) => {
                  handleNicknameChange(e);
                  setIsNicknameChecked(false); //입력 바뀌면 중복 확인 초기화
                }}
                placeholder='닉네임을 입력해 주세요'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              />
            </div>
            <button
              onClick={handleNicknameCheck}
              disabled={!formData.nickname.trim() || isCheckingNickname}
              className='px-4 py-3 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer'
            >
              {isCheckingNickname ? (
                <i className='fas fa-spinner fa-spin'></i>
              ) : (
                '중복 확인'
              )}
            </button>
          </div>

          {/* Validation Message Container */}
          <div className='h-5 mt-1'>
            {/* Error Message */}
            {isNicknameChecked && isNicknameTaken && (
              <div className='flex items-center text-red-600 text-xs'>
                <i className='fas fa-exclamation-circle mr-1'></i>
                이미 사용 중인 닉네임입니다.
              </div>
            )}
            {/* Success Message */}
            {isNicknameChecked && !isNicknameTaken && (
              <div className='flex items-center text-green-600 text-xs'>
                <i className='fas fa-check-circle mr-1'></i>
                사용 가능한 닉네임입니다.
              </div>
            )}
          </div>
        </div>

        {/* Profile Image Section */}
        <div className='mb-12'>
          <div className='flex items-start gap-4'>
            <div className='w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-lg flex-shrink-0'>
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt='Profile'
                  className='w-full h-full object-cover object-top'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100'>
                  <i className='fas fa-user text-4xl text-gray-400'></i>
                </div>
              )}
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                프로필 이미지
              </label>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
                id='profile-image-input'
              />
              <label
                htmlFor='profile-image-input'
                className='block w-full px-4 py-3 border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors text-sm'
              >
                이미지 업로드
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || !isNicknameChecked || isNicknameTaken} 
          className='w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
};

export default SignupPage; 