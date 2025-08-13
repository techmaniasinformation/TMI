import React from 'react';
import { useSignup } from '@/hooks/auth/useSignup';
import { cva, type VariantProps } from 'class-variance-authority';
import { useNavigate } from 'react-router-dom';
import { useEffect} from 'react';
import { useUserStore } from '@/stores/userStore';

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
  const {
    formData,
    imagePreview, // 미리보기 이미지 URL
    isFormValid,
    isNicknameChecked,
    isNicknameTaken,
    isCheckingNickname,
    isSubmitting,
    nicknameError,
    nicknameLength,
    handleNicknameChange,
    handleImageUpload,
    handleNicknameCheck,
    handleSubmit,
  } = useSignup();

  const navigate = useNavigate();
  const { socialProvider, socialProviderId, prevPath } = useUserStore();

  useEffect(() => {
    if (!socialProvider || !socialProviderId) {
      navigate(prevPath);
    }
  }, [socialProvider, socialProviderId, navigate]);

  return (
    <div className='max-w-md mx-auto px-6 py-16'>
      <div className='text-center mb-16'>
        <h1 className='text-3xl font-bold mb-4'>회원가입</h1>
        <p>새로운 계정을 만들어보세요</p>
      </div>

      <div className='bg-white rounded-2xl shadow-lg p-10'>
        <div className='mb-10'>
          <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between'>
            <span>닉네임 <span className='text-red-500'>*</span></span>
            <span className="text-xs text-gray-500">{nicknameLength}/8</span>
          </label>
          <div className='flex gap-3'>
            <div className='flex-1'>
              <input
                type='text'
                value={formData.nickname}
                onChange={handleNicknameChange}
                placeholder='닉네임을 입력해 주세요'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition-colors text-sm
                  ${nicknameError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                `}
              />
              {/* 닉네임 에러 메시지 */}
              {nicknameError && (
                <p className='mt-1 text-xs text-red-600 flex items-center'>
                  <i className='fas fa-exclamation-circle mr-1'></i>
                  {nicknameError}
                </p>
              )}
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
          <div className='h-5 mt-1'>
            {isNicknameChecked && isNicknameTaken && (
              <div className='flex items-center text-red-600 text-xs'>
                <i className='fas fa-exclamation-circle mr-1'></i>
                이미 사용 중인 닉네임입니다.
              </div>
            )}
            {isNicknameChecked && !isNicknameTaken && (
              <div className='flex items-center text-green-600 text-xs'>
                <i className='fas fa-check-circle mr-1'></i>
                사용 가능한 닉네임입니다.
              </div>
            )}
          </div>
        </div>

        <div className='mb-12'>
          <div className='flex items-start gap-4'>
            <div className='w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-lg flex-shrink-0'>
              {imagePreview ? (
                <img
                                    src={imagePreview}
                  alt='Profile'
                  className='w-full h-full object-cover object-center'
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

        <button
          onClick={handleSubmit}
          disabled={!isFormValid || !isNicknameChecked || isNicknameTaken || isSubmitting}
          className='w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
        >
          {isSubmitting ? '가입 처리 중...' : '회원가입 완료'}
        </button>
      </div>
    </div>
  );
};

export default SignupPage;