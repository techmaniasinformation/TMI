import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    checkAuth
  } = useUserStore();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('인증 처리 중...');
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // URL에서 에러 파라미터 확인
        const error = searchParams.get('error');
        if (error) {
          console.error('[OAUTH_CALLBACK] OAuth 에러:', error);
          setStatus('error');
          setMessage(`인증 실패: ${error}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 인증 코드 확인
        const code = searchParams.get('code');
        if (!code) {
          console.error('[OAUTH_CALLBACK] 인증 코드 없음');
          setStatus('error');
          setMessage('인증 코드를 받지 못했습니다.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 잠시 대기 후 인증 상태 확인
        setTimeout(async () => {
          try {
            await checkAuth();
            setStatus('success');
            setMessage('로그인 성공! 메인 페이지로 이동합니다.');
            setTimeout(() => navigate('/home'), 2000);
          } catch (error) {
            console.error('[OAUTH_CALLBACK] 인증 상태 확인 실패:', error);
            setStatus('error');
            setMessage('로그인 상태 확인에 실패했습니다.');
            setTimeout(() => navigate('/login'), 3000);
          }
        }, 1000);
      } catch (error) {
        console.error('[OAUTH_CALLBACK] 콜백 처리 오류:', error);
        setStatus('error');
        setMessage('인증 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };
    handleOAuthCallback();
  }, [searchParams, navigate, checkAuth]);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center bg-gray-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-md w-full bg-white rounded-lg shadow-md p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, status === 'loading' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-gray-900 mb-2"
  }, "\uC778\uC99D \uCC98\uB9AC \uC911"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, message)), status === 'success' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "text-green-500 text-4xl mb-4"
  }, "\u2713"), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-gray-900 mb-2"
  }, "\uB85C\uADF8\uC778 \uC131\uACF5!"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, message)), status === 'error' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "text-red-500 text-4xl mb-4"
  }, "\u2717"), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-gray-900 mb-2"
  }, "\uC778\uC99D \uC2E4\uD328"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, message)))));
};
export default OAuthCallbackPage;