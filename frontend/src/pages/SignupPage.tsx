import React from 'react';
import { useSignup } from '@/hooks/auth/useSignup';
import { useNavigate } from 'react-router-dom';
import { useEffect} from 'react';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/themeStore'; // Import useThemeStore

const SignupPage: React.FC = () => { // Removed SignupPageProps and VariantProps
  const { isDarkMode } = useThemeStore(); // Get isDarkMode state
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
    <div className={`max-w-md mx-auto px-6 py-16 ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <div className='text-center mb-16'>
        <h1 className='text-3xl font-bold mb-4'>회원가입</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : ''}`}>새로운 계정을 만들어보세요</p>
      </div>

      <div className={`rounded-2xl shadow-lg p-10 ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white'}`}>
        <div className='mb-10'>
          <label className={`block text-sm font-medium mb-2 flex items-center justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span>닉네임 <span className='text-red-500'>*</span></span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{nicknameLength}/8</span>
          </label>
          <div className='flex gap-3'>
            <div className='flex-1'>
              <input
                type='text'
                value={formData.nickname}
                onChange={handleNicknameChange}
                placeholder='닉네임을 입력해 주세요'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors text-sm
                  ${nicknameError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : `${isDarkMode ? 'border-zinc-600 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  ${isDarkMode ? 'bg-zinc-700 text-white' : ''}
                `}
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
          <div className='h-5 mt-1'>
            {nicknameError && (
              <div className='flex items-center text-red-600 text-xs'>
                <i className='fas fa-exclamation-circle mr-1'></i>
                {nicknameError}
              </div>
            )}
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
            <div className={`w-32 h-32 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0 ${isDarkMode ? 'bg-zinc-700 border-zinc-600' : 'bg-gray-100 border-gray-200'}`}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt='Profile'
                  className='w-full h-full object-cover object-center'
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-600' : 'bg-gradient-to-br from-blue-100 to-purple-100'}`}>
                  <i className={`fas fa-user text-4xl ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}></i>
                </div>
              )}
            </div>
            <div className='flex-1'>
              <label className={`block text-sm font-medium mb-2 object-cover ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                className={`block w-full px-4 py-3 border rounded-lg text-center cursor-pointer transition-colors text-sm ${isDarkMode ? 'border-zinc-600 bg-zinc-700 text-white hover:bg-zinc-600' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                이미지 업로드
              </label>
            </div>
            
          </div>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            이미지는 10MB 이하, 정해진 비율에 맞는 이미지만 업로드 가능해요.
          </p>
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