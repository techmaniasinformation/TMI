import React from 'react';
import { useSignup } from '@/hooks/auth/useSignup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/themeStore'; // Import useThemeStore

const SignupPage = () => {
  // Removed SignupPageProps and VariantProps
  const {
    isDarkMode
  } = useThemeStore(); // Get isDarkMode state
  const {
    formData,
    imagePreview,
    // 미리보기 이미지 URL
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
    handleSubmit
  } = useSignup();
  const navigate = useNavigate();
  const {
    socialProvider,
    socialProviderId,
    prevPath
  } = useUserStore();
  useEffect(() => {
    if (!socialProvider || !socialProviderId) {
      navigate(prevPath);
    }
  }, [socialProvider, socialProviderId, navigate]);
  return /*#__PURE__*/React.createElement("div", {
    className: `max-w-md mx-auto px-6 py-16 ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-16"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-4"
  }, "\uD68C\uC6D0\uAC00\uC785"), /*#__PURE__*/React.createElement("p", {
    className: `${isDarkMode ? 'text-gray-300' : ''}`
  }, "\uC0C8\uB85C\uC6B4 \uACC4\uC815\uC744 \uB9CC\uB4E4\uC5B4\uBCF4\uC138\uC694")), /*#__PURE__*/React.createElement("div", {
    className: `rounded-2xl shadow-lg p-10 ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-10"
  }, /*#__PURE__*/React.createElement("label", {
    className: `block text-sm font-medium mb-2 flex items-center justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`
  }, /*#__PURE__*/React.createElement("span", null, "\uB2C9\uB124\uC784 ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-500"
  }, "*")), /*#__PURE__*/React.createElement("span", {
    className: `text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
  }, nicknameLength, "/8")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.nickname,
    onChange: handleNicknameChange,
    placeholder: "\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694",
    className: `w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors text-sm
                  ${nicknameError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : `${isDarkMode ? 'border-zinc-600 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  ${isDarkMode ? 'bg-zinc-700 text-white' : ''}
                `
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleNicknameCheck,
    disabled: !formData.nickname.trim() || isCheckingNickname,
    className: "px-4 py-3 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
  }, isCheckingNickname ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner fa-spin"
  }) : '중복 확인')), /*#__PURE__*/React.createElement("div", {
    className: "h-5 mt-1"
  }, nicknameError && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center text-red-600 text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle mr-1"
  }), nicknameError), isNicknameChecked && isNicknameTaken && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center text-red-600 text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle mr-1"
  }), "\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uB2C9\uB124\uC784\uC785\uB2C8\uB2E4."), isNicknameChecked && !isNicknameTaken && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center text-green-600 text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check-circle mr-1"
  }), "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uB2C9\uB124\uC784\uC785\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("div", {
    className: "mb-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-32 h-32 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0 ${isDarkMode ? 'bg-zinc-700 border-zinc-600' : 'bg-gray-100 border-gray-200'}`
  }, imagePreview ? /*#__PURE__*/React.createElement("img", {
    src: imagePreview,
    alt: "Profile",
    className: "w-full h-full object-cover object-center"
  }) : /*#__PURE__*/React.createElement("div", {
    className: `w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-600' : 'bg-gradient-to-br from-blue-100 to-purple-100'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas fa-user text-4xl ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: `block text-sm font-medium mb-2 object-cover ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`
  }, "\uD504\uB85C\uD544 \uC774\uBBF8\uC9C0"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: handleImageUpload,
    className: "hidden",
    id: "profile-image-input"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "profile-image-input",
    className: `block w-full px-4 py-3 border rounded-lg text-center cursor-pointer transition-colors text-sm ${isDarkMode ? 'border-zinc-600 bg-zinc-700 text-white hover:bg-zinc-600' : 'border-gray-300 hover:bg-gray-50'}`
  }, "\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC"))), /*#__PURE__*/React.createElement("p", {
    className: `text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
  }, "\uC774\uBBF8\uC9C0\uB294 10MB \uC774\uD558, \uC815\uD574\uC9C4 \uBE44\uC728\uC5D0 \uB9DE\uB294 \uC774\uBBF8\uC9C0\uB9CC \uC5C5\uB85C\uB4DC \uAC00\uB2A5\uD574\uC694.")), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    disabled: !isFormValid || !isNicknameChecked || isNicknameTaken || isSubmitting,
    className: "w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
  }, isSubmitting ? '가입 처리 중...' : '회원가입 완료')));
};
export default SignupPage;