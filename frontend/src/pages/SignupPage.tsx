// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React from 'react';
import { useSignup } from '@/hooks/auth/useSignup';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { useThemeStore } from '@/stores/themeStore';
import { Button } from '@/components/foundation/button';

// 다크모드 관련
const signupPageVariants = cva(
  'min-h-screen flex items-center justify-center transition-colors duration-300',
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
  const {
    formData,
    isNicknameChecked,
    isNicknameTaken,
    isCheckingNickname,
    isFormValid,
    handleNicknameChange,
    handleNicknameCheck,
    handleImageUpload,
    handleSubmit,
  } = useSignup();

  const { isDarkMode } = useThemeStore();

  return (
    <div className='max-w-md mx-auto px-6 py-16'>
      {/* Header */}
      <div className='text-center mb-16'>
        <h1 className='text-3xl font-bold mb-4'>회원가입</h1>
        <p>새로운 계정을 만들어보세요</p>
      </div>

      {/* Form Container */}
      <div
        className={cn(
          'rounded-2xl shadow-lg p-10 transition-colors duration-300',
          isDarkMode ? 'bg-dark-header' : 'bg-white'
        )}
      >
        {/* <div className="bg-white rounded-2xl shadow-lg p-10"> */}
        {/* Nickname Input Section */}
        <div className='mb-10'>
          <label className='block text-sm font-medium mb-2'>
            닉네임 <span className='text-red-500'>*</span>
          </label>
          <div className='flex gap-3'>
            <div className='flex-1'>
              <input
                type='text'
                value={formData.nickname}
                onChange={handleNicknameChange}
                placeholder='닉네임을 입력해 주세요'
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm',
                  isDarkMode
                    ? 'bg-dark-header border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                )}
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

        {/* 프로필 이미지 */}
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
                  <i className='fas fa-user text-4xl'></i>
                </div>
              )}
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium mb-2'>
                프로필 이미지
              </label>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
                id='profile-image-input'
              />
              <Button
                asChild
                variant={isDarkMode ? 'dark' : 'light'}
                className='w-full py-3 text-sm'
              >
                <label
                  htmlFor='profile-image-input'
                  className='cursor-pointer select-none'
                >
                  이미지 업로드
                </label>
              </Button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          variant='primary' // &&& primary 속성 적용
          className='w-full py-3 font-medium' // &&& 필요 시 너비와 패딩 유지
        >
          회원가입 완료
        </Button>
      </div>
    </div>
  );
};

export default SignupPage;
